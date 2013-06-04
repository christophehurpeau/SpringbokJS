var yml=require('./yml/'),YAML=require('js-yaml');
module.exports={
	type:'yml',
	extension:'yml',
	priority:0,
	
	prepare:function(file){
		
	},
	
	parse:function(fileContent,callback){
		try{
			fileContent=fileContent.replace("\t",' ');
			callback(null,YAML.load(fileContent));
		}catch(err){
			callback(err);
		}
	},
	
	newSourceFile:function(file){
		var m=file.path.match(/^([a-zA-Z]+)\/locales\/([a-zA-Z]+)\.yml$/);
		if(m){
			file.compiledPath='web/'+m[1]+'.'+m[2]+'.js';
			file.lang=m[2];
		}
	},
	
	compile:function(file,data,callback){
		if(file.lang){
			UFiles.readYamlAsync(CORE_SRC+'locales/'+file.lang+'.yml',function(err,coreTranslations){
				if(err) return callback(err);
				var jsTranslations='var i18nc='+JSON.stringify(coreTranslations)
							+',i18n='+JSON.stringify(data)+';';
				
				callback(null,jsTranslations,jsTranslations);
			});
			
			return;
		}
		
		if(file.isWebApp) return callback(false);
		if(file.path.startsWith('config/')) return yml.config(file,data,callback);
		
		
		return callback(null,data,data);
	}
}
