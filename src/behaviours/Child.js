((/* NODE||BROWSER */module.exports||S.behaviours.Child))=function(model){
	/* DEV */ if(!model.parent) throw Error('missing parent conf '+model.modelName); /* /DEV */
	model.parent=M[model.parent];
	model.parent.init(); //in case it's not already initialized
	model.db=model.parent.db;
	model.collection=model.parent.collection;
	model.prototype.beforeInsert.push(function(){ this.data._type=model.parent.types[model.modelName]; });
	(model.beforeFind=model.beforeFind||[]).push(function(query){ query.addCondition('type',model.parent.types[model.modelName]); });
};