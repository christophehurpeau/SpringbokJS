((/* NODE||BROWSER */module.exports||S.behaviours.Child))=function(model,onEnd){
	/* DEV */ if(!model.parent) throw Error('missing parent conf '+model.modelName); /* /DEV */
	model.parent=M[model.parent];
	S.log(model.modelName+': initialize parent '+model.parent.modelName);
	model.parent.init(function(){
		S.log(model.modelName+': parent initialized');
		/* DEV */ if(!model.parent.types || !model.parent.types[model.modelName]) throw Error('missing parent type '+model.modelName+' in model '+model.parent); /* /DEV */
		
		//in case it's not already initialized
		model.db=model.parent.db;
		model.collection=model.parent.collection;
		model.beforeInsert.push(function(data,onEnd){ data._type=model.parent.types[model.modelName]; onEnd(); });
		model.beforeFind.push(function(query){ query.addCond('type',model.parent.types[model.modelName]); });
		
		model.beforeInsert.push.apply(model.beforeInsert,model.parent.beforeInsert);
		
		onEnd();
	});
};