var Validator = require('validator').Validator;

/* https://gist.github.com/752126 */

S.extProto(Validator,{
	validParams:function(){this.error=function(){ throw HttpException.notFound();};},
	error:function(msg){this._errors.push(msg);},
	getErrors:function(){return this._errors;},
	hasErrors:function(){return !!this._errors;}
});

var ParamValueValidator=S.newClass({
	ctor:function(validator,name,value){ this.validator=validator;this.name=name;this.val=value; },
	_error:function(key){ this.validator._error(this.name,key,this.value); }
});

var ParamValueStrValidator=ParamValueValidator.extend({
	notEmpty:function(){
		if(this.val==null || UString.isEmpty(this.val)) this._error('notEmpty');
		return this;
	}
});

var ParamValueModelValidator=ParamValueValidator.extend({
	required:function(){
		if(this.val==null) this._error('required');
		return this;
	},
	valid:function(){
		throw new Error('TODO');
		return this;
	}
});


var ParamValidator=S.newClass({
	ctor:function(req){ this.req=req; },
	_error:function(name,key,value){S.log(arguments);this._errors[name]={error:key,value:value};},
	
	str:function(name,num){ return new ParamValueStrValidator(this,name,this.req.sParam(name,num)); },
	int:function(name,num){ return new ParamValueIntValidator(this,name,this.req.sParam(name,num)); },
	model:function(modelName,name){ name=name||UString.lcFirst(modelName);
		var data=this.req.body[name]!==undefined ? this.req.body[name] : this.req.query[name];
		return new ParamValueModelValidator(this,name,!data?null:new M[modelName](data)); }
});

var ParamValidatorValid=ParamValidator.extend({
	_error:function(){ throw HttpException.notFound(); }
});


module.exports={
	requestMethods:{
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
	}
}
