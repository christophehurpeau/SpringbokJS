var FileList = require('./FileList'),  PluginsList = require('./PluginsList');
var sysPath = require('path'), fs = require("fs");

module.exports = FileList.extend({
	config: {},
	isCore: false,
	
	
	init: function(){
		if(fs.existsSync(this.rootPath+'src/config/_.yml')){
			this.config=UFiles.readYamlSync(this.rootPath+'src/config/_.yml');
			this.config.plugins=this.config.plugins||{};
			this.config.pluginsPaths=this.config.pluginsPaths||{};
			this.config.pluginsPaths.Springbok=CORE_SRC+'plugins/';
			this.config.plugins.SpringbokBase=['Springbok','base'];
			
			this.buildConfig=UFiles.readYamlSync(this.rootPath+'src/config/build.yml');
		}
		process.nextTick(function(){
			'es5 es6 oldIe EventSource IndexedDBShim requestAnimationFrame store xhr2'.split(' ').forEach(function(fileName){
				this._change(this.rootPath+'src/web/compat/'+fileName+'.js',
					{ srcPath: CORE_SRC+'browser/compat/'+fileName+'.js', compiledPath: 'web/compat/'+fileName+'.js' });
			}.bind(this));
			
			/*'es6'.split(' ').forEach(function(fileName){
				this._change(this.rootPath+'src/web/compat/'+fileName+'.js',UObj.extend(PluginsList.find('a.js'),{
						srcPath: CORE_SRC+'browser/compat/'+fileName+'.js', compiledPath: 'web/compat/'+fileName+'.js' }));
			}.bind(this));*/
		}.bind(this));
	},
	isConfig: function(path){
		return path===this.rootPath+'package.json' || path===this.rootPath+'src/config/build.yml';
	},
	
	_ignored: function(path,basename){
		if(path==='package.json' || path.startsWith('src/tests/') || path.contains('/.git/')) return true;
		if(path.substr(0,11)==='src/config/') return false;
		return basename.startsWith('.');
	},
	_notcompilable: function(path,basename){
		if(path.substr(0,11)==='src/config/') return false;
		return basename.startsWith('_');
	}
});