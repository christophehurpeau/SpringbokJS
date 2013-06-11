/*#if NODE*/ var mongodb=require('mongodb'); /*#/if*/
/* http://axemclion.github.com/IndexedDBShim/dist/IndexedDBShim.min.js */
S.Db=(function(){
	var connections={},Db={
		init:function(onEnd){
			UObj.forEachAsync(Config.db,function(key,dbConfig,onEnd){
				Db.create(key,dbConfig,onEnd);
			},onEnd);
		},
		create:function(key,dbCondig,onEnd){
			/*#if NODE*/
			mongodb.MongoClient.connect('mongodb://localhost:27017/'+dbCondig.dbName,function(err,db){
				if(err) console.error('connection error:',err);
				else{
					S.log('connection to '+key+' [ok]');
					connections[key]=db;
					onEnd();
				}
			});
			/*#/if*/
		},
		get:function(key){
			/*#if DEV*/ if(!connections[key]) throw new Error('No connections for db "'+key+'"'); /*#/if*/
			return connections[key];
		}
	};
	return Db;
})();
