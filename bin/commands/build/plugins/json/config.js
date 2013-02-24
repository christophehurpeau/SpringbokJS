var sysPath=require('path'),fs=require('fs'),async=require('async'),diveSync=require('diveSync');
module.exports=function(file,data,callback){
	var configname=file.path.slice(7,-5);
	if(configname==='build'||configname==='tests'||configname==='_') callback(null,null,null); //nothing
	else if(false&&file.fileList.isPlugin()){
		console.log("TODO");
	}else if(configname.charAt(0)==='_'){
		var t=this,config=JSON.parse(data);
		var data=fs.readFileSync(file.rootPath+'src/'+file.dirname+'/_.json','UTF-8');
		//if(err) return callback(err);
		var config_=JSON.parse(data);
		config=UObj.union(config,config_);
		if(!config.entries) return callback('config.entries must be set in your config file "'+configname+'"');
		config.reversedEntries={};
		UObj.forEach(config.entries,function(k,v){ config.reversedEntries[v]=k });
		
		var result=t.appConfig=JSON.stringify(config);
		callback(null,result,result,['config/_.json']);
	}else{
		var result=JSON.parse(data),config=this.fileList.config,plugins=config.plugins;
		
		async.forEachSeries(Object.keys(plugins),function(pluginName,onEnd){
			var p=plugins[pluginName],dir=config.pluginsPaths[p[0]]+p[1],
				pluginPathConfig=dir+'/config/'+configname+'.json';
			console.log(pluginPathConfig);
			if(fs.existsSync(pluginPathConfig))
				result=UObj.union(result,JSON.parse(fs.readFileSync(pluginPathConfig)));
			onEnd();
		},function(){
			result=JSON.stringify(result);
			console.log(configname,result);
			callback(null,result,result);
		});
	}
}
