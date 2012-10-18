var fs=require('fs'),sysPath=require('path'),
	stylus=require('stylus'),StylusSprite=require("stylus-sprite");

module.exports={
	type:'stylesheet',
	extension:'styl',
	compiledExtension:'css',
	_dependencyRegExp: /^ *@import ['"](.*)['"]/,
	
	compile:function(file,data,callback){
		var t=this;
		//defines
		
		//includes
		this.includes(data,file.dirname,function(data,includes){
			
			var sprite = new StylusSprite({
				image_root:file.dirname,
				output_file:file.basename+".png",
				pngcrush:"pngcrush"
			}),

			compiler=stylus(data)
				.set('compress',false)
				.set('firebug',false)
				//.include(file.fileList.rootPath)
				//.include(file.dirname)
				//.use(nib())s
				.define('sprite',function(filename,optionVal){
					return sprite.spritefunc(filename,optionVal);
			});
		
			//render
			
			
			compiler.render(function(err,result){
				if(err) return callback(err);
				//var parent=file.dirname,regexp=t._dependencyRegExp;
				/*var dependencies=data.split("\n")
					.map(function(line){return line.match(regexp)})
					.filter(function(match){return match&&match.length>0})
					.map(function(match){return match[1]})
					.filter(function(path){return !!path&&path!=='nib'})
					.map(function(path){
						if(sysPath.extname(path)!=='.'+t.extension) path+='.'+t.extension;
						if(path.charAt(0)==='/') return sysPath.join(t.fileList.rootPath,path.substr(1));
						return sysPath.join(parent,path);
					});*/
				
				sprite.build(result,function(err,result){
					callback(null,result,result,includes['']);
				});
			});
		});
	},
	
	includes:function(data,dirname,callback,includes){
		var t=this;
		if(!includes) includes={'':{},Core:{},'Plugin':{}};
		data=data.replace(/^@include(Core|Plugin|) \'([\w\s\._\-\/]+)\'\;$/mg,function(match,from,inclPath){
			if(includes[from][inclPath]) return '';
			includes[from][inclPath]=1;
			var path;
			if(from==='Core') path=CORE_INCLUDES+'styl/';
			else if(from==='Plugin') path='TODO';
			else path=dirname;
			
			path+=inclPath;
			if(inclPath.slice(-5)!=='.styl'&&inclPath.slice(-4)!=='.css') path+='.styl';
			return t.includes(fs.readFileSync(path,'utf-8'),dirname,false,includes);
		});
		callback&&callback(data,includes);
		return data;
	}
};
