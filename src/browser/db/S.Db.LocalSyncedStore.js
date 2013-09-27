includeCore('browser/db/S.Db');
includeCore('browser/db/S.Db.LocalStore');
includeCore('browser/db/S.Db.ServerStore');

//if indexeddb is not available, only use server
S.Db.LocalSyncedStore=!window.indexedDB ? S.Db.ServerStore : S.newClass({
	ctor:function(model){
		this._localStore=new S.Db.LocalDbStore(model);
		this._serverStore=new S.Db.ServerStore(model);
	},
	insert:function(options,r){
		var failed = false, serverRequest = new App.Model.Model.Request, localRequest = new App.Model.Model.Request;
		serverRequest.success(function(){ !failed && r.fire('synced'); });
		localRequest.success(function(){ r.fire('success'); });
		localRequest.failed(function(){ failed = true; r.fire('failed'); });
		
		this._localStore.insert(options,localRequest);
		// <!> _id !!! 
		this._serverStore.insert(options,serverRequest);
	},
	updateByKey:function(key,options,r){
		throw new Error;
	},
	deleteByKey:function(key,options,r){
		throw new Error;
	},
	cursor:function(callback,range,direction){
	},
	
	toModel: function(result){
		return result && new this.model(result,'unchanged');
	}
},{
	hasSyncEvent:true
});