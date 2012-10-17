S=require('springboktools');
var build=require('./build/'),rootPath=process.cwd()+'/';

global.CORE_SRC=__dirname+'/../../src/';
global.CORE_INCLUDES=__dirname+'/../../includes/';

module.exports={
	core:function(persistent){
		var fileList=new build.FileListSpringbokJS(rootPath);
		build.SpringbokWatcher.init(fileList,persistent);
	},
	project:function(persistent){
		var fileList=new build.FileList(rootPath);
		build.SpringbokWatcher.init(fileList,persistent);
	}
}
