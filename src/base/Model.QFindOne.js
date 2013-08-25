/*#if NODE*/var Request=/*#/if*/
includeCore('base/Model.Request');
/*#if NODE*/var QFind=/*#/if*/
includeCore('base/Model.QFind');

/*#ifelse BROWSER*/(var QFindOne||module.exports)/*#/if*/=QFind.extend({
	_fetch:function(callback,callbackFailed){
		S.log('[mongo] Fetching on '+this.model.modelName+': query=',this._query,', fields=',this._fields);
		
		var request=new Request();
		request.success(function(result){
			callback(result); //toModel is done in fetch without _
		});
		/*#if NODE */
		if(this.H) request.failed(function(){
			this.H.res.exception(HttpException.newInternalServerError(err));
		}.bind(this));
		else !callbackFailed && S.log('WARN: missing H for query');
		callbackFailed && request.failed(callbackFailed);
		/*#/if*/
		UArray.forEachSeries(this.model['beforeFind'],
			function(c,onEnd){ c(data,onEnd); },
			function(err){
				if(err) return request.fire('failed');
				//setTimeout(function(){  }); // return request before !
				this.model.store.findOne(this._query,this.options,request);
			}.bind(this));
		return request;
	},
	fetch:function(callback,callbackFailed){
		this._fetch(function(result){
			callback(this.toModel(result));
		}.bind(this),callbackFailed);
	},
	byId:function(id){
		/*#if NODE */this._query={_id:id};
		/*#else*/this._query={_id:id};//this._id=id;
		/*#/if*/
		return this;
	},
	byIdNotNull:function(id,callback,callbackFailed){ return this.byId(id).notNull(callback,callbackFailed); },
	notNull:function(callback,callbackFailed){ this.fetch(function(doc){ doc===null ? this.H.res.notFound() : callback(doc); }.bind(this),callbackFailed); },
	
	/*#if BROWSER*/
	byKey:function(indexName,key,callback){
		this.model.byIndex(indexName,key,callback);
	}
	/*#/if*/
});
