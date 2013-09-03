var jshint=require('jshint').JSHINT;
var fs=require('fs'), sysPath=require('path') ,Preprocessor=require('../Preprocessor'), UglifyJS=require('uglify-js');
var diveSync=require('diveSync');

const COMPILER_JAR='/var/www/springbok/core/libs/src/ClosureCompiler/_gclosure.jar';
module.exports={
	type:'javascript',
	extension:'js',
	priority:0,
	compileOldIE:false,
	//_enums:fs.readFileSync(CORE_SRC+'browser/_enums.js'),
	
	init:function(config){
	},
	/*
	lint:function(file,data,callback){
		if(!data) return callback();
		var success=jshint(data,{
			browser: false,
			node: true,
			
			bitwise: false,
			camelcase: true,
			curly: false,
			eqeqeq: false,
			immed: true,
			latedef: false,
			newcap: true,
			noarg: true,
			nonew: false,
			undef: false,
			strict: false,
			trailing: true,
			boss: true,
			eqnull: true,
			esnext: true,
			regexdash: true,
			smarttabs: true,
			lastsemic: true,
			proto: true,
			supernew: true,
			validthis: true,
			
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
			if(file.isWebAppEntry){
				var configPath=file.fileList.rootPath+'src/'+file.webApp+'/config/',
					config=UFiles.readYamlSync(configPath+'/config.yml');
				
				if(!config.name) config.name=file.fileList.config.projectName;
				if(!config.availableLangs) return callback('config.availableLangs must be set in your config file for webapp "'+file.webApp+'"');
				config.allLangs=config.allLangs||config.availableLangs;
				
				config.id=file.webApp;
				config.version=Date.now();
				data="var Config="+JSON.stringify(config)+";\n"//keep in the function
					+"includeCore('browser/webapp/');\n"
					+('App.preinit('+JSON.stringify(UFiles.readYamlSync(configPath+'routes.yml'))
						+','+JSON.stringify(UFiles.readYamlSync(configPath+'routesLangs.yml'))+');')
					+"\n"+data+"\n"
					+'App.run();';
			}else if(file.isWebAppModel){
				var folder=file.srcPath.slice(0,-3)+'/',folderName=file.basename.slice(0,-3);
				diveSync(folder,function(err,path){
					if(err) console.error(err.stack);
					else data+="\ninclude('"+folderName+path.substr(folder.length)+"');";
				});
				data+="\ndb.init()";
			}
	
		}
		
		
		this[file.isBrowser ? 'includesBrowser' : 'includesNode' ](data,file,function(data,includes){
			//console.log("----","\n",data,"\n","----")
			
			if(file.isWebAppEntry){
				includes.app[file.webApp+'/config/routes.yml']=1;
				includes.app[file.webApp+'/config/routesLangs.yml']=1;
			}
			
			
			data=data.replace('__SPRINGBOK_COMPILED_TIME__',Date.now());
			
			
			UObj.forEach({
				'/controllers/':/App\.[A-Za-z]*Controller\(\{/g,
				'/models/':/App\.Model\(/g
			},function(dirnameEndsWith,regexp){
				if(file.dirname.endsWith(dirnameEndsWith)){
					if(!file.isBrowser){
						if(data.startsWith('module.exports')) throw Error('module.exports is automaticly added by Springbok.');
						data=data.replace(regexp,'module.exports=$&');
					}
				}
			});
			
			if(file.isBrowser){
				if(file.isMainJs) data='(function(window,undefined){var baseUrl="/";'+data+'})(window);';
				else if(file.isWebApp) data='(function(App,undefined){var baseUrl="/";'+data+'})(App);';
				data=data.replace(/\bglobal\./g,'window.');
				data=data.replace(/\bObject.defineProperty\(global,/g,'Object.defineProperty(window,');
				
			}
			
			var defs=(file.fileList.buildConfig && file.fileList.buildConfig.config) || {};
			defs.WebApp=!!file.isWebAppEntry;
			defs.DEV=true; defs.PROD=false; var devResult=Preprocessor(defs,data,file.isBrowser);
			defs.DEV=false; defs.PROD=true; var prodResult=Preprocessor(defs,data,file.isBrowser);
			
			if(data.match(/\/\*\s+\/?(NODE|BROWSER|RM|HIDE|REMOVE|NONE|NODE\|\|BROWSER|DEV\|\|PROD)\s+\*\//))
				return callback('error match NODE|BROWSER|RM|HIDE|REMOVE|NONE|NODE\|\|BROWSER|DEV\|\|PROD');
			
			callback(null,devResult,prodResult,includes);
		});
	},
	
	optimize:function(file,devResult,prodResult,onEnd){
		if(!file.isBrowser) return onEnd(null,devResult,prodResult);
		
		file.paths(function(err,paths){
			if(err) return onEnd(err);
			file.checkCancel(function(){
				UArray.forEachSeries([//Async is too much
							{path:paths.get('dev'),result:devResult,defs:{DEV:true,PROD:false,NODE:false,BROWSER:true}},
							{path:paths.get('prod'),result:prodResult,defs:{DEV:false,PROD:true,NODE:false,BROWSER:true}}],
							function(obj,onEnd){
					var path=obj.path, result=obj.result;
					console.log('optimize: '+path);
					var slicedPath=path.slice(0,-3),srcPath=slicedPath+'.src.js',oldIePath=slicedPath+'.oldIe.js';
					
					module.exports.callUglifyJs(file,module.exports.compileOldIE?'':result,obj.defs,true,function(err,ieResult){
						if(err) return onEnd(err);
						fs.writeFile(srcPath,ieResult,function(err){
							if(err) return onEnd(err);
							
							module.exports.callGoogleClosureCompiler(file,srcPath,oldIePath,true,false,function(err){
								if(err) return onEnd(err);
								
								/* now for modern browsers */
								module.exports.callUglifyJs(file,result,obj.defs,false,function(err,modernResult){
									if(err) return onEnd(err);
									fs.writeFile(srcPath,modernResult,function(err){
										if(err) return onEnd(err);
										
										module.exports.callGoogleClosureCompiler(file,srcPath,path,false,obj.defs.DEV ? slicedPath+'.map' : false,
											obj.defs.DEV ? function(err){
													if(err) return onEnd(err);
													fs.appendFile(path,"\n//@ sourceMappingURL=/"+file.compiledPath.slice(0,-3)+'.map?'+Date.now(),onEnd);
												} : onEnd);
									});
								});
							});
						});
					});
					
				},function(error){ if(error) console.error(error); onEnd(error || false); });
			});
		});
	},
	
	callUglifyJs:function(file,code,defs,oldIe,onEnd){
		file.checkCancel(function(){
			try{
				defs.OLD_IE=!!oldIe;
				var toplevel=UglifyJS.parse(code,{});
				toplevel.figure_out_scope();
				var compressor = UglifyJS.Compressor({ warnings:false, unsafe:!oldIe, comparisons:true, global_defs:defs, sequences:false });
				var compressed_ast = toplevel.transform(compressor);
				
				//var source_map = UglifyJS.SourceMap({});
				var stream = UglifyJS.OutputStream({ beautify:true, comments:'all' /*source_map:source_map*/ });
				compressed_ast.print(stream);
				file.checkCancel(function(){
					onEnd(null,stream.toString());
				});
			}catch(err){
				if(err.line){
					var ErrorWithContent=function(err){ this.err=err; };
					ErrorWithContent.prototype.toString = function(){
						var currentLine=this.err.line-3;
						return this.err.toString()
								+ "\n\n File Content :\n"
								+ code.split("\n").slice(currentLine,this.err.line+4).map(function(l){ return currentLine++ +': '+ l; }).join("\n");
					};
	
					err=new ErrorWithContent(err);
				}
				onEnd(err);
			}
		});
	},
	
	callGoogleClosureCompiler:function(file,srcPath,output,forOldIe,sourceMap,onEnd){
		file.checkCancel(function(){
			var dir=process.cwd();
			process.chdir(sysPath.dirname(srcPath));
			console.log('GoogleClosure: compiling '+srcPath+' to '+output);
			UExec.exec('java -jar '+ UExec.escape(COMPILER_JAR) +' --compilation_level SIMPLE_OPTIMIZATIONS --language_in=ECMASCRIPT5_STRICT'
							+' --js '+ UExec.escape(sysPath.basename(srcPath))+' --js_output_file '+ UExec.escape(sysPath.basename(output))
							+(sourceMap ? ' --create_source_map '+UExec.escape(sysPath.basename(sourceMap))+' --source_map_format=V3' : '')
							+( forOldIe ? ' --formatting=pretty_print':''),
				function (error, stdout, stderr){
					//console.error(error,"\n",stdout,"\n",stderr);
					if (error) onEnd(stderr);
					else{
						file.checkCancel(function(){
							//console.log(stdout);
							//console.log(' '+ output + ' built.');
							onEnd();
						});
					}
				});
			process.chdir(dir);
		});
	},
	
	_checkTrailingSlash:function(inclPath){
		if(inclPath.slice(-1)==='/'){
			var slicedInclPath=inclPath.slice(0,-1);
			inclPath+=slicedInclPath.contains('/') ? UString.substrLast(slicedInclPath,'/') : slicedInclPath;
		}
		return inclPath;
	},
	
	includesNode:function(data,file,callback,includes){
		data=data.replace(/^[\t ]*include(Core|JsCore|Plugin|Action|)\(\'([\w\s\._\-\/\&\+]+)\'\)\;$/mg,function(match,from,inclPath){
			inclPath=this._checkTrailingSlash(inclPath);
			
			if(from === 'JsCore') from = 'Core';
			
			if(from==='Core') inclPath=this.isCore ? inclPath='/'+inclPath : 'springbokjs/'+inclPath;
			else if(from==='Plugin'){
				inclPath='TODO';
			}else if(inclPath[0]!=='.'&&inclPath[0]!=='/') inclPath='./'+inclPath;
			
			if(inclPath[0]==='/') inclPath=('../'.repeat(UString.trimRight(file.dirname,'\/').split('/').length)||'./')+inclPath.substr(1);
			return 'require("'+inclPath+'");';
		}.bind(this));
		callback(data,{});
	},
	includesBrowser:function(data,file,callback,includes){
		if(!includes) includes = { app: {}, Core: {}, CoreUtils: {}, Plugin: {} };//TODO use Map<String,Set<String>>
		data = data.replace(/^[\t ]*include(Core|JsCore|CoreUtils|Plugin|Action|)\(\'([\w\s\._\-\/\&\+]+)\'\)(\;|,)$/mg,function(match,from,inclPath,lastChar){
			if(inclPath.slice(-1) === '/') inclPath += sysPath.basename(inclPath) + '.js';
			else if(inclPath.slice(-3) !== '.js') inclPath += '.js';
			
			if(from === 'JsCore') from = 'Core';
			
			var path;
			if(from === 'Core') path = CORE_SRC;
			else if(from === 'CoreUtils') path = CORE_MODULES + 'springboktools/';
			else if(from === 'Plugin') path = 'TODO';
			else if(from === 'Action') path = CORE_SRC + 'browser/actions/';
			else{
				path = file.rootPath + 'src/';
				inclPath = file.dirname + inclPath;
			}
			
			if(from === 'Action'){
				includes['Core'][ 'browser/actions/' + inclPath ] = 1;
			}else{
				if(!from) from = 'app';
				if(includes[from][inclPath]) return '';
				includes[from][inclPath] = 1;
			}
			
			path += inclPath;
			
			if(!fs.existsSync(path)) throw new Error("file doesn't exists: "+path+"\nline= "+match);
			
			var content = fs.readFileSync(path,'utf-8');
			if(lastChar === ',' && content.trim().slice(-1) !== ',') content += ',';
			return this.includesBrowser(content,file,false,includes);
		}.bind(this));
		callback && callback(data,includes);
		return data;
	}
};
