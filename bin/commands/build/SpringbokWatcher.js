var fs=require('fs'), diveSync=require('diveSync'), async=require('async'),
		chokidar=require('chokidar'),PluginsList=require('./PluginsList');


var SpringbokWatcher=function(fileList,persistent,startServer,pluginsDir){
	this.fileList=fileList; this.persistent=persistent;
	this.startServer=startServer;
	this.pluginsDir=pluginsDir;
	
	
};
SpringbokWatcher.prototype={
	init:function(){
		//initizalize todo : initialize(fileList,persistent,startServer,pluginsDir,function(err, watcher, server, compile, reload)
		//if(err) return console.error(err);
		
		PluginsList.init(this.fileList,this.pluginsDir);
		
		//start Server
		this.server=this.persistent && this.startServer ? require('./Server') : null;
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
		pluginIncludes.forEach(function(path){ fileList.emit('change', path, PluginsList.find(path)); });
		*/
		this.initWatcher();
	},
	initWatcher:function(){
		if(this.persistent && this.server) this.fileList.on('ready',
					function(){ this.fileList.hasErrors() ? (this.server && this.server.close && this.server.close())
											 : this.server.restart(); }.bind(this));
		async.filter(this.fileList.filesToWatch(),fs.exists,function(watchedFiles){
			this.watcher=chokidar.watch(watchedFiles,{ ignored:/(^[.#]|(?:__|~)$)/, persistent:this.persistent })
			//	.on('add',function(path){console.log('watcher: File "'+path+'" received event "add"')})
			//	.on('change',function(path){console.log('watcher: File "'+path+'" received event "change"')})
			//	.on('unlink',function(path){console.log('watcher: File "'+path+'" received event "unlink"')})
				.on('error',console.error);
			
			this.bindWatcherEvents();
			this.fileList.on('ready',function(){ this.compiled(this._endCompilation()); }.bind(this));
		}.bind(this));
	},
	
	compiled:function(startTime){
		var log="Compiled in "+(Date.now() - startTime)+"ms";
		if(this.fileList.hasErrors()){
			log+=' with '+this.fileList.errorsCount+' errors [!]';
			log+="\nErrors on files: "+Object.keys(this.fileList.errors).join(', ')+"\n";
			UObj.forEach(this.fileList.errors,function(path,error){
				log+="\n"+path+": "+S.isObj(error) ? error.stack : error;
			})
		}
		console.log(log);
		if(this.persistent){
			this.fileList.emit('done');
		}else{
			this.watcher.close();
			process.on('exit',function(previousCode){
				process.exit(false&&/*logger.errorHappened?1:*/previousCode);
			})
		}
	},
	reload:function(reInstall){
		console.log("RELOAD");
		this.watcher.close();
		var restart=function(){
			this.fileList.reset(function(){
				this.initWatcher();
			}.bind(this));
		}.bind(this);
		if(this.server && this.server.close) this.server.close(restart);
		else restart();
	},
	
	_onChangedFile:function(){
		if(this._start==null) this._start=Date.now();
	},
	_endCompilation:function(){
		var start=this._start;
		this._start=null;
		return start;
	},
	bindWatcherEvents:function(){
		this.watcher
			.on('add',function(path){
				this._onChangedFile();
				this.fileList.emit('change', path, PluginsList.find(path));
			}.bind(this))
			.on('change',function(path){
				if(this.fileList.isConfig(path)) this.reload(false);
				//else if(path is config.paths.packageConfig reload(true)
				else{
					this._onChangedFile();
					this.fileList.emit('change', path, PluginsList.find(path));
				}
			}.bind(this))
			.on('unlink',function(path){
				/*if path is config.paths.config or path is config.paths.packageConfig
	        logger.info "Detected removal of config.coffee / package.json.
	Exiting."
			process.exit(0)*/
				this._onChangedFile();
				this.fileList.emit('unlink', path);
			}.bind(this))
	}
};


module.exports={
	init:function(fileList,persistent,startServer,pluginsDir){
		var sw=new SpringbokWatcher(fileList,persistent,startServer,pluginsDir);
		sw.init();
	}
};