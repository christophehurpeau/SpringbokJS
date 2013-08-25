/*#if NODE*/
var mongodb=require('mongodb'); /* https://github.com/kissjs/node-mongoskin/blob/master/lib/mongoskin/collection.js */
/*#else*/
includeCore('browser/base/S.Watcher');
/*#/if*/

App.Model=(function(){
	/*#if NODE*/var Request=/*#/if*/
	includeCore('base/Model.Request');
	
	/*#if NODE*/var Find=/*#/if*/
	includeCore('base/Model.Find');
	
	var _call=function(fn,data,options){
		/*#if BROWSER*/ this.listen(); /*#/if*/
		var model=this,Model=this.self,request=new Request.Model(model);
		UArray.forEachSeries(Model['before'+UString.ucFirst(fn)],
			function(c,onEnd){ c(data,onEnd); },
			function(err){
				if(err) return request.fire('failed');
				//setTimeout(function(){  }); // return request before !
				Model.store[fn](data,options,request);
			});
		return request;
	},Model=/*#ifelse NODE*/(S.newClass||S.Watcher.extend)/*#/if*/({
		// STATES: 'new', 'unchanged', 'saved', 'unsaved' (retrieved/inserted into db then modified), 'pending'
		// EVENTS: 'request.started','request.success', 'synced'
		ctor:function(data,state){
			/*#if BROWSER*/S.Watcher.call(this);/*#/if*/
			this.data=data||{};
			this.state=state||'new';
		},
		configurable:{
			/*#if BROWSER*/
			listen:function(){
				Object.defineProperty(this,'listen',{ value:function(){} });
				var hasSyncEvent=this.self.store.hasSyncEvent;
				this.on('request.started',function(){
					S.log('request.started');
					this.state='pending';
					this.nodes.forEach(function(node){
						node.first('.state').html('<img src="/web/sync-14.gif"/>');
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
			/*#/if*/
			id:function(){
				return this.data[this.self.keyPath];
			},
			name:function(){
				return this.data.name;
			},
			_render:function(wrapper){
				wrapper.text(this.name());
			}
		},
		
		insert:function(options){
			return _call.call(this,'insert',this.data,options);
		},
		update:function(options){
			return _call.call(this,'update',this.data,options);
		},
		remove:function(options){
			/*#if NODE*/
				return _call.call(this,'remove',{_id:this._id},options);
			/*#else*/
				return _call.call(this,'deleteByKey',this.data[this.self.keyPath],options);
			/*#/if*/
		},
		/*#if NODE*/
		insertWait:function(callback){ this.insert({w:1}).success(callback); },
		insertNoWait:function(callback){ this.insert({}).success(callback); },
		updateWait:function(callback){ this.update({w:1}).success(callback); },
		updateNoWait:function(callback){ this.update({}).success(callback); },
		/*#/if*/
		
		
		
		/*#if NODE*/
		// same as S.Watcher
		toLi:function(){
			return this.render($.li());
		},
		
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
		
		toString:function(){
			return '[Model: '+this.self.modelName+']'+' data = '+JSON.stringify(this.data)+', state = '+this.state;
		},
	},{
		Request: Request,
		extend:function(modelName,classProps,protoProps){
			classProps.modelName=modelName;
			
			/* */
			'beforeInsert,beforeUpdate,beforeFind'.split(',').forEach(function(cName){
				if(!classProps[cName]) classProps[cName]=[];
			});
			
			var newModel=S.extClass(this,protoProps,classProps);
			newModel.init=Model.init.bind(null,newModel);
			newModel.find=new Find(newModel);
			newModel.keyPath=newModel.keyPath||'_id';
			newModel.toString=function(){ return 'Model class '+newModel.modelName; };
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
				else S.Db.get(model.dbName || (model.dbName='default')).add(model,onEnd);
			});
		}
	});
	
	var createF=function createF(Model){
		var f=function(modelName,classProps,protoProps){ return Model.extend(modelName,classProps,protoProps); };
		f.Model=Model;
		f.extend=function(){
			var c=S.extClass.apply(Model,arguments);
			return createF(c);
		};
		return f;
	};
	return createF(Model);
})();
