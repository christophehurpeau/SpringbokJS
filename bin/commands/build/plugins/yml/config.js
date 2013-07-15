var sysPath=require('path'),fs=require('fs'),async=require('async'),diveSync=require('diveSync'),YAML=require('js-yaml');
YAML.stringify=YAML.dump;
module.exports=function(file,data,callback){
	var configname=file.path.slice(7,-4);
	if(configname==='build'||configname==='tests'||configname==='_') return callback(null,null,null); //nothing
	else if(false&&file.fileList.isPlugin()){
		console.log("TODO");
	}else if(configname.charAt(0)==='_'){
		var t=this,config=(data);
		var config_=UFiles.readYamlSync(file.fullDirnamePath()+'_.yml');
		config=UObj.union(config,config_);
		if(!config.entries) return callback('config.entries must be set in your config file "'+configname+'"');
		
		if(!config.availableLangs) return callback('config.availableLangs must be set in your config file "'+configname+'"');
		config.allLangs=config.allLangs||config.availableLangs;
		
		file.fileList.buildConfig.entries.forEach(function(entry){
			if(!config.entries[entry]) return callback('config.entry.'+entry+' must be set in your config file "'+configname+'"');
		});
		
		config.reversedEntries={};
		UObj.forEach(config.entries,function(k,v){ config.reversedEntries[v]=k; });
		
		var result=t.appConfig=YAML.stringify(config);
		return callback(null,result,result,['config/_.json']);
	}else{
		var result=(data),config=file.fileList.config,plugins=config.plugins;
		
		UObj.forEachSeries(plugins,function(pluginName,p,onEnd){
			var dir=config.pluginsPaths[p[0]]+p[1], pluginPathConfig=dir+'/config/'+configname+'.yml';
			console.log(pluginPathConfig);
			if(fs.existsSync(pluginPathConfig))
				result=UObj.union(result,UFiles.readYamlSync(pluginPathConfig));
			onEnd();
		},function(){
			result=YAML.stringify(result);
			//console.log(configname,result);
			callback(null,result,result);
		});
	}
}
