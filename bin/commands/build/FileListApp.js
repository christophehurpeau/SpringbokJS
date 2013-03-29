var FileList=require('./FileList'), sysPath=require('path'),fs=require("fs");

module.exports=FileList.extend({
	config:{},
	isCore:false,
	
	
	init:function(){
		if(fs.existsSync(this.rootPath+'src/config/_.json')){
			this.config=UFiles.readJsonSync(this.rootPath+'src/config/_.json');
			this.config.plugins=this.config.plugins||{};
			this.config.pluginsPaths=this.config.pluginsPaths||{};
			this.config.pluginsPaths.Springbok=CORE_SRC+'plugins/';
			this.config.plugins.SpringbokBase=['Springbok','base'];
		}
	},
	
	_ignored:function(path){
		if(path==='package.json') return true;
		if(path.substr(0,11)==='src/config/') return false;
		return sysPath.basename(path).startsWith('_');
	}
});