var FileList=require('./FileList');

var FileListCore=FileList.extend({
	isCore:true,
	
	filesToWatch:function(){
		return [this.rootPath+'src',this.rootPath+'bin'];
	},
	isConfig:function(path){
		return path.startsWith(this.rootPath+'bin/');
	},
	_ignored:function(path){
		return path.startsWith('bin/') || path.startsWith('src/browser/');
	}
});

module.exports=FileListCore;