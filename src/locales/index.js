module.exports=function(locales){
	var _locales={}, defaults=require('./defaults');
	
	locales.forEach(function(locale){
		locales[locale]=defaults(require('./'+locale)(Locale));
	})
	return _locales;
}
