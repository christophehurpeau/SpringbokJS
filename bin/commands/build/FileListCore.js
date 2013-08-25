var FileList = require('./FileList');

var FileListCore = FileList.extend({
	isCore: true,
	
	filesToWatch: function(){
		return [ this.rootPath+'src', this.rootPath+'bin', this.rootPath+'includes' ];
	},
	isConfig: function(path){
		return path.startsWith(this.rootPath+'bin/');
	},
	_ignored: function(path,basename){
		return path.startsWith('bin/') || path.startsWith('src/tests/') || path.contains('/.git/') || basename.startsWith('.');
	},
	_notcompilable: function(path,basename){
		return path.startsWith('src/browser/') || path.startsWith('includes/') || path.startsWith('src/defaultConfigs/');
	},
	
	compileDependentFiles: function(path,type){
		FileList.prototype.compileDependentFiles.call(this,path,'app');
		FileList.prototype.compileDependentFiles.call(this,path,'Core');
	}
});

module.exports = FileListCore;