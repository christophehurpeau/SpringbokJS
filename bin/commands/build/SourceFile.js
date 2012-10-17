var fs=require('fs'), sysPath=require('path'), mkdirp=require('mkdirp');

var SourceFile=module.exports=function(fileList,path,compiler,linters,optimizers){
	this.fileList=fileList;
	this.rootPath=fileList.rootPath; this.path=path; this.srcPath=fileList.rootPath+'src/'+path;
	this.compiledPath=compiler&&compiler.compiledExtension?path.replace(/^(.+)\.\w{2,}$/,'$1')+'.'+compiler.compiledExtension:path;
	this.dirname=sysPath.dirname(path); this.basename=sysPath.basename(path);
	this.compiler=compiler; this.linters=linters; this.optimizers=optimizers;
	this.type=compiler&&compiler.type;
	this.isBrowser=/^web\//.test(path);
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
				if(i===l) callback(null,devResult,prodResult);
				optimizers[i++].optimize(file,devResult,prodResult,callbackOptimizer);
			}
			callbackOptimizer(null,file,devResult,prodResult);
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
			var str=strOrErr instanceof Error ? console.error(strOrErr.stack)&&strOrErr.toString().slice(7) : strOrErr,
				error=new Error(str);
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
							t.optimize(t,devResult,prodResult,function(err,devResultOptimized,prodResultOptimized){
								t.cache.dependencies=dependencies;
								t.cache.compilationTime=Date.now();
								t.cache.error=null;
								t.write(devResultOptimized,prodResultOptimized);
								callback(null);
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
	
	write:function(devResultOptimized,prodResultOptimized){
		var t=this;
		['dev/','prod/'].forEach(function(dir){
			t._write(t.rootPath+dir+t.dirname,function(){
				fs.writeFile(t.rootPath+dir+t.compiledPath,dir==='dev/'?devResultOptimized:prodResultOptimized,function(err){
					if(err!=null) console.error(err.stack);
				})
			})
		});
	},
	copy:function(callback){
		var t=this,srcPath=this.srcPath,
			closed={'dev/':false,'prod/':false},
			closeCallback=function(dir){
				return function(){
					closed[dir]=true;
					if(closed['dev/']&&closed['prod/']) callback();
				};
			};
		['dev/','prod/'].forEach(function(dir){
			t._write(t.rootPath+dir+t.dirname,function(){
				var input=fs.createReadStream(srcPath),
					output=fs.createWriteStream(t.rootPath+dir+t.compiledPath);
				var request=input.pipe(output);
				request.on('close',closeCallback(dir));
			});
		});
	},
	
	_write:function(parent,callback){
		fs.exists(parent,function(exists){
			exists ? callback() 
				: mkdirp(parent,function(err){
					if(err!=null) console.error(err.stack);
					callback();
				});
		});
	}
};
