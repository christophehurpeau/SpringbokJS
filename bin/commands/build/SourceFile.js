var fs=require('fs'), sysPath=require('path'), mkdirp=require('mkdirp'), async=require('async');

var SourceFile=module.exports=function(fileList,path,compilerLintersOptimizers){
	this.fileList=fileList;
	this.rootPath=fileList.rootPath; this.path=path;
	UObj.extend(this,compilerLintersOptimizers);
	this.type=this.compiler&&this.compiler.type;
	
	this.srcPath=fileList.rootPath+'src/'+path;
	this.dirname=sysPath.dirname(path)+'/'; this.basename=sysPath.basename(path);
	
	this.compiledPath=this.compiler&&this.compiler.compiledExtension?path.replace(/^(.+)\.\w{2,}$/,'$1')+'.'+this.compiler.compiledExtension:path;
	
	if((this.isBrowser=path.startsWith('web/'))) this.isWebApp=false;
	else{
		var resWebApp;
		if( this.isWebApp=fileList.regexpWebAppPath && (resWebApp=fileList.regexpWebAppPath.exec(path)) ){
			this.webApp=resWebApp[1];
			if(this.dirname===this.webApp+'/' && this.basename===this.webApp+'.js'){
				this.isWebAppEntry=this.isBrowser=true;
				this.compiledPath='web/'+this.compiledPath.substr(this.webApp.length+1);
				
			}else if( this.isBrowser=path.slice(this.webApp.length+1,4)==='web/'){
				this.compiledPath=this.compiledPath.substr(this.webApp.length+5);
				this.compiledPath='web/'+(this.compiledPath.startsWith(this.webApp)?'':this.webApp+'/')+this.compiledPath;
				console.log('substr path : ',this.compiledPath);
			}
		}
	}
	this.compiledPathDirname=sysPath.dirname(this.compiledPath);
	
	
	this.cache=Object.seal({ dependencies:[], compilationTime:null, error:null });
	Object.freeze(this);
}
SourceFile.prototype={
	
	lint:function(file,data,callback){
		var linters=this.linters,l=linters.length;
		if(l===0) callback(null);
		else{
			var i=0,callbackLinters=function callbackLinters(err,file,data){
				if(err) return callback(err);
				if(i===l) return callback(null);
				linters[i++].lint(file,data,callbackLinters);
			}
			callbackLinters(null,file,data);
		}
	},
	optimize:function(file,devResult,prodResult,callback){
		var optimizers=this.optimizers,l=optimizers.length;
		if(l===0) callback(null,devResult,prodResult);
		else{
			var i=0,callbackOptimizer=function callbackOptimizer(err,devResult,prodResult){
				if(err) return callback(err);
				if(i===l) return callback(null,devResult,prodResult);
				if(err===false) return callback(false);
				optimizers[i++].optimize(file,devResult,prodResult,callbackOptimizer);
			}
			callbackOptimizer(null,devResult,prodResult);
		}
	},
	
	// Reads file and compiles it with compiler. Data is cached
	compile:function(callback){
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
			fs.readFile(t.srcPath,function(err,buffer){
				if(err) return callbackError('Reading',err);
				var fileContent=buffer.toString();
				t.lint(t,fileContent,function(err){
					if(err) return callbackError('Linting',err);
					try{
						t.compiler.compile(t,fileContent,function(err,devResult,prodResult,dependencies){
							if(err) return callbackError('Compiling',err);
							if(err===false) return callback();
							t.optimize(t,devResult,prodResult,function(err,devResultOptimized,prodResultOptimized){
								if(err) return callbackError('Optimizing',err);
								t.cache.error=null;
								t.cache.compilationTime=Date.now();
								if(err===false){
									t.cache.dependencies=null;
									return callback();
								}
								t.cache.dependencies=!dependencies || dependencies.app ? dependencies : {app:dependencies};
								t.write(devResultOptimized,prodResultOptimized,callback);
							});
						})
					}catch(err){
						return callbackError('Compiling',err);
					}
				})
			});
		}else{
			t.copy(callback);
		}
	},
	
	paths:function(callback,results,write){
		var paths=[];
		async.forEach(['dev','prod'],function(dir,callback){
			if(results && results[dir]==null) return callback();
			var path=this.rootPath+dir+'/';
			this._write(path+this.compiledPathDirname,function(err){
				if(err) return callback(err);
				paths.push(path=(path+this.compiledPath));
				if(results && write){
					fs.writeFile(path,results[dir],function(err){
						if(err) return callback(err);
						callback();
					});
				}else callback();
			}.bind(this));
		}.bind(this),function(err){ callback(err,paths); });
	},
	
	write:function(devResultOptimized,prodResultOptimized,callback){
		return this.paths(callback,{'dev':devResultOptimized,'prod':prodResultOptimized},true);
	},
	copy:function(callback){
		var t=this,srcPath=this.srcPath;
		async.forEach(['dev','prod'],function(dir,callback){
			t._write(t.rootPath+dir+'/'+t.compiledPathDirname,function(){
				var input=fs.createReadStream(srcPath),
					output=fs.createWriteStream(t.rootPath+dir+'/'+t.compiledPath);
				var request=input.pipe(output);
				request.on('close',callback);
			});
		},callback);
	},
	
	_write:function(parent,callback){
		fs.exists(parent,function(exists){
			exists ? callback() 
				: mkdirp(parent,function(err){
					callback(err);
				});
		});
	}
};
