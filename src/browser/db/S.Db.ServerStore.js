includeJsCore('browser/websocket');
//TODO : common Cursor and Store abstract class
S.Db.ServerStore=S.newClass({
	ctor:function(model){
		this.model = model;
		this.db = model.db;/*db.db is not defined yet*/
	},
	store:function(mode){
		//connexion permanente vers le serveur pour dialoguer avec la base : S.WebSocket
		//fallback vers une api get/post/put basique
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
	cursor:function(callback,range,direction){
		S.WebSocket.emit('db cursor',this.db.dbName,this.model.modelName,range,direction,function(idCursor){
			callback(idCursor && new S.Db.ServerStore.Cursor(idCursor,this));
		}.bind(this));
	},
	
	toModel: function(result){
		return result && new this.model(result,'unchanged');
	}
},{
	Cursor:S.newClass({
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
				this.key = result && result[this._store.model.keyPath];
				callback(this.key);
			}.bind(this));
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
			var nbResults = 0, cursor = this;
			(function _callback(){
				cursor.next(function(key){
					if(!key){
						cursor.close();
						return onEnd && onEnd(nbResults);
					}
					cursor.result(function(){
						callback.apply(null,arguments);
						nbResults++;
						_callback();
					});
				});
			})();
		},
		forEach: function(callback,onEnd){
			this.forEachResults(function(result){
				callback(this._store.toModel(result));
			}.bind(this),onEnd);
		},
		close: function(callback){
			S.WebSocket.emit('db cursor '+this._idCursor,'next',function(){
				callback && callback();
			});
			this._idCursor = this._store = undefined;
		}
	})
});