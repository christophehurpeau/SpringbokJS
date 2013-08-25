var http=require('http');
/*#if DEV*/
//breaks if incompatible!
'notFound exception text json sendText'.split(' ').forEach(function(methodName){
	if(http.ServerResponse.prototype[methodName]) throw new Error('http.ServerResponse.prototype.'+methodName+' already exists !');
});
/*#/if*/
S.extProto(http.ServerResponse,{
	notFound:function(){ this.exception(HttpException.notFound()); },
	exception:function(err){
		if(err instanceof HttpException){
		}else{
			/*#if DEV*/console.log(err.stack);/*#/if*/
			err=HttpException.newInternalServerError(/*if DEV then err.stack*/);
		}
		this.statusCode=err.code;
		this.end('<pre>'+err.details+'</pre>');
	},
	
	text:function(text){
		//res.statusCode=200;
		this.writeHead(200, { 'Content-Type': 'text/plain', 'Content-Length': text.length });
		this.end(text);
	},
	
	json:function(json){
		this.writeHead(200, { 'Content-Type': 'application/json' });
		this.end(json);
	},
	
	sendText:function(content,filename){
		this.writeHead(200, { 'Content-Type': 'text/plain', 'Accept-Ranges': 'none',
				'Content-Length': content.length, 'Content-Disposition': 'attachment; filename='+filename });
		this.end(content);
	}
});