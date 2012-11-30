var Elt=require('./Element');
module.exports={
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
		return this._isIElt8
			? '<meta http-equiv="Content-Type" content="text/html; charset='+(encoding||'utf-8')+'"/>'
			: '<meta charset="'+(encoding||'utf-8')+'">';
	},
	
	cssLink:function(url,media){
		if(!url) url='/main';
		return '<link rel="stylesheet" type="text/css" href="'+this.staticUrl(url.indexOf('?')!==-1?url:(url+'.css'),'css')+'"'+(media?' media="'+media+'"':'')+'/>';
	},
	favicon:function(imgUrl){
		if(!imgUrl) imgUrl=='favicon.png';
		var href=STATIC_URL+'img/'+imgUrl;
		return '<link rel="icon" type="image/vnd.microsoft.icon" href="'+href+'"/>'
			+'<link rel="shortcut icon" type="image/x-icon" href="'+href+'"/>';
	},
	
	link:function(title,url,options){
		return this.linkHtml(S.escape(title),url,options);
	},
	linkHtml:function(title,url,options){
		options=options||{};
		
		if(url===false) url=this.url(url,options.fullUrl);
		else if(!url) title=url=this.url(title,options.fullUrl);
		else if(url!=='#' && url[0]!=='?' && (S.isArray(url) || ((url.length < 11 || url.substr(0,11)!=='javascript:')
																		&& (url.length < 7 || url.substr(0,7)!=='mailto:'))))
				url=this.url(url,options.fullUrl);
		delete options.fullUrl;
		
		var a=Elt.create('a').html(title),current=false;
		
		if(options.current !== undefined){
			if(options.current===1) current=true;
			else if(options.current && url!==false && url !==this.baseurl) current=url.startsWith(window.location.pathname);
			else current=url===window.location.pathname;
			
			delete options.current;
		}
		
		if(options) a.attr(options);
		if(current) a.addClass('current');
		
		return a.attr('href',url);
	},
	
	/* Exemples :
	* S.html.url(['/:id-:slug',post.id,post.slug])
	* S.html.url('/site/login')
	* S.html.url(['/:id-:slug',post.id,post.slug,{'target':'_blank','?':'page=2'}])
	*/
	url:function(url,full){
		if(S.isStr(url) || !url){
			if(url) url=url.trim();
			if(!url || url==='/') return (full || '') + '/';
			else{
				if(S.sHas(url,'://')) return url;
				if(S.sStartsWith(url,'\\/')) return url.substr(1);
				if(url.substr(0,1)==='/') return (full || '') + this.router.getStringLink(url.substr(1));
			}
		}else{
			return (full || '') + this.router.getArrayLink(url);
		}
	}
}
