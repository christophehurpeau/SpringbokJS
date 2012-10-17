var sysPath=require('path'),fs=require('fs');
module.exports=function(file,data,callback){
	var configname=file.path.slice(7,-5);
	if(configname==='enhance'||configname==='tests'||configname==='_') ; //nothing
	else if(false&&file.fileList.isPlugin()){
		console.log("TODO");
	}if(configname.charAt(0)==='_'){
		var config=JSON.parse(data);
		fs.readFile(file.rootPath+'src/'+file.dirname+'/_.json',function(err,buffer){
			if(err) return callback(err);
			var config_=JSON.parse(buffer.toString());
			var result=JSON.stringify(S.oUnion(config,config_));
			callback(null,result,result,['config/_.json']);
		});
	}else{
		callback(null,data,data);
	}
}
