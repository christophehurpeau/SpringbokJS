/*#if NODE*/
var mongodb=require('mongodb'); /* https://github.com/kissjs/node-mongoskin/blob/master/lib/mongoskin/collection.js */
/*#/if*/

App.Model=(function(){
	/*#if NODE*/var Find=/*#/if*/
	includeCore('base/Model.Find');
	
	var insert=function(model,data,options,callback){
		UArray.forEachSeries(model.beforeInsert,
			function(c,onEnd){ c(data,onEnd); },
			function(err){
				if(err) return callback('beforeInsert failed');
				model.collection.insert(data,options,callback);
			});
	};
	
	var Model=S.newClass({
		_insert:function(options,callback){
			var onEnd=insert.bind(null,this.self,this.data,options,callback.bind(this));
			if(this.beforeInsert) this.beforeInsert(onEnd);
			else onEnd();
		},
		insertWait:function(callback){ this._insert({w:1},callback); },
		insertNoWait:function(callback){ this._insert({},callback); },
		updateWait:function(callback){ throw new Error; this.self.collection.update(this.data._id,{w:1},callback); },
		updateNoWait:function(callback){ throw new Error; this.self.collection.update(this.data._id,this.data,callback); },
		
	},{
		extend:function(modelName,classProps,protoProps){
			classProps.modelName=modelName;
			protoProps.ctor=function(data){ this.data=data; /*UObj.extend(this,data);*/ };
			
			/* */
			'beforeInsert,beforeUpdate,beforeFind'.split(',').forEach(function(cName){
				if(!classProps[cName]) classProps[cName]=[];
			})
			
			var newModel=S.extClass(this,protoProps,classProps);
			newModel.init=function(onEnd){ Model.init(newModel,onEnd); };
			newModel.find=new Find(newModel);
			return newModel;
		},
		init:function(model,onEnd){
			// model can be inited manually then init is recalled. OR db + collection can be set by a behaviour
			if(model._initialized) return onEnd();
			model._initialized=true;
			
			UArray.forEachSeries(model.behaviours,function(behaviour,onEnd){
				S.log(model.modelName+' [behaviour] : '+behaviour);
				/*var prevOnEnd=onEnd;
				onEnd=function(){
					console.log(model.modelName+' [behaviour] : '+behaviour+' ended');
					prevOnEnd.apply(null,arguments);
				};*/
				
				/*#if NODE*/
				if(!App.behaviours[behaviour]) App.behaviours[behaviour]=require('../behaviours/'+behaviour);
				App.behaviours[behaviour](model,onEnd);
				/*#else*/behaviour(model,onEnd);/*#/if*/
			},function(err){
				//S.log(model.modelName+' end foreach behaviours');
				if(err){ console.err(err); throw new Error(err); }
				model.displayField=model.displayField||(model.Fields.title?'title':'name');
				//S.log(model.modelName+' displayField='+model.displayField);
				if(model.db) onEnd();
				else{
					model.db=S.Db.get(model.dbName=model.dbName||'default');
					//S.log(model.modelName+' dbName='+model.dbName);
					model.db.collection(model.modelName,{w:1},function(err,collection){
						if(err) return onEnd(err);
						model.collection=collection;
						onEnd();
					});
				}
			});
		}
	});
	
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
