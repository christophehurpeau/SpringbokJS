var FileList=require('./FileList');

var FileListSpringbokJS=FileList.extend({
	filesToWatch:function(){
		return [this.rootPath+'src'];
	},
});

module.exports=FileListSpringbokJS;