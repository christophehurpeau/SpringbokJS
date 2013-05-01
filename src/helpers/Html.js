includeCore('elements/');
S.extProto(S.Helpers,{
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
	metaLanguage:function(){
		var lang='en';
		return '<meta name="language" content="'+lang+'"/><meta http-equiv="content-language" content="'+lang+'"/>';
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
		else if(url!=='#' && url[0]!=='?'
					&& (S.isArray(url) || ((url.length < 11 || url.substr(0,11)!=='javascript:')
					&& (url.length < 7 || url.substr(0,7)!=='mailto:')))) url=this.url(url,options.fullUrl);
		delete options.fullUrl;
		
		var a=S.createElt('a').html(title),current=false;
		
		if(options.current !== undefined){
			if(options.current===1) current=true;
			else if(options.current && url!==false && url !==this.baseurl) current=url.startsWith(this.currentUrl);
			else current=url===this.currentUrl;
			
			delete options.current;
		}
		
		if(options) a.attrs(options);
		if(current) a.addClass('current');
		
		return a.attr('href',url);
	},
	
	/* Exemples :
	* S.html.url(['/:id-:slug',post.id,post.slug])
	* S.html.url('/site/login')
	* S.html.url(['/:id-:slug',post.id,post.slug,{'target':'_blank','?':'page=2'}])
	* 
	* 
	* 
		if($entry===null){
			$entry=Springbok::$scriptname;
			if($full===true) $full=Config::$siteUrl[$entry];
		}elseif(($entry!==Springbok::$scriptname && $full===null) || $full===true) $full=Config::$siteUrl[$entry];
		if(is_array($url)){
			$url=(!$full?'':($full===true?FULL_BASE_URL:$full)).BASE_URL.CRoute::getArrayLink($entry,$url);
			$escape=false;
		}else{
			if(empty($url) || $url==='/') $url=($full===false?'':($full===true?FULL_BASE_URL:$full)).BASE_URL/* DEV *\/.CRoute::$_prefix/* /DEV *\/.'/';
			else{
				if(strpos($url,'://')>0) return $url;
				if(substr($url,0,2)==='\/') $url=($full===false?'':($full===true?FULL_BASE_URL:$full)).substr($url,1);
				elseif($url[0]==='/'){$url=substr($url,1); $url=($full===false?'':($full===true?FULL_BASE_URL:$full)).BASE_URL.CRoute::getStringLink($entry,$url);}
			}
		}
		return $escape?h($url,false):$url;
	*/
	url:function(url,entry,full){
		/* DEV */ if(entry===false || entry===true) throw new Error('Entry param cannot be false or true'); /* /DEV */
		if(entry==null){
			entry=this.req.entry;
			full=(/* DEV||PROD */'/~'+entry||full===true ? Config.siteUrl[entry] : '');
		}else if((entry !== this.req.entry && full!==false) || full===true) full=(/* DEV||PROD */'/~'+entry||Config.siteUrl[entry]);
		else full=(/* DEV||PROD */'/~'+entry||'');
		
		if(S.isStr(url) || !url){
			if(url) url=url.trim();
			if(!url || url==='/') return full+ '/';
			else{
				if(url.contains('://')) return url;
				if(url.startsWith('\\/')) return url.substr(1);
				if(url.substr(0,1)==='/') return full + this.router.getStringLink(this.req.lang,entry,url.substr(1));
			}
		}else{
			return (full || '') + this.router.getArrayLink(this.req.lang,entry,url);
		}
	},
	urlEscape:function(url,entry,full){
		return S.escapeUrl(this.url(url,entry,full));
	},
	
	
	
	
	jsInline:function(content){
		return '<script type="text/javascript">//<![CDATA['+"\n"+content.trim()+"//]]>\n</script>";
	}
});