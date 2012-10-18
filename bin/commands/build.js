S=require('springboktools'),sysPath=require('path');
var build=require('./build/'),rootPath=process.cwd()+'/';

global.CORE_SRC=sysPath.join(__dirname,'/../../src/');
global.CORE_INCLUDES=sysPath.join(__dirname,'/../../includes/');

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
