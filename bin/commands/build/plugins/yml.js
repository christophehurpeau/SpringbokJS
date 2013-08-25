var yml=require('./yml/'),YAML=require('js-yaml');
module.exports={
	type:'yml',
	extension:'yml',
	priority:0,
	
	prepare:function(file){
		
	},
	
	parse:function(fileContent,callback){
		try{
			fileContent=fileContent.replace(/\t/g,' ');
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
			UFiles.readYamlAsync(CORE_SRC+'locales/'+file.lang+'.yml',function(coreTranslations){
				if(!coreTranslations) return callback('Unable to read translations ! '+file.lang);
				var jsTranslations='window.i18n=' + UFiles.readSync(CORE_SRC+'locales/'+file.lang+'.js').substr(15) 
							+'window.i18nc=window.i18n.coreTranslations='+JSON.stringify(coreTranslations)+';'
							+'window.i18n.appTranslations='+JSON.stringify(data)+';';
				
				callback(null,jsTranslations,jsTranslations,{Core:'locales/'+file.lang+'.yml'});
			});
			
			return;
		}
		
		if(file.isWebApp) return callback(false);
		if(file.path.startsWith('config/')) return yml.config(file,data,callback);
		
		
		return callback(null,data,data);
	}
};
