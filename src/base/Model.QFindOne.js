/*#if NODE*/var QFind=/*#/if*/
includeCore('base/Model.QFind');

/*#ifelse BROWSER*/(var QFindOne||module.exports)/*#/if*/=QFind.extend({
	fetch:function(callback){
		/*#if NODE */
		if(this.H){
			var truecallback=callback;
			callback=function(err,doc){ err!==null ? this.H.res.exception(HttpException.newInternalServerError(err)) : truecallback(doc); };
		}
		this._fields ? this.model.collection.findOne(this._query,this._fields,callback)
			: this.model.collection.findOne(this._query,callback) ;
		//todo : res.__proto__=Model.prototype ou new Model ?
		/*#else*/
		if(this._id) return this.model.transaction(function(transaction,objectStore){
			objectStore.get(this._id).onsuccess = function(event){
				callback(event.target.result);
			};
		});
		return this.cursor(function(transaction,objectStore,cursor){
			callback(cursor ? cursor.value : null);
		});
		
		/*#/if*/
	},
	byId:function(id){
		/*#if NODE */this._query={_id:id};
		/*#else*/this._id=id;
		/*#/if*/
		return this;
	},
	byIdNotNull:function(id,callback){ return this.byId(id).notNull(callback); },
	notNull:function(callback){ var t=this; this.fetch(function(doc){ doc===null ? t.H.res.notFound() : callback(doc); }); },
	
	/*#if BROWSER*/
	byKey:function(indexName,key,callback){
		this.model.byIndex(indexName,key,callback);
	}
	/*#/if*/
});
