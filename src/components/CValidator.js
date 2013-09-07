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
	valid:function(fieldsRequired){
		if(this.val==null) return this;
		if(S.isString(fieldsRequired)) fieldsRequired = fieldsRequired.split(' ');
		UObj.forEach(this.val.self.Fields,function(name,fModel){
			var val=this.val[name];
			if(fieldsRequired){
				if(UArray.has(fieldsRequired,name) && val==null) this._error('required');
			}else{
				if(val==null && fModel[1] && fModel[1].required) this._error('required');
			}
			//TODO ...
		}.bind(this));
		
		return this;
	}
});


var ParamValidator=S.newClass({
	ctor:function(req){ this.req=req; },
	_error:function(name,key,value){this._errors[name]={error:key,value:value};},
	
	str:function(name,num){ return new ParamValueStrValidator(this,name,this.req.sParam(name,num)); },
	int:function(name,num){ return new ParamValueIntValidator(this,name,this.req.sParam(name,num)); },
	model:function(modelName,name){ name=name||UString.lcFirst(modelName);
		console.log(modelName,M[modelName]);
		var data=this.req.getOrPostParam(name);
		return new ParamValueModelValidator(this,name,!data?null:new M[modelName](data)); }
});

var ParamValidatorValid=ParamValidator.extend({
	_error:function(){
		/*#if DEV*/ console.warn('Invalid params: ', arguments,"\nRoute=",this.req.route,"\nGET=",this.req.query,"\nBody=",this.req.body); /*#/if*/
		throw HttpException.notFound();
	}
});


module.exports={
	requestMethods:{
		sParam:function(name,num){
			var r=this.route;
			return r.nParams.get(name) || ( num && r.sParams[num-1] ) || this.query[name]; 
		},
		getOrPostParam:function(name){
			return this.body[name]!==undefined ? this.body[name] : this.query[name];
		},
		validator:function(){
			return new ParamValidator(this);
		},
		validParams:function(){
			return new ParamValidatorValid(this);
		}
	}
};
