var mongodb=require('mongodb');
S.Model=(function(){
	var Model=function(){};

	Model.prototype={
		insert:function(callback){ this.self.collection.insert(this.data,{w:1},callback); },
		insertAsync:function(callback){ this.self.collection.insert(this.data); },
		update:function(callback){ this.self.collection.update(this.data._id,{w:1},callback); },
		updateAsync:function(callback){ this.self.collection.update(this.data._id,this.data); },
	};

	Model.extend=function(modelName,classProps,protoProps){
		classProps.modelName=modelName;
		protoProps.ctor=function(data){ this.data=data; /*S.extObj(this,data);*/ };
		var newModel=S.extClass(this,protoProps,classProps);
		newModel.init=function(){ Model.init(newModel); };
		return newModel;
	};
	
	Model.init=function(model){
		// model can be inited manually then init is recalled. OR db + collection can be set by a behaviour
		if(model.isInitialized) return;
		model.isInitialized=true;
		
		model.behaviours && model.behaviours.forEach(function(behaviour){
			/* NODE */
			if(!App.behaviours[behaviour]) App.behaviours[behaviour]=require('../behaviours/'+behaviour);
			App.behaviours[behaviour](model);
			/* /NODE */
			/* BROWSER */behaviour(model);/* /BROWSER */
		});
		
		model.displayField=model.displayField||(model.Fields.title?'title':'name');
		if(!model.db){
			model.db=S.Db.get(model.dbName=model.dbName||'default');
			model.db.createCollection(model.modelName,{w:1},function(err,collection){
				if(err) console.error('ERROR:'+err);
				model.collection=collection;
			});
		}
	};

	var createF=function createF(Model){
		var f=function(modelName,classProps,protoProps){ return Model.extend(modelName,classProps,protoProps); };
		f.Model=Model;
		f.extend=function(){
			var c=S.extClass.apply(Model,arguments);
			return createF(c);
		}
		return f;
	};
	return createF(Model);
})();
