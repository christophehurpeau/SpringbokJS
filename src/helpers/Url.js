S.extProto(S.Helpers,{
	staticUrl:function(url){
		if(!url) url=WEB_URL;
		if(url.indexOf('://')!==-1) return S.escapeUrl(url);
		if(url.substr(0,2)==='\/') url=url.substr(1);
		else if(url.charAt(0)==='/') url=WEB_URL+url.substr(1)/*#if DEV*/+'?'+Date.now()/*#/if*/;
		return S.escapeUrl(url);
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
			if(empty($url) || $url==='/') $url=($full===false?'':($full===true?FULL_BASE_URL:$full)).BASE_URL/*#if DEV *\/.CRoute::$_prefix/*#/if*\/.'/';
			else{
				if(strpos($url,'://')>0) return $url;
				if(substr($url,0,2)==='\/') $url=($full===false?'':($full===true?FULL_BASE_URL:$full)).substr($url,1);
				elseif($url[0]==='/'){$url=substr($url,1); $url=($full===false?'':($full===true?FULL_BASE_URL:$full)).BASE_URL.CRoute::getStringLink($entry,$url);}
			}
		}
		return $escape?h($url,false):$url;
	*/
	url:function(url,/*#if NODE*/entry,/*#/if*/options){
		if(!S.isObj(options)) options={full:options};
		/*#if NODE*/
		/*#if DEV*/ if(entry===false || entry===true) throw new Error('Entry param cannot be false or true'); /*#/if*/
		if(entry==null){
			entry=this.req.entry;
			options.full=/*#ifelse DEV */('/~'+entry||options.full===true ? Config.siteUrl[entry] : '')/*#/if*/;
		}else if((entry !== this.req.entry && options.full!==false) || options.full===true) options.full=/*#ifelse DEV */('/~'+entry||Config.siteUrl[entry])/*#/if*/;
		else options.full=/*#ifelse DEV */('/~'+entry||'')/*#/if*/;
		/*#else*/
		options.full='';
		/*#/if*/
		
		if(S.isString(url) || !url){
			if(url) url=url.trim();
			if(!url || url==='/') return options.full+ '/';
			else{
				if(url.contains('://')) return url;
				if(url.startsWith('\\/')) return url.substr(1);
				if(url.charAt(0)==='/') return options.full + this.router.getStringLink(this.req.lang,/*#if NODE*/entry,/*#/if*/url.substr(1));
			}
		}else{
			return (full || '') + this.router.getArrayLink(this.req.lang,/*#if NODE*/entry,/*#/if*/url);
		}
	},
	urlEscape:function(url,/*#if NODE*/entry,/*#/if*/options){
		return S.escapeUrl(this.url(url,/*#if NODE*/entry,/*#/if*/options));
	},
	
});
