/*#if NODE*/
var mongodb=require('mongodb'); /* https://github.com/kissjs/node-mongoskin/blob/master/lib/mongoskin/collection.js */
/*#/if*/

App.Model=(function(){
	/*#if NODE*/var Find=/*#/if*/
	includeCore('base/Model.Find');
	
	/*#if NODE*/var Request=/*#/if*/
	includeCore('base/Model.Request');
	
	var _call=function(fn,options){
		this.listen();
		var model=this,Model=this.self,data=this.data,request=new Request(model);
		UArray.forEachSeries(Model['before'+UString.ucFirst(fn)], //TODO optimiser : à sortir de la function
			function(c,onEnd){ c(data,onEnd); },
			function(err){
				if(err) return request.fire('failed');
				Model.store[fn](data,options,request);
			});
		return request;
	},Model=/*#ifelse NODE*/(S.newClass||S.Listenable.extend)/*#/if*/({
		// STATES: 'new', 'unchanged', 'saved', 'unsaved' (retrieved/inserted into db then modified), 'pending'
		// EVENTS: 'inserted', 'updated', 'synced'
		ctor:function(data,state){
			S.Listenable.call(this);
			this.data=data||{};
			/*#if BROWSER*/this.nodes=[];/*#/if*/
			this.state=state||'new';
		},
		configurable:{
			listen:function(){
				Object.defineProperty(this,'listen',{ value:function(){} });
				var hasSyncEvent=this.self.store.hasSyncEvent;
				this.on('request.started',function(){
					S.log('request.started');
					this.state='pending';
					this.nodes.forEach(function(node){
						node.first('.state').html('<img src="/web/sync-14.gif"/>')
					});
				}.bind(this));
				this.on('request.success',function(){
					S.log('request.success');
					if(this.state==='pending') this.state='saved'; //the state could change to 'unsaved' for instance.
					this.nodes.forEach(function(node){
						var state=node.first('.state');
						hasSyncEvent ? state.html('<img src="/web/sync-server.gif"/>') : state.empty();
					});
				}.bind(this));
				
				if(hasSyncEvent){
					this.on('synced',function(){
					S.log('synced');
						this.nodes.forEach(function(node){
							node.first('.state').empty();//TODO : gérer les cas où state !== sync-server.
						});
					}.bind(this));
				}
			},
			
			id:function(){
				return this.data[this.keyPath];
			},
			name:function(){
				return this.data.name;
			},
			_render:function(wrapper){
				wrapper.text(this.name());
			}
		},
		
		insert:function(options){
			return _call.call(this,'insert',options);
		},
		update:function(options,callback){
			return _call.call(this,'update',options);
		},
		remove:function(options,callback){
			return _call.call(this,'remove',options);
		},
		/*#if NODE*/
		insertWait:function(callback){ this.insert({w:1},callback); },
		insertNoWait:function(callback){ this.insert({},callback); },
		updateWait:function(callback){ throw new Error; this.self.collection.update(this.data._id,{w:1},callback); },
		updateNoWait:function(callback){ throw new Error; this.self.collection.update(this.data._id,this.data,callback); },
		/*#/if*/
		
		
		
		toLi:function(){
			return this.render($.li());
		},
		
		/*#if BROWSER*/
		render:function(wrapper){
			this._render(wrapper);
			wrapper.on('dispose',function(){
				UArray.remove(this.nodes,wrapper);
			}.bind(this));
			this.nodes.push(wrapper);
			return wrapper;
		},
		rerender:function(){
			this.nodes.forEach(function(node){
				this._render(node);
			});
		},
		/*#else*/
		render:function(wrapper){
			this._render(wrapper);
			return wrapper;
		},
		/*#/if*/
		
		get:function(name){ return this.data[name]; },
		set:function(name,value){
			if(this.data[name]!==value){
				this.data[name]=value;
				this.state='unsaved';
			}
		},
		mset:function(values){ values.forEach(this.set.bind(this)); },
		forEach:function(fn){ this.data.forEach(fn); return this; },
		
	},{
		extend:function(modelName,classProps,protoProps){
			classProps.modelName=modelName;
			
			/* */
			'beforeInsert,beforeUpdate,beforeFind'.split(',').forEach(function(cName){
				if(!classProps[cName]) classProps[cName]=[];
			})
			
			var newModel=S.extClass(this,protoProps,classProps);
			newModel.init=function(onEnd){ Model.init(newModel,onEnd); };
			newModel.find=new Find(newModel);
			/*#if NODE*/
			newModel.store=function(callback){
				return callback(this.collection);
			}
			/*#/if*/
			newModel.keyPath=newModel.keyPath||'_id';
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
