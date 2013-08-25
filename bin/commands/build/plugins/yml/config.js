var sysPath=require('path'),fs=require('fs'),async=require('async'),diveSync=require('diveSync'),YAML=require('js-yaml');
YAML.stringify=YAML.dump;
module.exports=function(file,data,callback){
	var configname=file.path.slice(7,-4);
	if(configname==='build'||configname==='tests'||configname==='_') return callback(null,null,null); //nothing
	else if(false&&file.fileList.isPlugin()){
		console.log("TODO");
	}else if(configname.charAt(0)==='_'){
		var t=this, config=(data);
		config = UObj.union(config,file.fileList.config);
		//var config_ = UFiles.readYamlSync(file.fullDirnamePath()+'_.yml');
		//config = UObj.union(config,config_);
		delete config.pluginsPaths.Springbok;
		if(!config.entries) return callback('config.entries must be set in your config file "'+configname+'" '+JSON.stringify(config));
		
		if(!config.availableLangs) return callback('config.availableLangs must be set in your config file "'+configname+'" '+JSON.stringify(config));
		if(!config.allLangs) config.allLangs = config.availableLangs;
		
		file.fileList.buildConfig.entries.forEach(function(entry){
			if(!config.entries[entry]) return callback('config.entry.'+entry+' must be set in your config file "'+configname+'" '+JSON.stringify(config));
		});
		
		config.reversedEntries= {};
		UObj.forEach(config.entries,function(k,v){ config.reversedEntries[v] = k; });
		
		var result=t.appConfig=YAML.stringify(config);
		return callback(null,result,result,{app:{'config/_.json':1}});
	}else{
		var result=(data)||{}, config=file.fileList.config,plugins=config.plugins, dependencies = { app:{}, Core:{} };
		
		UObj.forEachSeries(plugins,function(pluginName,p,onEnd){
			var dir=config.pluginsPaths[p[0]]+p[1], pluginPathConfig=dir+'/config/'+configname+'.yml';
			fs.exists(pluginPathConfig,function(exists){
				if(!exists) return onEnd();
				UFiles.readYamlAsync(pluginPathConfig,function(pluginData){
					result=UObj.union(result,pluginData);
					p[0]==='Springbok' && (dependencies.Core['plugins/'+pluginName+'/config/'+configname+'.yml']=1);
					onEnd();
				});
			});
		},function(){
			var onEnd=function(result,dependencies){
				result=YAML.stringify(result);
				//console.log(configname,result);
				callback(null,result,result,dependencies);
			};
			var defaultCoreConfigPath = CORE_SRC + 'defaultConfigs/'+configname+'.yml';
			
			fs.exists(defaultCoreConfigPath,function(exists){
				if(!exists) return onEnd(result,dependencies);
				UFiles.readYamlAsync(defaultCoreConfigPath,function(defaultCoreConfig){
					result=UObj.union(result,defaultCoreConfig);
					dependencies.Core['defaultConfigs/'+configname+'.yml']=1;
					onEnd(result,dependencies);
				});
			});
		});
	}
};