var http=require('http');
S.extProto(http.IncomingMessage,{
	lang:'en',//TODO lang
	
	ieVersion:function(){
		if(this.ieVersion !== undefined) return this.ieVersion;
		var ua=this.headers['user-agent'],m;
		if(!ua || !(m=ua.match(/MSIE ([\d\.]+)/i))) return this.ieVersion=false;
		return this.ieVersion=m[1];
	},
	isIElt8:function(){ return this.ieVersion()<8; },
	isIElt9:function(){ return this.ieVersion()<9; },
	
	accepts:function(type){
		var accept=this.headers.accept;
		if(!accept) return false;
		var acceptTypes=accept.split(',');
		acceptTypes.forEach(function(acceptType,k){
			if(acceptType.contains(';'))
				acceptTypes[k]=accept.split(';',1)[0];
		});
		return S.isStr(type) ? UArray.has(acceptTypes,type) : UArray.hasAmong(acceptTypes,type)
	}
});