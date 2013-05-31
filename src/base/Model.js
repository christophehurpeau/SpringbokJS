var mongodb=require('mongodb'); /* https://github.com/kissjs/node-mongoskin/blob/master/lib/mongoskin/collection.js */
S.Model=(function(){
	var Model=function(){},Find=function(model){ this.model=model; },QFind=function(model,H){ this.model=model; this.H=H; };
	
	QFind.prototype={
		fields:function(fields){ this._fields=fields; return this; },
	};
	
	var QFindOne=S.extClass(QFind,{
		fetch:function(callback){
			if(this.H){
				var truecallback=callback;
				callback=function(err,doc){ err!==null ? this.H.res.exception(HttpException.newInternalServerError(err)) : truecallback(doc); };
			}
			this._fields ? this.model.collection.findOne(this._query,this._fields,callback)
				: this.model.collection.findOne(this._query,callback) ;
			//todo : res.prototype=Model.prototype ou new Model ?
		},
		byId:function(id){ this._query={_id:id}; return this; },
		byIdNotNull:function(id,callback){ return this.byId(id).notNull(callback); },
		notNull:function(callback){ var t=this; this.fetch(function(doc){ doc===null ? t.H.res.notFound() : callback(doc); }); },
	});
	var QFindAll=S.extClass(QFind,{
		cursor:function(){ return this._fields ? this.model.collection.find(this._query,this._fields)
													: this.model.collection.find(this._query); },
		exec:function(callback){ callback(this.cursor()); },
		each:function(callback){ return this.cursor().each(callback); },
		fetch:function(callback){ return this.cursor().toArray(callback); }
	});
	
	
	Find.prototype={
		//get one(){ return new QFindOne(this.model,this.H) },
		one:function(H){ return new QFindOne(this.model,H) },
		docs:function(H){ return new QFindAll(this.model,H) }
		
		//byId:function(id,callback){ return this.one.byId(id).fetch(callback); },
		//byIdNotNull:function(id,callback){ return this.one.byId(id).notNull(callback); }
		//	return this.model.collection.findOne.apply(this.model.collection,arguments); }
	};
	
	
	var insert=function(model,data,options,callback){
		console.log(model.beforeInsert);
		UArray.forEachSeries(model.beforeInsert,function(c,onEnd){ c(data,onEnd); },
			function(err){
				if(err) return callback('beforeInsert failed');
				model.collection.insert(data,options,callback);
			});
	};
	
	Model.prototype={
		_insert:function(options,callback){
			var onEnd=insert.bind(null,this.self,this.data,options,callback);
			if(this.beforeInsert) this.beforeInsert(onEnd);
			else onEnd();
		},
		insertWait:function(callback){ this._insert({w:1},callback); },
		insertNoWait:function(callback){ this._insert({},callback); },
		updateWait:function(callback){ throw new Error; this.self.collection.update(this.data._id,{w:1},callback); },
		updateNoWait:function(callback){ throw new Error; this.self.collection.update(this.data._id,this.data,callback); },
	};

	Model.extend=function(modelName,classProps,protoProps){
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
	};
	
	Model.init=function(model,onEnd){
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
