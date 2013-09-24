includeCore('browser/db/S.Db');

S.Db.Cursor=S.newClass({
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
			r.success(callback).failed(callback.bind(false));
		},
		forEach: function(callback,onEnd){
			this.forEachKeys(function(){
				this.model(callback);
			}.bind(this),onEnd);
		},
});