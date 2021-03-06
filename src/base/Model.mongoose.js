var mongoose=require('mongoose');
S.Model=(function(){
	var Model=function(){};

	Model.prototype={
		
	};

	Model.create=function(modelName,options,schema,afterSchema,methods,staticMethods){
		options=UObj.extend({'db':'default'},options);
		if(!S.isFunc(afterSchema)){ staticMethods=methods; methods=afterSchema; afterSchema=undefined; }
		schema.created={ type: Date, 'default': Date.now };
		mongooseSchema=new mongoose.Schema(schema);
		afterSchema && afterSchema(mongooseSchema);
		UObj.extend(mongooseSchema.methods,methods);
		if(options.indexes) options.indexes.forEach(function(i){ schema.index(i); })
		
		var model=S.Db.get(options.db).model(modelName,mongooseSchema);
		staticMethods=staticMethods||{};
		staticMethods.__displayField=staticMethods.__displayField||(schema.title?'title':'name');
		staticMethods.Fields=staticMethods.Fields||{};
		UObj.extend(model,staticMethods);
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
