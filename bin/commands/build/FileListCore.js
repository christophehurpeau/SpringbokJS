var FileList=require('./FileList');

var FileListCore=FileList.extend({
	isCore:true,
	
	filesToWatch:function(){
		return [this.rootPath+'src'];
	},
});

module.exports=FileListCore;