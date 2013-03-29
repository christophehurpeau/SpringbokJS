var fs=require('fs'), diveSync=require('diveSync'), async=require('async'),
		chokidar=require('chokidar'),PluginsList=require('./PluginsList');

function initWatcher(filesToWatch,persistent,callback){
	async.filter(filesToWatch,fs.exists,function(watchedFiles){
		var watcher=chokidar.watch(watchedFiles,{ ignored:/(^[.#]|(?:__|~)$)/, persistent:persistent })
		//	.on('add',function(path){console.log('watcher: File "'+path+'" received event "add"')})
		//	.on('change',function(path){console.log('watcher: File "'+path+'" received event "change"')})
		//	.on('unlink',function(path){console.log('watcher: File "'+path+'" received event "unlink"')})
			.on('error',console.error);
		callback(null,watcher);
	});
}



function initialize(fileList,persistent,startServer,pluginsDir,callback){
	PluginsList.init(fileList,pluginsDir);
	
	//start Server
	var server=persistent && startServer ? require('./Server') : null;
	/*
	 * var requestHandler = require('./myRequestHandler');

process.watchFile('./myRequestHandler', function () {
  module.unCacheModule('./myRequestHandler');
  requestHandler = require('./myRequestHandler');
}

var reqHandlerClosure = function (req, res) {
  requestHandler.handle(req, res);
}

http.createServer(reqHandlerClosure).listen(8000);

	var pluginIncludes=plugins.map(function(plugin){ return plugin.include; })
							.map(function(include){ return S.isFunc(include) ? include() : include; })
							.filter(function(paths){ return paths != null; })
							.reduce(function(acc,elem){ return acc.concat(elem); },[]);
	pluginIncludes.forEach(function(path){
		fileList.emit('change', path, PluginsList.find(path));
	});
	*/
	if(persistent && server) fileList.on('ready',function(){ server.restart(); });
	initWatcher(fileList.filesToWatch(),persistent,function(err,watcher){
		if(err) return callback(err);
		var compile=function(startTime){
			console.log("Compiled in "+(Date.now() - startTime)+"ms");
			if(persistent){
				fileList.emit('done');
			}else{
				watcher.close();
				process.on('exit',function(previousCode){
					process.exit(false&&logger.errorHappened?1:previousCode);
				})
			}
		},reload=function(){
			console.log("RELOAD");
		};
		callback(null,watcher, server, compile, reload);
	});
}

function bindWatcherEvents(fileList, watcher, reload, onChange){
	watcher
		.on('add',function(path){
			onChange();
			fileList.emit('change', path, PluginsList.find(path));
		})
		.on('change',function(path){
			//if(path is config.paths.config ) reload(false);
			//else if path is config.paths.packageConfig reload(true)
			onChange();
			fileList.emit('change', path, PluginsList.find(path));
		})
		.on('unlink',function(path){
			/*if path is config.paths.config or path is config.paths.packageConfig
        logger.info "Detected removal of config.coffee / package.json.
Exiting."
		process.exit(0)*/
			onChange();
			fileList.emit('unlink', path);
		})
}

module.exports={
	init:function(fileList,persistent,startServer,pluginsDir){
		var t=this;
		initialize(fileList,persistent,startServer,pluginsDir,function(err, watcher, server, compile, reload){
			if(err) return console.error(err);
			bindWatcherEvents(fileList, watcher, reload, function(){
				if(t._start==null) t._start=Date.now();
			});
			fileList.on('ready',function(){
				compile(t._endCompilation());
			});
		})
	},
	_endCompilation:function(){
		var start=this._start;
		this._start=null;
		return start;
	}
};