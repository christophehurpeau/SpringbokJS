/* https://github.com/brunch/brunch/blob/master/src/fs_utils/file_list.coffee */
var util=require("util"), sysPath=require('path'),fs=require("fs"), EventEmitter=require("events").EventEmitter,
	SourceFile=require('./SourceFile.js');

var RESET_TIME=65;
var FileList=S.extClass(EventEmitter,{
	ctor:function(rootPath){
		EventEmitter.call(this);
		this.files=[];
		this.rootPath=rootPath;
		this.compiling=[];
		this.on('change',this._change);
		this.on('unlink',this._unlink);
		this.cleanDirectories();
	},

	filesToWatch:function(){
		return [this.rootPath+'package.json',this.rootPath+'src'];
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
		if(path.substr(0,11)==='src/config/') return false;
		return S.sStartsWith(sysPath.basename(path),'_');
	},
	//Called every time any file was changed. Emits `ready` event after `RESET_TIME`.
	_resetTimer:function(){
		var t=this;
		if(t._timer) clearTimeout(t._timer);
		t._timer=setTimeout(function(){
			t.compiling.length===0 ? t.emit('ready') : t._resetTimer();
		},RESET_TIME);
	},
	_compileDependentFiles:function(path){
		this.files
			.filter(function(dependent){ return dependent.cache.dependencies 
													&& dependent.cache.dependencies.length > 0 })
			.filter(function(dependent){ return path in dependent.cache.dependencies })
			.forEach(this._compile);
	},
	_compile:function(file){
		var t=this;
		t.compiling.push(file);
		file.compile(function(error){
			t.compiling.splice(t.compiling.indexOf(file),1);
			t._resetTimer();
			if(error){
				console.log('ERROR: file: '+file.path+': '+error);
				return false;
			}
			console.log("Compiled file: "+file.path);
			t._compileDependentFiles(file.path);
		})
	},
	_findByPath:function(path){
		return this.files.filter(function(file){return file.path===path;})[0];
	},
	_add:function(path,compiler,linters,optimizers){
		//console.log("_ADD: "+path);
		var file = new SourceFile(this,path.substr(4),compiler,linters,optimizers);
		this.files.push(file);
		return file;
	},
	_change:function(path,compiler,linters,optimizers){
		path=path.substr(this.rootPath.length);
		//console.log("_CHANGE: "+path);
		var ignored=this._ignored(path);
		if(ignored) this._compileDependentFiles(path);
		else{
			this._compile(this._findByPath(path) || this._add(path,compiler,linters,optimizers));
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
		this._resetTimer();
	}
});
module.exports=FileList;