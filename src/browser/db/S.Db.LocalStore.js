includeCore('browser/db/S.Db');
includeCore('browser/db/S.Db.AbstractStore');
includeCore('browser/db/S.Db.Cursor');
includeCore('browser/base/S.store');

if( !window.indexedDB ){
	// shim to WebSQL : 
	S_loadSyncScript('compat/IndexedDBShim');
	
	
	/*if (!window.indexedDB)
		window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");*/
}

S.Db.LocalDbStore=S.Db.AbstractStore.extend({
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
		var cursor = new S.Db.LocalDbStore.Cursor(this);
		var dbCursor = this.store().openCursor(options.range || null, options.direction || "next");
		dbCursor.onsuccess = function(event){
			dbCursor.onsuccess = function(event){
				cursor._onNext(event.target.result);
			};
			cursor._onNext(event.target.result);
			callback(cursor);
		};
	},
	cursorIndex:function(indexName,callback,query,options){
		throw new Error('TODO');
		var store=this.store(), index = store.index(indexName);;
		if(!options) options = {};
		index.openCursor(options.range || null, options.direction || "next").onsuccess = function(event){
			callback(new S.Db.LocalDbStore.Cursor(event.target.result,this));
		}.bind(this);
	},
	byIndex:function(indexName,key,callback){
		throw new Error('TODO');
		this.store().index(indexName).get(key).onsuccess=function(event){
			callback(new S.Db.LocalDbStore.Cursor(event.target.result,this));
		}.bind(this);
	},
},{
	Cursor: S.Db.Cursor.extend({
		ctor: function(store){
			this._store = store;
			
			//because cursor in IndexedDB already contains the first result
			Object.defineProperty(this,'next',{ configurable:true, value: function(callback){
				Object.defineProperty(this,'next',{ value: function(callback){
					this._onNextCallback = callback;
					this._cursor['continue']();
					this._cursor = undefined;
				}.bind(this) });
				callback(this.key);
			}.bind(this) });
		},
		_onNext: function(cursor){
			this._cursor = cursor;
			this.key = cursor && cursor.key;
			this._onNextCallback && this._onNextCallback(this.key);
		},
		
		
		advance: function(count){
			throw new Error('TODO')	;
			this._cursor.advance(count);
			return this;
		},
		/*next: ,*/
		forEachKeys: function(callback,onEnd){
			//because next function is changing, we can't go this.next.bind(this)
			S.asyncWhile(function(){ this.next.apply(null,arguments); }.bind(this),callback,function(){
				this.close();
				onEnd && onEnd();
			}.bind(this));
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
},{
	Cursor: S.newClass({
		ctor: function(iterator,store,prefix){
			this._iterator = iterator;
			this._store = store;
			this._prefix = prefix;
		},
		advance: function(count){
			while(count--) this.next(function(){});
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