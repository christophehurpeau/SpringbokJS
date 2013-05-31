//var jshint=require('jshint').JSHINT;
var fs=require('fs'), sysPath=require('path') ,Preprocessor=require('../Preprocessor'), UglifyJS=require('uglify-js');

const COMPILER_JAR='/var/www/springbok/core/libs/src/ClosureCompiler/_gclosure.jar';
module.exports={
	type:'javascript',
	extension:'js',
	priority:0,
	
	init:function(config){
		
	},
	/*
	lint:function(file,data,callback){
		var success=jshint(data,{
			browser:false,
			cap:false,
			node:true,
			undef:false,
		});
		if(success) return callback();
		else{
			callback(
				jshint.errors.filter(function(error){ return error != null; })
					.map(function(error){
						//var evidence= (error.evidence ? "\n\n" + error.evidence + "\n" : '\n');
						return "" + error.reason + " " + (error.id || '') + " at line " + error.line + ", column " + error.character;
					})
					.join('\n')
			);
		}
	},*/
	
	compile:function(file,data,callback){
		if(file.isWebApp){
			console.log('COMPILING WEBAPP : '+file.path);
			
			if(file.isWebAppEntry){
				data="var WEBAPP_NAME='"+file.webApp+"';\nincludeCore('browser/webapp');\n"
					+'App.jsapp('+JSON.stringify(file.fileList.config.projectName)+',__SPRINGBOK_COMPILED_TIME__);'
					+('S.router.init('+JSON.stringify(UFiles.readYamlSync(file.fileList.rootPath+'src/'+file.webApp+'/config/routes.yml'))
						+','+JSON.stringify(UFiles.readYamlSync(file.fileList.rootPath+'src/config/routesLangs.yml'))+');')
					+data
					+'App.run();';
			}else if(!/^[a-zA-Z_\-]\/(controllers|models|views|viewsLayouts|web)\//.test(file.path))
				return callback(false);
	
		}
		
		
		this[file.isBrowser ? 'includesBrowser' : 'includesNode' ](data,file.dirname,function(data,includes){
			//console.log("----","\n",data,"\n","----")
			
			
			
			data=data.replace('__SPRINGBOK_COMPILED_TIME__',Date.now());
			
			if(file.dirname.endsWith('/controllers/')){
				if(!file.isBrowser){
					if(data.startsWith('module.exports')) throw Error('module.exports is automaticly added by Springbok.');
					data=data.replace(/App\.[A-Za-z]*Controller\(\{/g,'module.exports=$&');
				}
			}
			
			var defs=(file.fileList.buildConfig && file.fileList.buildConfig.config) || {};
			defs.DEV=true; defs.PROD=false; var devResult=Preprocessor(defs,data,file.isBrowser);
			defs.DEV=false; defs.PROD=true; var prodResult=Preprocessor(defs,data,file.isBrowser);
			
			if(data.match(/\/\*\s+\/?(NODE|BROWSER|RM|HIDE|REMOVE|NONE|NODE\|\|BROWSER|DEV\|\|PROD)\s+\*\//))
				return callback('error match NODE|BROWSER|RM|HIDE|REMOVE|NONE|NODE\|\|BROWSER|DEV\|\|PROD');
			
			callback(null,devResult,prodResult,includes['']);
		});
	},
	
	optimize:function(file,devResult,prodResult,onEnd){
		if(!file.isBrowser) return onEnd(null,devResult,prodResult);
		
		file.paths(function(err,paths){
			if(err) return onEnd(err);
			UArray.forEachAsync([
						{path:paths[0],result:devResult,defs:{DEV:true,PROD:false,NODE:false,BROWSER:true}},
						{path:paths[1],result:prodResult,defs:{DEV:false,PROD:true,NODE:false,BROWSER:true}}],
						function(obj,onEnd){
				var path=obj.path, result=obj.result;
				console.log('optimize: '+path);
				var slicedPath=path.slice(0,-3),srcPath=slicedPath+'.src.js',oldIePath=slicedPath+'.oldIe.js';
				
				module.exports.callUglifyJs(result,obj.defs,true,function(err,ieResult){
					if(err) return onEnd(err);
					fs.writeFile(srcPath,ieResult,function(err){
						if(err) return onEnd(err);
						
						module.exports.callGoogleClosureCompiler(srcPath,oldIePath,true,false,function(err){
							if(err) return onEnd(err);
							
							/* now for modern browsers */
							module.exports.callUglifyJs(result,obj.defs,false,function(err,modernResult){
								if(err) return onEnd(err);
								fs.writeFile(srcPath,modernResult,function(err){
									if(err) return onEnd(err);
									
									module.exports.callGoogleClosureCompiler(srcPath,path,false,obj.defs.DEV ? slicedPath+'.map.js' : false,
										obj.defs.DEV ? function(err){
												if(err) return onEnd(err);
												fs.appendFile(path,"\n//@ sourceMappingURL=/web/"+sysPath.basename(path).slice(0,-3)+'.src.js',onEnd);
											} : onEnd);
								});
							});
						})
					});
				});
				
			},function(error){ onEnd(error || false); });
		});
	},
	
	callUglifyJs:function(code,defs,oldIe,onEnd){
		try{
			defs.OLD_IE=!!oldIe;
			var toplevel=UglifyJS.parse(code,{});
			toplevel.figure_out_scope();
			var compressor = UglifyJS.Compressor({ unsafe:true, comparisons:true, global_defs:defs });
			var compressed_ast = toplevel.transform(compressor);
			
			//var source_map = UglifyJS.SourceMap({});
			var stream = UglifyJS.OutputStream({ beautify:true, comments:'all' /*source_map:source_map*/ });
			compressed_ast.print(stream);
			onEnd(null,stream.toString());
		}catch(err){
			if(err.line){
				var ErrorWithContent=function(err){ this.err=err; };
				ErrorWithContent.prototype.toString = function(){
					return this.err.toString()
							+ "\n\n File Content :\n"
							+ code.split("\n").slice(this.err.line-2,this.err.line+3).join("\n");
				};

				err=new ErrorWithContent(err);
			}
			onEnd(err);
		}
	},
	
	callGoogleClosureCompiler:function(srcPath,output,forOldIe,sourceMap,onEnd){
		console.log('GoogleClosure: compiling '+srcPath+' to '+output);
		UExec.exec('java -jar '+ UExec.escape(COMPILER_JAR) +' --compilation_level SIMPLE_OPTIMIZATIONS --language_in=ECMASCRIPT5_STRICT'
						+' --js '+ UExec.escape(srcPath)+' --js_output_file '+ UExec.escape(output)
						+(sourceMap&&false ? '--create_source_map '+UExec.escape(sourceMap)+' --source_map_format=V3' : ''),
			function (error, stdout, stderr){
				//console.error(error,"\n",stdout,"\n",stderr);
				if (error) onEnd(stderr);
				else{
					console.log(stdout);
					console.log(' '+ output + ' built.');
					onEnd();
				}
			});
	},
	
	_checkTrailingSlash:function(inclPath){
		if(inclPath.slice(-1)==='/'){
			var slicedInclPath=inclPath.slice(0,-1);
			inclPath+=slicedInclPath.contains('/') ? UString.substrLast(slicedInclPath,'/') : slicedInclPath;
		}
		return inclPath;
	},
	
	includesNode:function(data,dirname,callback,includes){
		data=data.replace(/^include(Core|Plugin|)\(\'([\w\s\._\-\/\&\+]+)\'\)\;$/mg,function(match,from,inclPath){
			inclPath=this._checkTrailingSlash(inclPath);
			if(from==='Core') inclPath=this.isCore ? inclPath='/'+inclPath : 'springbokjs/'+inclPath;
			else if(from==='Plugin'){
				inclPath='TODO';
			}else if(incluPath[0]!=='.') inclPath='./'+inclPath;
			
			if(inclPath[0]==='/') inclPath=('../'.repeat(UString.trimRight(dirname,'\/').split('/').length)||'./')+inclPath.substr(1);
			return 'require("'+inclPath+'");';
		}.bind(this));
		callback(data,{});
	},
	includesBrowser:function(data,dirname,callback,includes){
		if(!includes) includes={'':{},Core:{},CoreUtils:{},'Plugin':{}};
		data=data.replace(/^include(Core|JsCore|CoreUtils|Plugin|)\(\'([\w\s\._\-\/\&\+]+)\'\)\;$/mg,function(match,from,inclPath){
			if(inclPath.slice(-1)==='/') inclPath+=sysPath.basename(inclPath)+'.js';
			
			if(from==='JsCore') from='Core';
			if(includes[from][inclPath]) return '';
			includes[from][inclPath]=1;
			var path;
			if(from==='Core') path=CORE_SRC;
			else if(from==='CoreUtils') path=CORE_MODULES+'springboktools/';
			else if(from==='Plugin') path='TODO';
			else path=dirname;
			
			path+=inclPath;
			if(inclPath.slice(-3)!=='.js') path+='.js';
			
			if(!fs.existsSync(path)) throw new Error("file doesn't exists: "+path+"\nline= "+match);
			
			return this.includesBrowser(fs.readFileSync(path,'utf-8'),dirname,false,includes);
		}.bind(this));
		callback&&callback(data,includes);
		return data;
	}
}
