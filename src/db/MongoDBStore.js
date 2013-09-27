var mongodb=require('mongodb');

includeCore('db/S.Db.AbstractStore');
includeCore('db/S.Db.Cursor');

module.exports = S.Db.MongoDBStore = S.Db.AbstractStore.extend({
	ctor:function(model){
		this.model = model;
		this.db = model.db;
	},
	init:function(onEnd){
		//S.log(model.modelName+' dbName='+model.dbName);
		this.db.db.collection(this.model.modelName,{w:1},function(err,collection){
			if(err) return onEnd(err);
			this.model.collection=collection;
			onEnd();
		}.bind(this));
	},
	store:function(){
		return this.model.collection;
	},
	insert:function(options,r){
		this.model.collection.insert(options.data,options,function(err, item){
			if(err) return r.fire('failed',err);
			console.log('successful insert',item);
			r.fire('success',item);
		});
		r.fire('started');
	},
	update:function(options,r){
		this.model.collection.update(options.criteria,options.data,options,function(err, count){
			if(err) return r.fire('failed',err);
			console.log('successful update',count);
			r.fire('success',item);
		});
		r.fire('started');
	},
	'delete':function(options,r){
		request.onsuccess=function(err){
			if(err) return r.fire('failed',err);
			console.log('successful delete',err);
			r.fire('success');
		};
		r.fire('started');
	},
	/** @see http://mongodb.github.io/node-mongodb-native/api-generated/collection.html#findone */
	findOne:function(query,options,r){
		//selector, options, callback?
		//options= limit,sort,fields,skip,hint,tailable,tailableRetryInterval,returnKey,maxScan,min,max,comment,raw
		this.model.collection.findOne(query,options,function(err,result){
			if(err) return r.fire('failed',err);
			console.log('successful findOne',result);
			r.fire('success',result);
		});
	},
	/** @see http://mongodb.github.io/node-mongodb-native/api-generated/collection.html#find */
	cursor:function(callback,query,options){
		//selector, options, callback?
		//options= limit,sort,fields,skip,hint,tailable,returnKey,maxScan,min,max,comment,raw
		this.model.collection.find(query,options,function(err,cursor){
			callback(cursor && new module.exports.Cursor(cursor,this));
		}.bind(this));
	},
	
	
	toModel: function(result){
		return result && new this.model(result,'unchanged');
	}
},{
	init:function(db,onEnd){
		mongodb.MongoClient.connect('mongodb://localhost:27017/'+db.dbName,function(err,connection){
			if(err){
				console.error('connection error:',err);
				return onEnd(err);
			}
			S.log('connection to '+db.dbName+' [ok]');
			db.db=connection;
			onEnd();
		});
	},
	Cursor: S.Db.Cursor.extend({
		ctor: function(cursor,store){
			this._cursor = cursor;
			this._store = store;
		},
		advance: function(count){
			this._cursor.skip(count);
			return this;
		},
		next: function(callback){
			this._cursor.nextObject(function(err,value){
				this._result = value;
				this.key = value && value._id;
				callback(this.key);
			}.bind(this));
		},
		limit: function(limit,callback){
			this._cursor.limit(limit,callback);
		},
		count: function(applyLimit,callback){
			this._cursor.count(applyLimit,callback);
		},
		
		result: function(callback){
			callback(this._result);
		},
		model: function(callback){
			callback(this._store.toModel(this._result));
		},
		remove: function(callback){
			var r = new App.Model.Request;
			this._store.deleteByKey(this.key,r);
			return r;
		},
		forEach: function(callback,onEnd){
			this.forEachResults(function(result){
				callback(this._store.toModel(result));
			}.bind(this),onEnd);
		},
		forEachResults: function(callback,onEnd){
			this._cursor.each(function(err,result){
				if(result === null) onEnd && onEnd();
				else callback(result);
			});
		},
		toArray: function(callback){
			this._cursor.toArray(function(err,results){
				callback(results.map(function(v){ return this._store.toModel(v); }.bind(this)));
			}.bind(this));
		},
		close: function(callback){
			this._cursor.close(callback);
			this._cursor = this._store = this._result = undefined;
		}
	})
});