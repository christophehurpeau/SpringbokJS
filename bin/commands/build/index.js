var FileList=require('./FileList');
module.exports={
	SpringbokWatcher:require('./SpringbokWatcher'),
	//FileList:function(rootPath){ return new FileList(rootPath) },
	FileListCore:function(rootPath){ var FileList=require('./FileListCore'); return new FileList(rootPath) },
	FileListApp:function(rootPath){ var FileList=require('./FileListApp'); return new FileList(rootPath) },
};
