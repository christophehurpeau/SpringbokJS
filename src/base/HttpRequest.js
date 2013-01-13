var http=require('http');
S.extProto(http.IncomingMessage,{
	lang:'en',//TODO lang
	isIElt8:function(){
		var ua=this.headers['user-agent'],m;
		return ua && (m=ua.match(/MSIE ([\d\.]+)/i)) && m[1]<8;
	},
	
	
	/* utils */
	notFoundIfFalse:function(o){
		if(o===false) HttpException.notFound();
	}
});