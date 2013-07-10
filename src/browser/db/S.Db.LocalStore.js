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
	update:function(data,options,callback){
		var request=this.store('readwrite').put(data);
		request.onsuccess=function(event){
			console.log('successful update',event);
			r.fire('success');
		};
		r.fire('started');
	},
	'delete':function(key,options,callback){
		var request=this.store('readwrite')['delete'](key);
		request.onsuccess=function(event){
			console.log('successful delete',event);
			r.fire('success');
		};
		r.fire('started');
	},
	cursor:function(callback,range,direction){
		this.store().openCursor(range,direction)
			.onsuccess = function(event){
				callback(event.target.result);
			}
	},
	cursorIndex:function(indexName,callback,range,direction){
		var store=this.store(), index = store.index(indexName);;
		index.openCursor(range,direction).onsuccess = function(event) {
			callback(event.target.result);
		}
	},
	byIndex:function(indexName,key,callback){
		this.store().index(indexName).get(key).onsuccess=function(event){
			callback(event.target.result);
		};
	}
});

S.Db.LocalStore=window.indexedDB ? S.Db.LocalDbStore : S.Db.LocalDbStore.extend({
	store:null,
	insert:function(data,options,callback){
		data=this._beforeInsert(data);
		window.store.set(this.model.modelName+'___'+data[this.model.keyPath],data);
		callback();
	},
	'delete':function(key,options,callback){
		store.remove(this.model.modelName+'___'+key);
		callback();
	},
	cursor:function(callback,range,direction){
		if(range||direction) throw new Error('range or direction is not supported');
		var prefix=this.model.modelName+'___';
		/*store.forEach(function(key,value){
			if(key.startsWith(prefix)){
				
			}
		})*/
		new Cursor();//TODO
		store.cursor();
	},
});