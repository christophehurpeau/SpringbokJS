includeCore('elements/');
S.extPrototype(S.Helpers,{
	doctype:function(){
		return (this._isIElt8=this.req.isIElt8())
			? '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">'
			: '<!DOCTYPE html>';
	},
	
	linkRSS:function(title,url){
		return '<link rel="alternate" type="application/rss+xml" href="'+this.url(url)+'" title="'+title+'"/>';
	},
	linkAtom:function(title,url){
		return '<link rel="alternate" type="application/atom+xml" href="'+this.url(url)+'" title="'+title+'"/>';
	},
	
	metaCharset:function(encoding){
		if(!encoding) encoding = 'utf-8';
		return this._isIElt8
			? '<meta http-equiv="Content-Type" content="text/html; charset='+encoding+'"/>'
			: '<meta charset="'+encoding+'">';
	},
	metaLanguage:function(){
		var lang='en';
		return '<meta name="language" content="'+lang+'"/><meta http-equiv="content-language" content="'+lang+'"/>';
	},
	
	cssLink:function(url,media){
		if(!url) url='/main';
		return '<link rel="stylesheet" type="text/css" href="'+this.staticUrl(url+'.css')+'"'+(media?' media="'+media+'"':'')+'/>';
	},
	jsLink:function(url){
		return '<script type="text/javascript" src="'+this.staticUrl(url+(this.req.isIElt9() ? '.oldIe' : '')+'.js')+'"></script>';
	},
	favicon:function(imgUrl){
		if(!imgUrl) imgUrl=='favicon.png';
		var href=STATIC_URL+'img/'+imgUrl;
		return '<link rel="icon" type="image/vnd.microsoft.icon" href="'+href+'"/>'
			+'<link rel="shortcut icon" type="image/x-icon" href="'+href+'"/>';
	},
	
	jsI18n:function(url){
		if(!url) url='/main';
		return this.jsLink(url+'.en');//TODO use CLang
	},
});