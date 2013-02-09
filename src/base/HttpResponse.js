var http=require('http');
S.extProto(http.ServerResponse,{
	notFound:function(){ this.exception(HttpException.notFound()); },
	exception:function(err){
		if(err instanceof HttpException){
		}else{
			/* DEV */console.log(err.stack);/* /DEV */
			err=HttpException.newInternalServerError(/* DEV */err.stack/* /DEV */);
		}
		this.statusCode=err.code;
		this.end('<pre>'+err.details+'</pre>');
	}
});