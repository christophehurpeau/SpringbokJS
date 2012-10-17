var stylus=require('stylus'),fs=require('fs'),sysPath=require('path');

module.exports={
	type:'stylesheet',
	extension:'styl',
	compiledExtension:'css',
	_dependencyRegExp: /^ *@import ['"](.*)['"]/,
	
	compile:function(file,data,callback){
		//defines
		
		//includes
		data=this.includes(data,file.dirname);
		
		var t=this,compiler=stylus(data)
			.set('compress',false)
			.set('firebug',false)
			.include(file.fileList.rootPath)
			.include(file.dirname)
			//.use(nib())s
			;
		
		//render
		compiler.render(function(err,result){
			if(err) return callback(err);
			var parent=file.dirname,regexp=t._dependencyRegExp;
			var dependencies=data.split("\n")
				.map(function(line){return line.match(regexp)})
				.filter(function(match){return match&&match.length>0})
				.map(function(match){return match[1]})
				.filter(function(path){return !!path&&path!=='nib'})
				.map(function(path){
					if(sysPath.extname(path)!=='.'+t.extension) path+='.'+t.extension;
					if(path.charAt(0)==='/') return sysPath.join(t.fileList.rootPath,path.substr(1));
					return sysPath.join(parent,path);
				});
			callback(null,result,result,dependencies);
		});
	},
	
	includes:function(data,dirname,includes){
		var t=this;
		if(!includes) includes={'':{},Core:{},'Plugin':{}};
		data.replace(/^@include(Core|Plugin|) \'([\w\s\._\-\/]+)\'\;$/mg,function(match,from,inclPath){
			if(includes[from][inclPath]) return '';
			includes[from][inclPath]=1;
			var path;
			if(from==='Core') path=CORE_INCLUDES+'styl/';
			else if(from==='Plugin') path='TODO';
			else path=dirname;
			
			path+=inclPath;
			if(inclPath.slice(-5)!=='.styl'&&inclPath.slice(-4)!=='.css') path+='.styl';
			console.log(path);
			return t.includes(fs.readSync(path,'utf-8'),dirname,includes);
		});
	}
};
