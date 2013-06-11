require('springboktools');
require('springboktools/es6/Map');
require('springboktools/UObj');
require('springboktools/UArray');
require('springboktools/UString/UString');
require('springboktools/UFiles');
require('springboktools/UExec');

var sysPath=require('path'),net=require('net');
var build=require('./build/');

global.CORE_SRC=sysPath.join(__dirname,'/../../src/');
global.CORE_MODULES=sysPath.join(__dirname,'/../../node_modules/');
global.CORE_INCLUDES=sysPath.join(__dirname,'/../../includes/');
console.log({src:CORE_SRC,mod:CORE_MODULES,incl:CORE_INCLUDES});

module.exports={
	core:function(rootPath,persistent){
		var fileList=new build.FileListCore(rootPath);
		var sw=build.SpringbokWatcher.init(fileList,persistent,false);
		
		var clients=[],server=net.createServer(function(stream){
			console.log('[socket] client has joined');
			clients.push(stream);
			stream.setTimeout(0);
			
			stream.addListener("data",function(data){
				stream.write('FileList SpringbokJS');
			});
			
			stream.addListener("end",function(){
				console.log('[socket] client has left');
				clients=UArray.remove(clients,stream);
				stream.end();
			});
		});
		
		server.listen(7000);
		
		var ready=function(){
			console.log('[!] sending reload to '+clients.length+' clients');
			clients.forEach(function(stream){
				stream && stream.writable && stream.write('reload');
			});
		},reset=function(){
			console.log('[!] filelist was reset !');
			setTimeout(function(){
				fileList.on('ready',ready);
				fileList.on('reset',reset);
				clients.forEach(function(stream){
					stream && stream.writable && stream.write('restart');
				});
			},10);
		};
		fileList.on('ready',ready);
		fileList.on('reset',reset);
	},
	app:function(rootPath,persistent){
		var fileList=new build.FileListApp(rootPath);
		var sw=build.SpringbokWatcher.init(fileList,persistent,true);
		
		try{
			var client=net.connect(7000,function(){
				console.log('SpringbokWatcher Core connected');
				client.once('data',function(data){
					if(data.toString()!=='FileList SpringbokJS') client.end();
					client.on('data',function(data){
						data=data.toString();
						if(data==='reload') sw.reload();
						else if(data==='restart'){
							console.log('RELOAD UNSUPPORTED YET: exiting....');
							sw.close(function(){
								process.exit(1);
							});
							
						}
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