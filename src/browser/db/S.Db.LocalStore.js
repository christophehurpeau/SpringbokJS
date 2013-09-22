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
	findByKey:function(key,options,r){
		return this.store().get(key).onsuccess = function(event){
			console.log('findByKey success',event);
			r.fire('success',event.target.result);
		};
	},
	findOne:function(query,options,r){
		if(query[this.model.keyPath]) return this.findByKey(query[this.model.keyPath],options,r);
		return this.cursor(function(cursor){
			r.fire('success',cursor ? cursor.value : null);
		});
	},
	cursor:function(callback,query,options){
		/*#if DEV*/ if(query && Object.keys(query).length) throw new Error('Query is not yet supported'); /*#/if*/
		if(!options) options = {};
		this.store().openCursor(options.range || null, options.direction || "next")
			.onsuccess = function(event){
				callback(new S.Db.LocalDbStore.Cursor(event.target.result,this));
			}.bind(this);
	},
	cursorIndex:function(indexName,callback,query,options){
		var store=this.store(), index = store.index(indexName);;
		if(!options) options = {};
		index.openCursor(options.range || null, options.direction || "next").onsuccess = function(event) {
			callback(new S.Db.LocalDbStore.Cursor(event.target.result,this));
		}.bind(this);
	},
	byIndex:function(indexName,key,callback){
		this.store().index(indexName).get(key).onsuccess=function(event){
			callback(new S.Db.LocalDbStore.Cursor(event.target.result,this));
		}.bind(this);
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
			console.log('key=',this.key);
			
			//because cursor in IndexedDB already contains the first result
			Object.defineProperty(this,'next',{ configurable:true, value: function(callback){
				console.trace && console.trace();
				Object.defineProperty(this,'next',{ value: function(callback){
					this._cursor['continue']();
					callback(this.key = this._cursor.key);
				}.bind(this) });
				callback(this.key);
			}.bind(this) });
		},
		advance: function(count){
			this._cursor.advance(count);
			return this;
		},
		/*next: ,*/
		result: function(callback){
			var r = new App.Model.Request;
			this._store.findByKey(this.key,{},r);
			r.success(callback).failed(callback.bind(null,undefined));
		},
		model: function(callback){
			this.result(function(result){
				callback(this._store.toModel(result));
			}.bind(this));
		},
		remove: function(callback){
			var r = new App.Model.Request;
			this._store.deleteByKey(this.primaryKey,r);
			return r;
		},
		forEachKeys: function(callback,onEnd){
			//because next function is changing, we can't go this.next.bind(this)
			S.asyncWhile(function(){ this.next.apply(null,arguments); }.bind(this),callback,function(){
				this.close();
				onEnd && onEnd();
			}.bind(this));
		},
		forEach: function(callback,onEnd){
			this.forEachKeys(function(){
				this.model(callback);
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
		remove: function(callback){
			var r = new App.Model.Request;
			this._store.deleteByKey(this.key,r);
			return r;
		},
		close: function(callback){
			this._iterator = this._store = this._prefix = undefined;
			callback && callback();
		}
	})
});