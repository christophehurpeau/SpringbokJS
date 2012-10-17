var FileList=require('./FileList');
module.exports={
	SpringbokWatcher:require('./SpringbokWatcher'),
	FileList:function(rootPath){ return new FileList(rootPath) },
	FileListSpringbokJS:function(rootPath){ var FileList=require('./FileListSpringbokJS'); return new FileList(rootPath) },
};
