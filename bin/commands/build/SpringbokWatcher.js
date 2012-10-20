var fs=require('fs'), diveSync=require('diveSync'), async=require('async'),
		chokidar=require('chokidar');

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

function isPluginFor(path){
	return function(plugin){
		return (plugin.pattern||(plugin.extension&&new RegExp("\\."+plugin.extension+"$"))||/$.^/).test(path);
	}
}

function changeFileList(plugins, fileList, path){
	var ispluginforpath=isPluginFor(path),
		compiler = plugins.compilers.filter(ispluginforpath)[0],
		currentLinters = plugins.linters.filter(ispluginforpath),
		currentOptimizers=plugins.optimizers.filter(ispluginforpath);
	fileList.emit('change', path, compiler, currentLinters, currentOptimizers);
}

function initialize(fileList,persistent,pluginsDir,callback){
	var plugins={all:[],compilers:[],linters:[],optimizers:[]},callbacks=[];
	diveSync(pluginsDir || __dirname + '/plugins',function(err,path){
		if(err) console.error(err.stack);
		else if(/\.js$/.test(path)){
			var /*name=path.slice(dir.length + 19,-3), */
				plugin=require(path);
			plugin.fileList=fileList;
			if(plugin.init) plugin.init();
			if(S.isFunc(plugin.compile)) plugins.compilers.push(plugin);
			if(S.isFunc(plugin.lint)) plugins.linters.push(plugin);
			if(S.isFunc(plugin.optimize)) plugins.optimizers.push(plugin);
			if(S.isFunc(plugin.onCompile)) callbacks.push(function(){ plugin.onCompile.apply(plugin,arguments)});
			plugins.all.push(plugin);
		}
	});
	//callbacks.push(onCompile);
	var callCompileCallbacks=function(generatedFiles){
		callbacks.forEach(function(callback){ callback(generatedFiles); });
	}
	//start Server
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
		changeFileList(plugins, fileList, path, true);
	});
	*/
	initWatcher(fileList.filesToWatch(),persistent,function(err,watcher){
		if(err) return callback(err);
		var compile=function(startTime){
			console.log("Compiled in "+(Date.now() - startTime)+"ms");
			if(!persistent){
				watcher.close();
				process.on('exit',function(previousCode){
					process.exit(false&&logger.errorHappened?1:previousCode);
				})
			}
		},reload=function(){
			console.log("RELOAD");
		},server;
		callback(null,watcher, server, plugins, compile, reload);
	});
}

function bindWatcherEvents(fileList, plugins, watcher, reload, onChange){
	watcher
		.on('add',function(path){
			onChange();
			changeFileList(plugins, fileList, path, false);
		})
		.on('change',function(path){
			//if(path is config.paths.config ) reload(false);
			//else if path is config.paths.packageConfig reload(true)
			onChange();
			changeFileList(plugins, fileList, path, false);
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
	init:function(fileList,persistent,pluginsDir){
		var t=this;
		initialize(fileList,persistent,pluginsDir,function(err, watcher, server, plugins, compile, reload){
			if(err) return console.error(err);
			bindWatcherEvents(fileList, plugins, watcher, reload, function(){
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