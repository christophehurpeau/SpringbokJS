var mongodb=require('mongodb');
S.Model=(function(){
	var Model=function(){},Find=function(model){ this.model=model; };
	
	Find.prototype={
		byId:function(id){ arguments[0]={_id:arguments[0]};
			return this.model.collection.findOne.apply(this.model.collection,arguments); }
	};
	
	Model.prototype={
		insert:function(callback){ this.self.collection.insert(this.data,{w:1},callback); },
		insertAsync:function(callback){ this.self.collection.insert(this.data); },
		update:function(callback){ this.self.collection.update(this.data._id,{w:1},callback); },
		updateAsync:function(callback){ this.self.collection.update(this.data._id,this.data); },
	};

	Model.extend=function(modelName,classProps,protoProps){
		classProps.modelName=modelName;
		protoProps.ctor=function(data){ this.data=data; /*S.extObj(this,data);*/ };
		
		/* */
		protoProps.beforeInsert=protoProps.beforeInsert||[];
		classProps.beforeFind=classProps.beforeFind||[];
		
		var newModel=S.extClass(this,protoProps,classProps);
		newModel.init=function(onEnd){ Model.init(newModel,onEnd); };
		newModel.find=new Find(newModel);
		return newModel;
	};
	
	Model.init=function(model,onEnd){
		// model can be inited manually then init is recalled. OR db + collection can be set by a behaviour
		if(model._initialized) return onEnd();
		model._initialized=true;
		
		S.asyncForEach(model.behaviour,function(behaviour,onEnd){
			console.log(model.modelName+' [behaviour] : '+behaviour)
			/* NODE */
			if(!App.behaviours[behaviour]) App.behaviours[behaviour]=require('../behaviours/'+behaviour);
			App.behaviours[behaviour](model);
			/* /NODE */
			/* BROWSER */behaviour(model);/* /BROWSER */
		},function(){
			model.displayField=model.displayField||(model.Fields.title?'title':'name');
			if(!model.db){
				model.db=S.Db.get(model.dbName=model.dbName||'default');
				model.db.createCollection(model.modelName,{w:1},function(err,collection){
					if(err) return onEnd(err);
					model.collection=collection;
					onEnd();
				});
			}
		});
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
