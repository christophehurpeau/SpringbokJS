var FileList=require('./FileList'), sysPath=require('path'),fs=require("fs"), PluginsList=require('./PluginsList');;

module.exports=FileList.extend({
	config:{},
	isCore:false,
	
	
	init:function(){
		if(fs.existsSync(this.rootPath+'src/config/_.yml')){
			this.config=UFiles.readYamlSync(this.rootPath+'src/config/_.yml');
			this.config.plugins=this.config.plugins||{};
			this.config.pluginsPaths=this.config.pluginsPaths||{};
			this.config.pluginsPaths.Springbok=CORE_SRC+'plugins/';
			this.config.plugins.SpringbokBase=['Springbok','base'];
			
			this.buildConfig=UFiles.readYamlSync(this.rootPath+'src/config/build.yml');
		}
		process.nextTick(function(){
			this._change(this.rootPath+'src/web/compat/es5.js',{ srcPath: CORE_SRC+'browser/compat/es5.js', compiledPath: 'web/compat.es5.js' });
			this._change(this.rootPath+'src/web/compat/es6.js',UObj.extend(PluginsList.find('a.js'),{
					srcPath: CORE_SRC+'browser/compat/es6.js', compiledPath: 'web/compat.es6.js' }));
		}.bind(this));
	},
	isConfig:function(path){
		return path===this.rootPath+'package.json' || path===this.rootPath+'src/config/build.yml';
	},
	
	_ignored:function(path){
		if(path==='package.json' || path.startsWith('src/tests/')) return true;
		if(path.substr(0,11)==='src/config/') return false;
		return sysPath.basename(path).startsWith('_');
	}
});