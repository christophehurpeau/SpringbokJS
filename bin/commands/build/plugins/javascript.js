//var jshint=require('jshint').JSHINT;
var fs=require('fs'),Preprocessor=require('../Preprocessor');

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
					+'App.run();';
			}else if(!/^[a-zA-Z_\-]\/(controllers|models|views|viewsLayouts|web)\//.test(file.path))
				return callback(false);
	
		}
		
		
		this[file.isBrowser ? 'includesBrowser' : 'includesNode' ](data,file.dirname,function(data,includes){
			if(file.isBrowser)
				data=data.replace(/\/\*\s+NODE\s+\*\/.*\/\*\s+\/NODE\s+\*\//g,'')
					.replace('/* BROWSER */','').replace('/* /BROWSER */','')
					.replace(/\(\(\/\* NODE\|\|BROWSER \*\/(.+)||(.+)\)\)/g,'$2');
			else
				data=data.replace(/\/\*\s+BROWSER\s+\*\/.*\/\*\s+\/BROWSER\s+\*\//g,'')
					.replace('/* NODE */','').replace('/* /NODE */','')
					.replace(/\(\(\/\*\s+NODE\|\|BROWSER\s+\*\/(.+)\|\|(.+)\)\)/g,'$1');
			
			
			
			data=Preprocessor(file.fileList.buildConfig && file.fileList.buildConfig.config,data);
			
			data=data.replace(/\/\*\s+(RM|HIDE|REMOVE|NONE)\s+\*\/.*\/\*\s+\/(RM|HIDE|REMOVE|NONE)\s+\*\//g,'');
			data=data.replace('__SPRINGBOK_COMPILED_TIME__',Date.now());
			
			if(file.dirname.endsWith('/controllers')){
				if(!file.isBrowser){
					if(data.startsWith('module.exports')) throw Error('module.exports is automaticly added by Springbok.');
					data=data.replace(/App\.[A-Za-z]*Controller\(\{/g,'module.exports=$&');
				}
			}
			
			var devResult=data,prodResult=data;
			devResult=devResult.replace(/\/\*\s+PROD\s+\*\/.*\/\*\s+\/PROD\s+\*\//g,'').replace('/* DEV */','').replace('/* /DEV */','')
					.replace(/\(\(\/\* DEV\|\|PROD \*\/(.+)||(.+)\)\)/g,'$1')
					.replace(/\(\/\*\s+DEV\|\|PROD\s+\*\/([^\)\|]+)\|\|([^)]+)\)/g,'$1');
			prodResult=prodResult.replace(/\/\*\s+DEV\s+\*\/.*\/\*\s+\/DEV\s+\*\//g,'').replace('/* PROD */','').replace('/* PROD */','')
					.replace(/\(\(\/\* DEV\|\|PROD \*\/(.+)||(.+)\)\)/g,'$2')
					.replace(/\(\/\*\s+DEV\|\|PROD\s+\*\/([^\)\|]+)\|\|([^)]+)\)/g,'$2');
			
			callback(null,devResult,prodResult,includes['']);
		});
	},
	
	optimize:function(file,devResult,prodResult,onEnd){
		if(!file.isBrowser) return onEnd(null,devResult,prodResult);
		file.compiledPath=file.compiledPath.slice(0,-3)+'.src.js';
		file.write(devResult,prodResult,function(err,paths){
			if(err) return onEnd(err);
			UArray.forEachAsync(paths,function(path,onEnd){
				console.log('GoogleClosure: compiling '+path);
				UExec.exec('java -jar '+ UExec.escape(COMPILER_JAR) +' --js '+ UExec.escape(path)
									+' --js_output_file '+ UExec.escape(path.slice(0,-(3+4))+'.js'),
					function (error, stdout, stderr){
						console.error(error,"\n",stdout,"\n",stderr);
						if (error) onEnd(stderr);
						else{
							console.log(stdout);
							console.log(' '+ path + ' built.');
							onEnd();
						}
					});
			},function(){ onEnd(null,false,false); });
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
			
			if(inclPath[0]==='/') inclPath=('../'.repeat(dirname.split('/').length)||'./')+inclPath.substr(1);
			return 'require("'+inclPath+'");';
		}.bind(this));
		callback(data,{});
	},
	includesBrowser:function(data,dirname,callback,includes){
		if(!includes) includes={'':{},Core:{},'Plugin':{}};
		data=data.replace(/^include(Core|Plugin|)\(\'([\w\s\._\-\/\&\+]+)\'\)\;$/mg,function(match,from,inclPath){
			if(inclPath.slice(-1)==='/') inclPath+=UString.substrLast(inclPath.slice(0,-1),'/');
			if(includes[from][inclPath]) return '';
			includes[from][inclPath]=1;
			var path;
			if(from==='Core') path=CORE_SRC;
			else if(from==='Plugin') path='TODO';
			else path=dirname;
			
			path+=inclPath;
			if(inclPath.slice(-1)==='/') path+='.js';
			else if(inclPath.slice(-3)!=='.js') path+='.js';
			return this.includesBrowser(fs.readFileSync(path,'utf-8'),dirname,false,includes);
		}.bind(this));
		callback&&callback(data,includes);
		return data;
	}
}
