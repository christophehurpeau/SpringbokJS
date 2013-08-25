S.Db=(function(){
	var dbs=new Map;
	
	var Db=S.newClass({
		ctor:function(dbName,options){
			this.dbName=dbName;
			options.dbName=dbName;
			this.options=options;
			this.models=[];
			this.store=(options.Store&&S.Db[options.Store])||require('./MongoDBStore');
		},
		
		init:function(onEnd){
			this.store.init(this,function(err){
				if(err) return onEnd(err);
				Object.freeze(this);
				onEnd();
			}.bind(this));
		},
		
		add:function(model,onEnd){
			model.db=this;
			model.store=new this.store(model);//(model.Store||(this.options.Store&&S.Db[this.options.Store])||S.Db.MongoDBStore)(model);
			S.log('Adding new model: ',model);
			model.store.init(onEnd);
			return model;
		}
	});
	
	return S.defineProperties({},{
		init:function(onEnd){
			UObj.forEachAsync(Config.db,function(dbName,dbConfig,onEnd){
				var db=new Db(dbConfig.dbName,dbConfig);
				dbs.set(dbName,db);
				db.init(onEnd);
			},onEnd);
		},
		get:function(dbName){
			S.log('S.db.get: '+dbName+' '+dbs.has(dbName));
			return dbs.get(dbName);
		},
		forEach:function(){
			return dbs.forEach.apply(dbs,arguments);
		}
	});
})();
