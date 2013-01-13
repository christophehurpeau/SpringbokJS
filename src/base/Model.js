var mongoose = require('mongoose'),
	async=require('async'),
	config;

S.extProto(mongoose.Schema,{
});


var Model=function(){}


Model.create=function(modelName,options,schema,methods,staticMethods){
	options=S.extObj({'db':'default'},options);
	schema.created={ type: Date, 'default': Date.now };
	schema=new mongoose.Schema(schema);
	S.extObj(schema.methods,methods);
	if(options.indexes) options.indexes.forEach(function(i){ schema.index(i); })
	
	var model=S.Db.get(options.db).model(modelName,schema);
	staticMethods=staticMethods||{};
	staticMethods.__displayField=staticMethods.__displayField||'name';
	staticMethods.Fields=staticMethods.Fields||{};
	S.extObj(model,staticMethods);
	return model;
}



module.exports = (function(){
	var createF=function createF(Model){
		var f=function(modelName,options,schema,methods){ return Model.create(modelName,options,schema,methods); };
		f.Model=Model;
		f.extend=function(){
			var c=Model.extend.apply(Model,arguments);
			return createF(c);
		}
		return f;
	};
	return createF(Model);
})();
