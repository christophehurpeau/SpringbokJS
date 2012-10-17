module.exports=function(locales){
	var _locales={};
	
	locales.forEach(function(locale){
		locales[locale]=require('./'+locale)(Locale);
	})
	return _locales;
}
