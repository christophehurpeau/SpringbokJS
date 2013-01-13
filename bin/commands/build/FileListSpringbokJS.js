var FileList=require('./FileList');

var FileListSpringbokJS=FileList.extend({
	isCore:true,
	
	filesToWatch:function(){
		return [this.rootPath+'src'];
	},
});

module.exports=FileListSpringbokJS;