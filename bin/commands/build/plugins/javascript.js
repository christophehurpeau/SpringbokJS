//var jshint=require('jshint').JSHINT;
var _exec=require('child_process').exec;
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
		if(file.isWebApp) console.log('COMPILING WEBAPP : '+file.path);
		this[file.isBrowser ? 'includesBrowser' : 'includesNode' ](data,file.dirname,function(data,includes){
			if(file.isBrowser)
				data=data.replace(/\/\*\s+NODE\s+\*\/.*\/\*\s+\/NODE\s+\*\//g,'')
					.replace('/* BROWSER */','').replace('/* /BROWSER */','')
					.replace(/\(\(\/\* NODE\|\|BROWSER \*\/(.+)||(.+)\)\)/g,'$2');
			else
				data=data.replace(/\/\*\s+BROWSER\s+\*\/.*\/\*\s+\/BROWSER\s+\*\//g,'')
					.replace('/* NODE */','').replace('/* /NODE */','')
					.replace(/\(\(\/\*\s+NODE\|\|BROWSER\s+\*\/(.+)\|\|(.+)\)\)/g,'$1');
			
			data.replace(/\/\*\s+(RM|HIDE|REMOVE|NONE)\s+\*\/.*\/\*\s+\/(RM|HIDE|REMOVE|NONE)\s+\*\//g,'');
			
			var devResult=data,prodResult=data;
			devResult=devResult.replace(/\/\*\s+PROD\s+\*\/.*\/\*\s+\/PROD\s+\*\//g,'').replace('/* DEV */','').replace('/* /DEV */','')
					.replace(/\(\(\/\* DEV\|\|PROD \*\/(.+)||(.+)\)\)/g,'$1')
					.replace(/\(\/\*\s+DEV\|\|PROD\s+\*\/([^\)\|]+)\|\|([^)]+)\)/g,'$1');
			prodResult=prodResult.replace(/\/\*\s+DEV\s+\*\/.*\/\*\s+\/DEV\s+\*\//g,'').replace('/* PROD */','').replace('/* PROD */','')
					.replace(/\(\(\/\* DEV\|\|PROD \*\/(.+)||(.+)\)\)/g,'$2')
					.replace(/\(\/\*\s+DEV\|\|PROD\s+\*\/([^\)\|]+)\|\|([^)]+)\)/g,'$2');
			
			if(file.isBrowser){
				_exec('java -jar '+ COMPILER_JAR +' --js '+ srcPath +' --js_output_file '+ distPath,
					function (error, stdout, stderr){
						if (error) callback(stderr);
						else{
							console.log(stdout);
							console.log(' '+ distPath + ' built.');
						}
					})
			}else callback(null,devResult,prodResult,includes['']);
		});
	},
	
	
	includesNode:function(data,dirname,callback,includes){
		var t=this,dataNode;
		data=data.replace(/^include(Core|Plugin|)\(\'([\w\s\._\-\/\&\+]+)\'\)\;$/mg,function(match,from,inclPath){
			if(inclPath.slice(-1)==='/'){
				var slicedInclPath=inclPath.slice(0,-1);
				inclPath+=slicedInclPath.contains('/') ? UString.substrLast(slicedInclPath,'/') : slicedInclPath;
			}
			if(from==='Core') inclPath=t.isCore ? inclPath='/'+inclPath : 'springbokjs/'+inclPath;
			else if(from==='Plugin'){
				inclPath='TODO';
			}else if(incluPath[0]!=='.') inclPath='./'+inclPath;
			
			if(inclPath[0]==='/') inclPath=('../'.repeat(dirname.split('/').length)||'./')+inclPath.substr(1);
			return 'require("'+inclPath+'");';
		});
		callback(data,{});
	},
	includesBrowser:function(data,dirname,callback,includes){
		var t=this,dataNode;
		if(!includes) includes={'':{},Core:{},'Plugin':{}};
		dataBrowser=dataBrowser.replace(/^@include(Core|Plugin|)\(\'([\w\s\._\-\/\&\+]+)\'\)\;$/mg,function(match,from,inclPath){
			if(inclPath.slice(-1)==='/') inclPath+=UString.substrLast(inclPath.slice(0,-1),'/');
			if(includes[from][inclPath]) return '';
			includes[from][inclPath]=1;
			var path;
			if(from==='Core') path=CORE_INCLUDES+'styl/';
			else if(from==='Plugin') path='TODO';
			else path=dirname;
			
			path+=inclPath;
			if(inclPath.slice(-1)!=='/') path+='index.js';
			else if(inclPath.slice(-3)!=='.js') path+='.js';
			return t.includes(fs.readFileSync(path,'utf-8'),dirname,false,includes);
		});
		callback&&callback(data,includes);
		return dataBrowser;
	}
}
