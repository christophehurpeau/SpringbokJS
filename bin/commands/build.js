S=require('springboktools'),sysPath=require('path'),net=require('net');
var build=require('./build/'),rootPath=process.cwd()+'/';

global.CORE_SRC=sysPath.join(__dirname,'/../../src/');
global.CORE_INCLUDES=sysPath.join(__dirname,'/../../includes/');

module.exports={
	core:function(persistent){
		var fileList=new build.FileListSpringbokJS(rootPath);
		build.SpringbokWatcher.init(fileList,persistent,false);
		
		var clients=[],server=net.createServer(function(stream){
			console.log('[socket] client has joined');
			clients.push(stream);
			stream.setTimeout(0);
			
			stream.addListener("data",function(data){
				stream.write('FileList SpringbokJS');
			});
			
			stream.addListener("end",function(){
				console.log('[socket] client has left');
				clients=S.aRemove(clients,stream);
				stream.end();
			});
		});
		
		server.listen(7000);
		
		fileList.on('ready',function(){
			console.log('sending reload to '+clients.length+' clients');
			clients.forEach(function(stream){ stream.write('reload'); });
		});
	},
	project:function(persistent){
		var fileList=new build.FileList(rootPath);
		build.SpringbokWatcher.init(fileList,persistent,true);
		
		try{
			var client=net.connect(7000,function(){
				console.log('SpringbokWatcher Core connected');
				client.once('data',function(data){
					if(data.toString()!=='FileList SpringbokJS') client.end();
					client.on('data',function(data){
						if(data.toString()==='reload') fileList._checkReady(); // emit ready if waiting list is empty
					});
				})
				client.on('end',function(){
					console.log('SpringbokWatcher Core disconnected');
				})
				client.write('hello');
			});
		}catch(err){}
	}
}
