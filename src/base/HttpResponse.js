var http=require('http');
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
	}
});