var mongoose=require('mongoose');
S.Model=(function(){
	var Model=function(){};

	Model.prototype={
		
	};

	Model.create=function(modelName,options,schema,afterSchema,methods,staticMethods){
		options=S.extObj({'db':'default'},options);
		if(!S.isFunc(afterSchema)){ staticMethods=methods; methods=afterSchema; afterSchema=undefined; }
		schema.created={ type: Date, 'default': Date.now };
		schema=new mongoose.Schema(schema);
		afterSchema && afterSchema(schema);
		S.extObj(schema.methods,methods);
		if(options.indexes) options.indexes.forEach(function(i){ schema.index(i); })
		
		var model=S.Db.get(options.db).model(modelName,schema);
		staticMethods=staticMethods||{};
		staticMethods.__displayField=staticMethods.__displayField||(schema.title?'title':'name');
		staticMethods.Fields=staticMethods.Fields||{};
		S.extObj(model,staticMethods);
		return model;
	}

	var createF=function createF(Model){
		var f=function(){ return Model.create.apply(null,arguments); };
		f.Model=Model;
		f.extend=function(){
			var c=Model.extend.apply(Model,arguments);
			return createF(c);
		}
		return f;
	};
	return createF(Model);
})();
