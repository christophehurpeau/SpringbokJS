var app=require('../app.js'),
	http = require('http'),
	Validator = require('validator').Validator;

/* https://gist.github.com/752126 */

S.extProto(Validator,{
	validParams:function(){this.error=function(){ throw HttpException.notFound();};},
	error:function(msg){this._errors.push(msg);},
	getErrors:function(){return this._errors;},
	hasErrors:function(){return !!this._errors;}
});

var ParamValidator=function(req){ this.req=req; },
	ParamValueValidator=function(validator,name,value){ this.validator=validator;this.name=name;this.val=value; };

ParamValueValidator.prototype={
	_error:function(key){ this.validator._error(this.name,key,this.value); }
};

var ParamValueStrValidator=S.extClass(ParamValueValidator,{
	notEmpty:function(){
		if(this.val==null || UString.isEmpty(this.val)) this._error('notEmpty');
		return this;
	}
});

var ParamValueModelValidator=S.extClass(ParamValueValidator,{
	required:function(){
		if(this.val==null) this._error('required');
		return this;
	},
	valid:function(){
		throw new Error('TODO');
		return this;
	}
});

ParamValidator.prototype={
	_error:function(name,key,value){S.log(arguments);this._errors[name]={error:key,value:value};},
	
	str:function(name,num){ return new ParamValueStrValidator(this,name,this.req.sParam(name,num)); },
	int:function(name,num){ return new ParamValueIntValidator(this,name,this.req.sParam(name,num)); },
	model:function(modelName,name){ name=name||UString.lcFirst(modelName);
		var data=this.req.body[name]!==undefined ? this.req.body[name] : this.req.query[name];
		return new ParamValueModelValidator(this,name,!data?null:new M[modelName](data)); }
};

var ParamValidatorValid=S.extClass(ParamValidator,{
	_error:function(){ throw HttpException.notFound(); }
});


S.extProto(http.IncomingMessage,{
	sParam:function(name,num){
		var r=this.route;
		return r.nParams[name] || ( num && r.sParams[num-1] ) || this.query[name]; 
	},
	validator:function(){
		return new ParamValidator(this);
	},
	validParams:function(){
		return new ParamValidatorValid(this);
	}
});

module.exports=Validator;