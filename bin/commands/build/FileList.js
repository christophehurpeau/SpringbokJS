/* https://github.com/brunch/brunch/blob/master/src/fs_utils/file_list.coffee */
var util = require("util"), sysPath = require('path'), fs = require("fs");
var EventEmitter = require("events").EventEmitter;
var SourceFile = require('./SourceFile.js');

var RESET_TIME = 700; //ms
var FileList = S.extClass(EventEmitter, {
	isCore: false,
	
	ctor: function(rootPath){
		EventEmitter.call(this);
		this.rootPath = rootPath;
		this.reset();
	},
	
	init: function(){},
	reset: function(callback){
		var reset = function(){
			this.emit('reset');
			
			this.removeAllListeners();
			this.files = [];
			this.errors = {};
			this.errorsCount = 0;
			this.compiling = [];
			this.cleanDirectories();
			this.firstTime = true;
			this.compilationId = false;
			this.state = 'ready';
			
			this.on('change', this._change);
			this.on('unlink', this._unlink);
			this.once('ready',function(){
				this.firstTime = false;
				this.compilationId = false;
			}.bind(this));
			
			this.init();
			callback && callback();
		}.bind(this);
		
		if(!this.compiling || this.compiling.length === 0) reset();
		else this.once('ready',reset);
		
	},
	
	hasErrors: function(){
		return this.errorsCount > 0;
	},

	filesToWatch: function(){
		return [ this.rootPath+'package.json', this.rootPath+'src' ];
	},
	// return true if need to rebuild everything
	isConfig: function(path){
		return path === this.rootPath+'package.json';
	},
	cleanDirectories: function(dirs){
		/* https://gist.github.com/2367067 */
		var rmrdir = function(dir){
			try{
				var list = fs.readdirSync(dir),i=0,filename,stat,filesLength=list.length;
				if(filesLength!==0)
					for(; i < filesLength; i++) {
						filename = sysPath.join(dir, list[i]);
						if(filename !== "." && filename !== ".."){ // pass these files
							stat = fs.statSync(filename);
							if(stat.isDirectory()) rmrdir(filename);
							else fs.unlinkSync(filename);
						}
					}
				fs.rmdirSync(dir);
			}catch(err){
				console.error('rmdir error: '+(err.stack || err.message));
			}
		};

		if(!dirs) dirs = ['dev','prod'];
		dirs.forEach(function(dir){ fs.existsSync(this.rootPath+dir) && rmrdir(this.rootPath+dir); }.bind(this));
	},
	
	_ignored: function(path){
		if(path === 'package.json') return true;
		return false;
	},
	//Called every time any file was changed. Emits `ready` event
	_checkReady: function(){
		if(this._resetReady());
		if(this.compiling.length === 0)
			this._timer = setTimeout(function(){
				if(this.compiling.length===0){
					this.emit('ready');
					this.state = 'ready';
				}
			}.bind(this),RESET_TIME);
	},
	_resetReady: function(){
		if(this._timer) clearTimeout(this._timer);
	},
	compileDependentFiles: function(path,type,compilationSource){
		if(this.firstTime) return false;
		//console.log('===> compileDependentFiles:', path,type);
		type = type || 'app';
		compilationSource = compilationSource || this.compilationId;
		//type === 'Includes' && console.log(type, path, this.files.length);
		var files = this.files
			.filter(function(file){
				(path === 'webapp/web/webapp.styl' || path === 'elements/Elt.dom.js')
					 && console.log( file.path, !!(file.cache.dependencies && file.cache.dependencies[type]),
						file.cache.dependencies && file.cache.dependencies[type] && file.cache.dependencies[type].length, 
						file.cache.dependencies && file.cache.dependencies[type] && path in file.cache.dependencies[type],
						file.cache.dependencies);
				return file.cache.dependencies && file.cache.dependencies[type]; // file.cache.dependencies[type] is an object, not an array, but should be a Set.
			});
		//UArray.has(['Includes','Core'],type) && console.log('COMPILE DEPENDENT FILES: ',type, path, files.length, files.map(function(f){ return f.path; }));
		if(path) files = files.filter(function(file){ return path in file.cache.dependencies[type]; });
		//UArray.has(['Includes','Core'],type) && console.log('COMPILE DEPENDENT FILES: [2] ',type, path, files.length, files.map(function(f){ return f.path; }));
		if(files.length)
			files.forEach(function(file){ this._compile(file,compilationSource); }.bind(this));
		else
			this._checkReady();
	},
	_compile: function(file,compilationSource){
		var iFile=UArray.findKeyBy(this.compiling,'path',file.path),
		 callback=function(){
		 	if(this.state !== 'compiling')
		 		this.emit(this.state = 'compiling');
		 	
		 	this.compiling.push(file);
			console.log("Compiling file: "+file.path+" ["+this.compiling.length+"]");
			this._compileFile(file,function(error){
				file.checkCancel(function(){
					this.compiling.splice(this.compiling.indexOf(file),1);
					if(error){
						console.log('ERROR: '+file.path+': '+error);
						this.errors[file.path]=error;
						this.errorsCount++;
						this._checkReady();
						return false;
					}
					if(this.errors[file.path]){
						this.errorsCount--;
						delete this.errors[file.path];
					}
					
					console.log("Compiled file: "+file.path+' to '+file.compiledPath+" [remaining: "+this.compiling.length+']');
					this.compileDependentFiles(file.path,'app',compilationSource);
					this.emit('compiled',file);
					(file.path === 'webapp/web/webapp.styl' || file.path === 'webapp/webapp.js') && console.log(file.cache);
					this._checkReady();
				}.bind(this));
			}.bind(this));
		}.bind(this);
		
		if(iFile===false) callback();
		else{
			console.log('[!] file '+file.path+' is already in compiling...');
			file.cancel(callback);
		}
	},
	/* overridable */
	_compileFile: function(file,onCompiled,compilationSource){
		file.compile(onCompiled,compilationSource);
	},
	
	_findByPath: function(path){
		return this.files.filter(function(file){ return file.path === path; })[0];
	},
	_add: function(path,compilerLintersOptimizers){
		//console.log("_ADD: "+path+' ; Total Files='+this.files.length);
		var file = this.newSourceFile(path.substr(4),compilerLintersOptimizers);
		this.files.push(file);
		return file;
	},
	newSourceFile: function(path,compilerLintersOptimizers){
		return new SourceFile(this,path,compilerLintersOptimizers);
	},
	
	_change: function(path,compilerLintersOptimizers){
		this.compilationId = Date.now();
		path = path.substr(this.rootPath.length);
		var basename = sysPath.basename(path);
		if( this._ignored(path,basename) ) this._checkReady();
		else{
			this._resetReady();
			if( this._notcompilable(path,basename) ){
				this.emit('changedNotCompilableFile',path);
				this.compileDependentFiles(path);
			}else{
				this._compile(this._findByPath(path) || this._add(path,compilerLintersOptimizers));
			}
		}
	},
	_unlink: function(path){
		path=path.substr(this.rootPath.length);
		var basename = sysPath.basename(path);
		if(this._ignored(path,basename) )  this._checkReady();
		else{
			this._resetReady();
			if(this._notcompilable(path,basename))
				this.compileDependentFiles(path);
			else{
				var file = this._findByPath(path);
				file && file.checkCancel(function(){
					this.files.splice(this.files.indexOf(file),1);
					file.remove();
					this._checkReady();
				}.bind(this));
			}
		}
	}
});
module.exports = FileList;