var http=require('http');
S.extProto(http.IncomingMessage,{
	lang:'en',//TODO lang
	isIElt8:function(){
		var ua=this.headers['user-agent'],m;
		return ua && (m=ua.match(/MSIE ([\d\.]+)/i)) && m[1]<8;
	},
	
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