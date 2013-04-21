/* https://github.com/brunch/brunch/blob/master/src/fs_utils/file_list.coffee */
var util=require("util"), sysPath=require('path'),fs=require("fs"), EventEmitter=require("events").EventEmitter,
	SourceFile=require('./SourceFile.js');

var RESET_TIME=65;
var FileList=S.extClass(EventEmitter,{
	isCore:false,
	
	ctor:function(rootPath){
		EventEmitter.call(this);
		this.rootPath=rootPath;
		this.reset();
	},
	
	init:function(){},
	reset:function(callback){
		var reset=function(){
			this.removeAllListeners();
			this.files=[];
			this.compiling=[];
			this.cleanDirectories();
			
			this.on('change',this._change);
			this.on('unlink',this._unlink);
			
			this.init();
			callback && callback();
		}.bind(this);
		
		if(!this.compiling || this.compiling.length===0) reset();
		else this.once('ready',reset);
		
	},

	filesToWatch:function(){
		return [this.rootPath+'package.json',this.rootPath+'src'];
	},
	// return true if need to rebuild everything
	isConfig:function(path){
		return path===this.rootPath+'package.json';
	},
	cleanDirectories:function(dirs){
		/* https://gist.github.com/2367067 */
		var rmrdir=function(dir){
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
				console.error(err.message);
			}
		};

		if(!dirs) dirs=['dev','prod'];
		for(var iDir in dirs) rmrdir(this.rootPath+dirs[iDir]);
	},
	
	_ignored:function(path){
		if(path==='package.json') return true;
		return false;
	},
	//Called every time any file was changed. Emits `ready` event
	_checkReady:function(){
		if(this._timer) clearTimeout(this._timer);
		if(this.compiling.length===0){
			this._timer=setTimeout((function(){
				this.compiling.length===0 ? this.emit('ready') : this._checkReady();
			}).bind(this),RESET_TIME);
		}
	},
	_compileDependentFiles:function(path){
		this.files
			.filter(function(dependent){ return dependent.cache.dependencies 
													&& dependent.cache.dependencies.length > 0 })
			.filter(function(dependent){ return path in dependent.cache.dependencies })
			.forEach(this._compile.bind(this));
	},
	_compile:function(file){
		var t=this;
		t.compiling.push(file);
		console.log("Compiling file: "+file.path);
		this._compileFile(file,function(error){
			t.compiling.splice(t.compiling.indexOf(file),1);
			if(error){
				console.log('ERROR: file: '+file.path+': '+error);
				t._checkReady();
				return false;
			}
			console.log("Compiled file: "+file.path);
			t._compileDependentFiles(file.path);
			t._checkReady();
		})
	},
	/* overridable */
	_compileFile:function(file,onCompiled){
		file.compile(onCompiled);
	},
	
	_findByPath:function(path){
		return this.files.filter(function(file){return file.path===path;})[0];
	},
	_add:function(path,compilerLintersOptimizers){
		//console.log("_ADD: "+path);
		var file = this.newSourceFile(path.substr(4),compilerLintersOptimizers);
		this.files.push(file);
		return file;
	},
	newSourceFile:function(path,compilerLintersOptimizers){
		return new SourceFile(this,path,compilerLintersOptimizers)
	},
	
	_change:function(path,compilerLintersOptimizers){
		path=path.substr(this.rootPath.length);
		//console.log("_CHANGE: "+path);
		var ignored=this._ignored(path);
		if(ignored) this._compileDependentFiles(path);
		else{
			this._compile(this._findByPath(path) || this._add(path,compilerLintersOptimizers));
		}
	},
	_unlink:function(path){
		path=path.substr(this.rootPath.length);
		var ignored=this._ignored(path);
		if(ignored) this._compileDependentFiles(path);
		else{
			var file=this._findByPath(path);
			this.files.splice(this.files.indexOf(file),1);
		}
		this._checkReady();
	}
});
module.exports=FileList;