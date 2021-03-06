var fs=require('fs'), sysPath=require('path'), mkdirp=require('mkdirp');

var regexpSubfolders=/^([a-zA-Z]+)\/(?:([a-zA-Z]+)\/)?(?:([a-zA-Z]+)\/)?/,webAppFolders={controllers:'c',models:'m',views:'v',viewsLayouts:'vL'};

module.exports = S.newClass({
	ctor: function(fileList,path,compilerLintersOptimizers){
		this.fileList=fileList;
		this.rootPath=fileList.rootPath; this.path=path;
		this.srcPath=fileList.rootPath+'src/'+path; //must be before (cand be overrided by extends)
		UObj.extend(this,compilerLintersOptimizers);
		this.type=this.compiler && this.compiler.type;
		
		this.dirname=sysPath.dirname(path)+'/'; this.basename=sysPath.basename(path);
		
		var compiledExtension=this.compiler && this.compiler.compiledExtension;
		//if(S.isFunction(compiledExtension)) compiledExtension=compiledExtension(this);
		
		if(!this.compiledPath) this.compiledPath=compiledExtension?path.replace(/^(.+)\.\w{2,}$/,'$1')+'.'+compiledExtension:path;
		this.compiler && this.compiler.newSourceFile && this.compiler.newSourceFile(this);
		
		
		if((this.isBrowser=path.startsWith('web/'))) this.isWebApp=false;
		else{
			var mSubfolder=path.match(regexpSubfolders);
			if(mSubfolder){
				if(this.isBrowser=(mSubfolder[2]==='web')){
					this.isWebApp=false;
					this.compiledPath=this.compiledPath.replace(/^[a-zA-Z]+\//,'');
				}else{
					if( this.isWebApp=(fileList.buildConfig && fileList.buildConfig.webapps && UArray.has(fileList.buildConfig.webapps,mSubfolder[1])) ){
						this.webApp=mSubfolder[1];
						if(this.dirname===this.webApp+'/' && this.basename===this.webApp+'.js'){
							this.isWebAppEntry=this.isBrowser=this.isMainJs=true;
							this.compiledPath='web/'+this.compiledPath.substr(this.webApp.length+1);
						}else{
							switch(mSubfolder[2]){
								case 'config':
									this.compiledPath=this.compiler=false;
									break;
								case 'models':
									if(mSubfolder[3]){
										this.compiledPath=this.compiler=false;
										break;
									}
									this.isWebAppDB=true;
								case 'controllers':
								case 'views':
								case 'viewsLayouts':
									this.isBrowser=true;
									this.compiledPath='web/'+this.webApp+'/'+webAppFolders[mSubfolder[2]]+'/'+this.compiledPath.substr(mSubfolder[0].length);
									if(mSubfolder[2].substr(0,5)==='views' && this.compiledPath.slice(0,-4)==='.ejs')
										this.compiledPath = this.compiledPath.slice(0,-3)+'js';
									break;
								case 'locales':
									break;
							}
						}
					}
				}
			}
		}
		this.compiledPathDirname=sysPath.dirname(this.compiledPath);
		
		
		this.cache=Object.seal({ dependencies:[], compilationTime:null, compilationSource:undefined, error:null });
		this.cancel=function(callback){
			this.cancel.isCanceled=true;
			this.cancel.callback=callback;
		};
		Object.freeze(this);
	},
	
	fullDirnamePath: function(middleFolder){
		return this.rootPath+(middleFolder||'src')+'/'+this.dirname;
	},
	
	log: function(message){
		this.fileList.logger.prefix().color('purple',this.path).add(' '+message).nl();
	},
	
	forEachOutputs: function(callback,onEnd){
		//TODO : SourceFileProcessing => forEachAsync
		UObj.forEachSeries(this.fileList.outputsType,callback,onEnd);
	},
	
	parse: function(fileContent,callback){
		this.checkCancel(function(){
			(this.compiler.parse || function(fileContent,callback){ callback(null,fileContent); })(fileContent,callback);
		});
	},
	
	lint: function(file,data,callback){
		this.checkCancel(function(){
			var linters=this.linters,l=linters.length;
			if(l===0) callback(null);
			else{
				var i=0,callbackLinters=function callbackLinters(err,file,data){
					if(err) return callback(err);
					if(i===l) return callback(null);
					linters[i++].lint(file,data,callbackLinters);
				};
				callbackLinters(null,file,data);
			}
		});
	},
	optimize: function(file,results,callback){
		var t = this;
		t.checkCancel(function(){
			var optimizers=this.optimizers,l=optimizers.length;
			if(l===0) callback(null,results);
			else{
				var i=0,callbackOptimizer=function callbackOptimizer(err,results){
					if(err) return callback(err);
					t.checkCancel(function(){
						if(i===l) return callback(null,results);
						if(err===false) return callback(false);
						optimizers[i++].optimize(file,results,callbackOptimizer);
					});
				};
				callbackOptimizer(null,results);
			}
		});
	},
	// real compilation
	_compile: function(data,callback){
		this.checkCancel(function(){
			this.compiler.compile(this,data,callback);
		});
	},
	
	checkCancel: function(callback){
		if(this.cancel.isCanceled){
			this.log('Compilation canceled');
			this.cancel.isCanceled=false;
			callback=this.cancel.callback;
			this.cancel.callback=undefined;
		}
		callback.call(this);
	},
	
	// Reads file and compiles it with compiler. Data is cached
	compile: function(callback,compilationSource){
		if( compilationSource && this.cache.compilationSource && this.cache.compilationSource === compilationSource ) return;
		var callbackError=function(type,strOrErr){
			/*if(strOrErr instanceof Array){
				var i,finalStr='Errors :';
				for(i in strOrErr){
					console.error(strOrErr[i].stack);
					finalStr+=+"\n"+strOrErr[i].toString().slice(7);
				}
				strOrErr=finalStr;
			}*/
			//var error=new Error(strOrErr instanceof Error ? strOrErr.toString().slice(7) : strOrErr);
			var error=strOrErr instanceof Error ? strOrErr : new Error(strOrErr);
			error._Type=type;
			t.cache.error=error;
			callback(error);
		},t=this;
		
		if(t.compiler){
			(t.compiler.read||function(path,callback){
				fs.readFile(t.srcPath,function(err,buffer){
					if(err) return callback(err);
					callback(null,buffer.toString());
				});
			})(t.srcPath,function(err,fileContent){
				if(err) return callbackError('Reading',err);
				t.lint(t,fileContent,function(err){
					if(err) return callbackError('Linting',err);
					
					t.parse(fileContent,function(err,data){
						if(err) return callbackError('Parsing',err);
						try{
							t._compile(data,function(err,results,dependencies){
								if(err) return callbackError('Compiling',err);
								if(err===false) return callback();
								t.optimize(t,results,function(err,optimizedResults){
									if(err) return callbackError('Optimizing',err);
									t.cache.error=null;
									t.cache.compilationTime=Date.now();
									t.cache.compilationSource=compilationSource;
									if(err===false){
										t.cache.dependencies=null;
										return callback();
									}
									t.cache.dependencies=!dependencies || dependencies.app ? dependencies : {app:dependencies};
									t.write(optimizedResults,callback);
								});
							});
						}catch(err){
							return callbackError('Compiling',err);
						}
					});
				});
			});
		}else{
			t.copy(callback);
		}
	},
	
	paths: function(callback,results,write,destinationPath){
		var paths=new Map, resultsIsString = S.isString(results);
		UArray.forEachAsync(this.fileList.outputs,function(dir,callback){
			if(results && !resultsIsString && results[dir]==null) return callback();
			var path = this.rootPath+dir+'/';
			this._write(path+this.compiledPathDirname,function(err){
				if(err) return callback(err);
				paths.set(dir,path=(path+(destinationPath||this.compiledPath)));
				if(results && write){
					fs.writeFile(path,resultsIsString ? results : results[dir],function(err){
						if(err) return callback(err);
						callback();
					});
				}else callback();
			}.bind(this));
		}.bind(this),function(err){ callback(err,paths); });
	},
	
	write: function(results,callback,destinationPath){
		return this.paths(callback,results,true,destinationPath);
	},
	
	remove: function(){
		UArray.forEachAsync(this.fileList.outputs,function(dir,callback){
			var path = this.rootPath+dir+'/'+this.compiledPath;
			fs.exists(path,function(exists){
				exists && fs.unlink( path );
			});
		});
	},
	
	copy: function(callback){
		var srcPath=this.srcPath;
		UArray.forEachAsync(this.fileList.outputs,function(dir,callback){
			this._write(this.rootPath+dir+'/'+this.compiledPathDirname,function(err){
				if(err) return callback(err);
				var input=fs.createReadStream(srcPath),
					output=fs.createWriteStream(this.rootPath+dir+'/'+this.compiledPath);
				var request=input.pipe(output);
				request.on('close',callback);
			}.bind(this));
		}.bind(this),callback);
	},
	
	_write: function(parent,callback){
		this.checkCancel(function(){
			fs.exists(parent,function(exists){
				exists ? callback() 
					: mkdirp(parent,function(err){
						callback(err);
					});
			});
		});
	}
});
