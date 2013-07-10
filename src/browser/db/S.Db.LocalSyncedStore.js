includeCore('browser/db/S.Db');
includeCore('browser/db/S.Db.LocalStore');
includeCore('browser/db/S.Db.ServerStore');

//if indexeddb is not available, only use server
S.Db.LocalSyncedStore=S.newClass({
	ctor:function(model){
		if(window.indexedDB) this._localStore=new S.Db.LocalDbStore(model);
		this._serverStore=new S.Db.ServerStore(model);
	}
},{
	hasSyncEvent:true
});