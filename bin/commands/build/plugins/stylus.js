var fs=require('fs'),sysPath=require('path'), mkdirp=require('mkdirp'),
	stylus=require('stylus'),stylusF=stylus.functions,
	StylusSprites=require('springbokjs-stylus-sprites');

function findBestFgColor(backgroundColor,blackColor,whiteColor){
	return stylusF.hsl(backgroundColor).l > 60 ? (blackColor||stylus.nodes.RGBA(51,51,51,1/*'#333'*/))
							: (whiteColor||stylus.nodes.RGBA(25,250,250,1/*'#fafafa'*/));
	//return stylus.functions.lightness(backgroundColor) > stylus.functions.lightness('#999999'),$blackColor,$whiteColor);
}


module.exports={
	type:'stylesheet',
	extension:'styl',
	compiledExtension:'css',
	priority:0,
	
	compile:function(file,data,callback){
		var t=this;
		//defines
		
		//includes
		this.includes("@includeCore 'index';\n"+data,file,function(data,includes){
			var outputPath=[];
			file.forEachOutputs(function(output,type,onEnd){
				var path = file.rootPath + output + '/' +file.compiledPathDirname +'/';
				outputPath.push(path);
				mkdirp(path,onEnd);
			},function(err){
				if(err) return callback(err);
					
				/*
				var sprite = new StylusSprite({
					image_root:file.dirname,
					output_file:file.basename+".png",
					pngcrush:"pngcrush"
				}),
	*/
				var sprites=new StylusSprites({
					prefix:file.basename==='main'?'':file.basename,
					path:file.fullDirnamePath(),
					outputPath:outputPath
				}),spritesfn=sprites.stylus();
				
				var compiler=stylus(data)
					.set('filename',file.path)
					.set('compress',false)
					.set('firebug',false)
					//.include(file.fileList.rootPath)
					//.include(file.dirname)
					//.use(nib())s
					.define('sprite',function(name,image,options){
						if(image.string.substr(0,8)==='COREIMG/') image.string=CORE_INCLUDES+'img/'+image.string.substr(8);
						return spritesfn.call(this,name,image,options);
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
					
					sprites.build(result,function(err,result){
						if(err) return callback(err);
						callback(null,result,includes);
					});
				});
			});
		});
	},
	
	includes:function(data,file,callback,includes){
		var t=this;
		if(!includes) includes={ app: {}, Includes: {}, 'Plugin': {} };
		data=data.replace(/^@include(Core|Plugin|) \'([\w\s\._\-\/]+)\'\;?$/mg,function(match,from,inclPath){
			
			var path;
			if(from === 'Core'){
				from = 'Includes';
				path = CORE_INCLUDES;
				inclPath = 'styl/' + inclPath;
			}else if(from === 'Plugin'){
				path='TODO';
			}else{
				from = 'app';
				inclPath = file.dirname + inclPath;
				path = file.rootPath + 'src/';
			}
			
			if(inclPath.slice(-5) !== '.styl' && inclPath.slice(-4)!=='.css') inclPath += '.styl';
			
			if(includes[from][inclPath]) return '';
			includes[from][inclPath] = 1;
			
			path += inclPath;
			return t.includes(fs.readFileSync(path,'utf-8'),file,false,includes);
		});
		callback && callback(data,includes);
		return data;
	}
};
