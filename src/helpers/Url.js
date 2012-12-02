module.exports={
	staticUrl:function(url,folder){
		if(!url) url=WEB_URL+(folder?folder+'/':'');
		if(url.indexOf('://')!==-1) return S.escapeUrl(url);
		if(url.substr(0,2)==='\/') url=url.substr(1);
		else if(url.charAt(0)==='/') url=WEB_URL+(folder?folder+'/':'')+url.substr(1);
		return S.escapeUrl(url);
	}
}
