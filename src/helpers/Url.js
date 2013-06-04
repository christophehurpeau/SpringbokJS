S.extProto(S.Helpers,{
	staticUrl:function(url){
		if(!url) url=WEB_URL;
		if(url.indexOf('://')!==-1) return S.escapeUrl(url);
		if(url.substr(0,2)==='\/') url=url.substr(1);
		else if(url.charAt(0)==='/') url=WEB_URL+url.substr(1)/*#if DEV*/+'?'+Date.now()/*#/if*/;
		return S.escapeUrl(url);
	}
});
