includeCore('browser/db/S.Db');
includeCore('browser/base/S.store');

if( !window.indexedDB ){
	// shim to WebSQL : 
	S_loadSyncScript('compat/IndexedDBShim');
	
	
	/*if (!window.indexedDB)
		window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");*/
}

S.Db.LocalDbStore=S.newClass({
	ctor:function(model){
		this.model=model;
		this.db=model.db;/*db.db is not defined yet*/
	},
	store:function(mode){
		return this.db.db
			.transaction(this.model.modelName,mode||'readonly')
			.objectStore(this.model.modelName);
	},
	_beforeInsert:function(data){
		if(!data[this.model.keyPath])
			data[this.model.keyPath]=S.alphaNumber.html.encode(Date.now())+'-'+/*TODO : session id ? or something unique for this browser / client ?*/'0';
		return data;
	},
	insert:function(data,options,r){
		var request=this.store('readwrite').add(this._beforeInsert(data));
		request.onsuccess=function(event){
			console.log('successful insert',event);
			r.fire('success');
		};
		r.fire('started');
	},
	update:function(data,options,r){
		var request=this.store('readwrite').put(data);
		request.onsuccess=function(event){
			console.log('successful update',event);
			r.fire('success');
		};
		r.fire('started');
	},
	deleteByKey:function(key,options,r){
		var request=this.store('readwrite')['delete'](key);
		request.onsuccess=function(event){
			console.log('successful delete',event);
			r.fire('success');
		};
		r.fire('started');
	},
	findOne:function(query,options,r){
		if(query._id) return this.store().get(query._id).onsuccess = function(event){
				r.fire('success',event.target.result);
			};
		return this.cursor(function(cursor){
			r.fire('success',cursor ? cursor.value : null);
		});
	},
	cursor:function(query,options,callback){
		/*#if DEV*/ if(query) throw new Error('Query is not yet supported'); /*#/if*/
		this.store().openCursor(options.range || null, options.direction || "next")
			.onsuccess = function(event){
				callback(event.target.result);
			};
	},
	cursorIndex:function(indexName,options,callback){
		var store=this.store(), index = store.index(indexName);;
		index.openCursor(options.range || null, options.direction || "next").onsuccess = function(event) {
			callback(new S.Db.LocalDbStore.Cursor(event.target.result,this));
		};
	},
	byIndex:function(indexName,key,callback){
		this.store().index(indexName).get(key).onsuccess=function(event){
			callback(new S.Db.LocalDbStore.Cursor(event.target.result,this));
		};
	},
	
	toModel: function(result){
		return result && new this.model(result,'unchanged');
	}
},{
	Cursor: S.newClass({
		ctor: function(cursor,store){
			this._cursor = cursor;
			this._store = store;
			this.key = this._cursor.key;
			
			//because cursor in IndexedDB already contains the first result
			this.next = function(callback){
				delete this.next;
				callback(this.key);
			};
		},
		advance: function(count){
			this._cursor.advance(count);
			return this;
		},
		next: function(callback){
			this._cursor['continue']();
			this.key = this._cursor.key;
			callback(this.key);
		},
		result: function(callback){
			var r = new App.Model.Request;
			this._store.findByKey(this.key,{},r);
			r.success(callback).failed(callback.bind(null,undefined));
		},
		remove: function(callback){
			var r = new App.Model.Request;
			this._store.deleteByKey(this.primaryKey,r);
			return r;
		},
		forEachResults: function(callback,onEnd){
			var nbResults = 0,_callback = function _callback(){
				this.result(function(){
					if(!this.key){
						this.close();
						return onEnd && onEnd(nbResults);
					}
					callback.apply(null,arguments);
					nbResults++;
					this.next(_callback);
				}.bind(this));
			}.bind(this);
			_callback();
		},
		forEach: function(callback,onEnd){
			this.forEachResults(function(result){
				callback(this._store.toModel(result));
			}.bind(this),onEnd);
		},
		close: function(callback){
			this._cursor = this._store = this.key = undefined;
			callback && callback();
		}
	})
});

S.Db.LocalStore=window.indexedDB ? S.Db.LocalDbStore : S.Db.LocalDbStore.extend({
	store:null,
	insert:function(data,options,r){
		r.fire('started');
		data=this._beforeInsert(data);
		store.set(this.model.modelName+'___'+data[this.model.keyPath],data);
		r.fire('success');
	},
	deleteByKey:function(key,options,r){
		r.fire('started');
		store.remove(this.model.modelName+'___'+key);
		r.fire('success');
	},
	cursor:function(callback,range,direction){
		if(range||direction) throw new Error('range or direction is not supported');
		var prefix = this.model.modelName+'___';
		setTimeout(callback.bind(null,new S.Db.LocalDbStore.Cursor(S.store.iterator(), this, prefix)));
	},
	
	toModel: function(result){
		return result && new this.model(result,'unchanged');
	}
},{
	Cursor: S.newClass({
		ctor: function(iterator,store,prefix){
			this._iterator = iterator;
			this._store = store;
			this._prefix = prefix;
		},
		advance: function(count){
			while(count--) this.next();
			return this;
		},
		next: function(callback){
			this.key = this._result = undefined;
			while(this._iterator.hasNext()){
				//TODO : to Model
				var current = this._iterator.next();
				if(current[0].startsWith(prefix)){
					this._result = current[1];
					this.key = current[1][this._store.model.keyPath];
					return callback(this.key);
				}
			}
			callback();
		},
		result: function(callback){
			callback(this._result);
		},
		model: function(callback){
			throw new Error('TODO : result to object');
		},
		remove: function(callback){
			var r = new App.Model.Request;
			this._store.deleteByKey(this.key,r);
			return r;
		},
		forEachResults: function(callback,onEnd){
			var nbResults = 0;
			this._results.forEach(onEnd ? function(result){ nbResults++; callback.call(null,result); } : callback); //TODO to Model
			this.close();
			onEnd && onEnd(nbResults);
		},
		forEach: function(callback,onEnd){
			this.forEachResults(function(result){
				callback(this._store.toModel(result));
			}.bind(this),onEnd);
		},
		close: function(callback){
			this._iterator = this._store = this._prefix = undefined;
			callback && callback();
		}
	})
});