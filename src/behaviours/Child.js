/*#ifelse NODE*/(module.exports||S.behaviours.Child)/*#/if*/=function(model,onEnd){
	/*#if DEV*/ if(!model.parent) throw Error('missing parent conf '+model.modelName); /*#/if*/
	S.defineProperty(model,'Parent',M[model.parent]);
	S.log(model.modelName+': initialize parent '+model.parent.modelName);
	model.Parent.init(function(){
		S.log(model.modelName+': parent initialized');
		/*#if DEV*/ if(!model.Parent.types || !model.Parent.types[model.modelName]) throw Error('missing parent type '+model.modelName+' in model '+model.parent); /*#/if*/
		
		//in case it's not already initialized
		S.defineProperties(model,{
			db: model.Parent.db,
			store: model.Parent.store,
			collection: model.Parent.collection
		});
		model.beforeInsert.push(function(data,onEnd){ data._type=model.Parent.types[model.modelName]; onEnd(); });
		model.beforeFind.push(function(query){ query.addCond('type',model.Parent.types[model.modelName]); });
		
		model.beforeInsert.push.apply(model.beforeInsert,model.parent.beforeInsert);
		
		onEnd();
	});
};