includeCore('browser/db/S.Db');
includeCore('browser/db/S.Db.AbstractStore');
includeCore('browser/db/S.Db.Cursor');
includeJsCore('browser/websocket');

//TODO : common Cursor and Store abstract class
S.Db.ServerStore=S.Db.AbstractStore.extend({
	ctor:function(model){
		this.model = model;
		this.db = model.db;/*db.db is not defined yet*/
	},
	store:function(mode){
		//connexion permanente vers le serveur pour dialoguer avec la base : S.WebSocket
		return this;
	},
	insert:function(data,options,r){
		S.WebSocket.emit('db insert',this.db.dbName,this.model.modelName,data,function(modelData){
			if(modelData) r.model.data = modelData;
			r.fire('success');
		});
		r.fire('started');
	},
	update:function(data,options,r){
	},
	deleteByKey:function(key,options,r){
	},
	cursor:function(callback,query,options){
		S.WebSocket.emit('db cursor',this.db.dbName,this.model.modelName,query,options,function(idCursor){
			callback(idCursor && new S.Db.ServerStore.Cursor(idCursor,this));
		}.bind(this));
	}
},{
	Cursor:S.Db.Cursor.extend({
		ctor: function(idCursor,store){
			this._idCursor = idCursor;
			this._store = store;
		},
		advance: function(count){
			S.WebSocket.emit('db cursor '+this._idCursor+' advance',count);
			return this;
		},
		next: function(callback){
			S.WebSocket.emit('db cursor '+this._idCursor,'next',function(result){
				this._result = result;
				this.primaryKey = this.key = result && result[this._store.model.keyPath];
				callback(this.key);
			}.bind(this));
		},
		result: function(callback){
			callback(this._result);
		},
		forEachKeys: function(callback,onEnd){
			var cursor = this;
			(function _callback(){
				cursor.next(function(key){
					if(!key) return cursor.close(), onEnd && onEnd();
					cursor.result(function(){
						callback.apply(null,arguments);
						_callback();
					});
				});
			})();
		},
		close: function(callback){
			S.WebSocket.emit('db cursor '+this._idCursor,'close',function(){
				callback && callback();
			});
			this._idCursor = this._store = undefined;
		}
	})
});