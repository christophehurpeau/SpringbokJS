includeCore('elements/');
S.extProto(S.Helpers,{
	
	link:function(title,url,options){
		options=options||{};
		options.escape=true;
		return this.linkHtml(title,url,options);
	},
	linkHtml:function(title,url,options){
		options=options||{};
		
		if(url===false) url=this.url(url,/*#if NODE*/options.entry,/*#/if*/options);
		else if(!url) title=url=this.url(title,/*#if NODE*/options.entry,/*#/if*/options);
		else if(url!=='#' && url[0]!=='?'
					&& (S.isArray(url) || ((url.length < 11 || url.substr(0,11)!=='javascript:')
					&& (url.length < 7 || url.substr(0,7)!=='mailto:')))) url=this.url(url,/*#if NODE*/options.entry,/*#/if*/options);
		delete options.full;
		options.url = url;
		
		var a=$.create('a')[options.escape ? 'text' : 'html'](title),current=false;
		delete options.escape;
		
		if(options.current !== undefined){
			if(options.current===1) current=true;
			else if(options.current && url!==false && url !==this.baseUrl) current=url.startsWith(this.currentUrl());
			else current=url===this.currentUrl();
			
			delete options.current;
		}
		
		a.attrs(options);
		if(current) a.addClass('current');
		
		return a.attr('href',url);
	},
	
	/*#if NODE*/
	jsInline:function(content){
		return '<script type="text/javascript">//<![CDATA['+"\n"+content.trim()+"//]]>\n</script>";
	}
	/*#/if*/
});