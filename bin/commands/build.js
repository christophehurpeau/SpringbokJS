require('springboktools');
require('springboktools/es6/Map');
require('springboktools/UObj');
require('springboktools/UArray');
require('springboktools/UString/UString');
require('springboktools/UFiles');
require('springboktools/UExec');

var sysPath = require('path'), net = require('net');
var portscanner = require('portscanner');
var build = require('./build/');
var notify = require('notify-send');

global.CORE_SRC = sysPath.join(__dirname,'/../../src/');
global.CORE_MODULES = sysPath.join(__dirname,'/../../node_modules/');
global.CORE_INCLUDES = sysPath.join(__dirname,'/../../includes/');
console.log({src:CORE_SRC,mod:CORE_MODULES,incl:CORE_INCLUDES});

module.exports={
	core:function(rootPath,persistent){
		var fileList = new build.FileListCore(rootPath);
		var sw = build.SpringbokWatcher.init(fileList,persistent,false);
		
		if(persistent){
			var clients = [];
			var server=net.createServer(function(stream){
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
				notify.timeout(200).notify('Springbok Watcher', 'Core ready');
			},compiled=function(file){
				clients.length && console.log('sending file "'+file.path+'" compiled to '+clients.length+' clients');
				clients.forEach(function(stream){
					stream && stream.writable && stream.write('compiled: '+file.path);
				});
			},changedNotCompilableFile=function(path){
				clients.length && console.log('sending ignored file "'+path+'" changed to '+clients.length+' clients');
				clients.forEach(function(stream){
					stream && stream.writable && stream.write('changedNotCompilableFile: '+path);
				});
			},bindEvents=function(){
				fileList.on('ready',ready);
				fileList.on('compiled',compiled);
				fileList.on('changedNotCompilableFile',changedNotCompilableFile);
				fileList.on('reset',reset);
			},reset=function(){
				console.log('[!] filelist was reset !');
				setTimeout(function(){
					fileList.once('ready',function(){
						bindEvents();
						clients.forEach(function(stream){
							stream && stream.writable && stream.write('restart');
						});
					});
				},10);
			};
			bindEvents();
		}
	},
	app:function(rootPath,persistent){
		var fileList = new build.FileListApp(rootPath);
		var sw = build.SpringbokWatcher.init(fileList,persistent,true);
		
		var ready=function(){
			notify.timeout(200).notify('Springbok Watcher', 'App ready');
		},bindEvents=function(){
			fileList.on('ready',ready);
			fileList.on('reset',reset);
		},reset=function(){
			console.log('[!] filelist was reset !');
			setTimeout(function(){
				bindEvents();
			},10);
		};
		bindEvents();
		
		if(persistent){
			try{
				portscanner.checkPortStatus(7000,'127.0.0.1',function(error, status){
					if(status === 'open'){
						var client = net.connect(7000,function(){
							console.log('SpringbokWatcher Core connected');
							client.once('data',function(data){
								if(data.toString() !== 'FileList SpringbokJS') client.end();
								else{
									client.on('data',function(data){
										data = data.toString();
										if(data === 'reload') sw.reload();
										else if(data.startsWith('compiled: ')){
											var path=data.substr(10);
											fileList.compileDependentFiles(path,'Core');
											sw.restartServer(); // restart node app because some core files changed
										}else if(data.startsWith('changedNotCompilableFile: ')){
											var path=data.substr(26);
											if(path.startsWith('src/'))
												fileList.compileDependentFiles(path.substr(4),'Core');
											else if(path.startsWith('includes/'))
												fileList.compileDependentFiles(path.substr(9),'Includes');
										}else if(data === 'restart'){
											console.log('RESTART UNSUPPORTED YET: exiting....');
											sw.close(function(){
												setTimeout(function(){
													process.exit(1);
												},1000);
											});
											
										}
									});
								}
							});
							client.on('end',function(){
								console.log('SpringbokWatcher Core disconnected');
							});
							client.write('hello');
						});
					}
				});
			}catch(err){}
		}
	}
};