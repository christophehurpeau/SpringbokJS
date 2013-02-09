global.HttpException=function(code,error,details){
	this.code=code;
	this.error=error;
	this.details=details;
};
HttpException.prototype={
	getCode:function(){return this.code;},
	getError:function(){return this.error;},
	getDetails:function(){return this.details;}
};
HttpException.newInternalServerError=function(details){ return new HttpException(500,'Internal Server Error',details); };
HttpException.notFound=function(){ return new HttpException(404,'Not Found'); };
HttpException.internalServerError=function(details){ throw HttpException.newInternalServerError(details); };