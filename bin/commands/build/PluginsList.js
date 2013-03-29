var diveSync=require('diveSync');

var plugins={all:[],compilers:[],linters:[],optimizers:[]},callbacks=[];

function isPluginFor(path){
	return function(plugin){
		return (plugin.pattern||(plugin.extension&&new RegExp("\\."+plugin.extension+"$"))||/$.^/).test(path);
	}
}

module.exports={
	init:function(fileList,pluginsDir){
		diveSync(pluginsDir || __dirname + '/plugins',function(err,path){
			if(err) console.error(err.stack);
			else if(/\.js$/.test(path)){
				var /*name=path.slice(dir.length + 19,-3), */
					plugin=require(path);
				plugin.fileList=fileList;
				plugin.isCore=fileList.isCore;
				if(plugin.init) plugin.init();
				if(S.isFunc(plugin.compile)) plugins.compilers.push(plugin);
				if(S.isFunc(plugin.lint)) plugins.linters.push(plugin);
				if(S.isFunc(plugin.optimize)) plugins.optimizers.push(plugin);
				if(S.isFunc(plugin.onCompile)) callbacks.push(function(){ plugin.onCompile.apply(plugin,arguments)});
				plugins.all.push(plugin);
			}
		});
		plugins.compilers=UArray.sortBy(plugins.compilers,'priority',true,'number');
		//callbacks.push(onCompile);
		var callCompileCallbacks=function(generatedFiles){
			callbacks.forEach(function(callback){ callback(generatedFiles); });
		}
	},
	
	find:function(path){
		var ispluginforpath=isPluginFor(path);
		return {
			compiler: plugins.compilers.filter(ispluginforpath)[0],
			linters: plugins.linters.filter(ispluginforpath),
			optimizers: plugins.optimizers.filter(ispluginforpath)
		};
	}
}