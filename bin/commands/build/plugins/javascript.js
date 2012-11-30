//var jshint=require('jshint').JSHINT;

module.exports={
	type:'javascript',
	extension:'js',
	
	init:function(config){
		
	},
	/*
	lint:function(file,data,callback){
		var success=jshint(data,{
			browser:false,
			cap:false,
			node:true,
			undef:false,
		});
		if(success) return callback();
		else{
			callback(
				jshint.errors.filter(function(error){ return error != null; })
					.map(function(error){
						//var evidence= (error.evidence ? "\n\n" + error.evidence + "\n" : '\n');
						return "" + error.reason + " " + (error.id || '') + " at line " + error.line + ", column " + error.character;
					})
					.join('\n')
			);
		}
	},*/
	
	compile:function(file,data,callback){
		if(file.isBrowser)
			data=data.replace(/\/\*\s+NODE\s+\*\/.*\/\*\s+\/NODE\s+\*\//g,'')
				.replace('/* BROWSER */','').replace('/* /BROWSER */','')
				.replace(/\(\/\* NODE\|\|BROWSER \*\/([^)|]+)||([^)]+)\)/g,'$2');
		else
			data=data.replace(/\/\*\s+BROWSER\s+\*\/.*\/\*\s+\/BROWSER\s+\*\//g,'')
				.replace('/* NODE */','').replace('/* /NODE */','')
				.replace(/\(\/\*\s+NODE\|\|BROWSER\s+\*\/([^\)\|]+)\|\|([^)]+)\)/g,'$1')
				.replace(/\(\/\*\s+NODE\|\|BROWSER\s+\*\/([^\)\|]+)\|\|([^)]+)\)/g,'$1');
		
		data.replace(/\/\*\s+(RM|HIDE|REMOVE|NONE)\s+\*\/.*\/\*\s+\/(RM|HIDE|REMOVE|NONE)\s+\*\//g,'');
		
		var devResult=data,prodResult=data;
		devResult=devResult.replace(/\/\*\s+PROD\s+\*\/.*\/\*\s+\/PROD\s+\*\//g,'').replace('/* DEV */','').replace('/* /DEV */','');
		prodResult=prodResult.replace(/\/\*\s+DEV\s+\*\/.*\/\*\s+\/DEV\s+\*\//g,'').replace('/* PROD */','').replace('/* PROD */','');
		
		callback(null,devResult,prodResult);
	}
}
