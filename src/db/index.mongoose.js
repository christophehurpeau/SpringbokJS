/*#if NODE*/ var mongoose=require('mongoose'); /*#/if*/
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
			var db=connections[key]=mongoose
					.createConnection('mongodb://localhost/'+dbCondig.dbName);
			db.on('error',console.error.bind(console,'connection error:'));
			db.once('open',function(){
				S.log('connection to '+key+' [ok]');
				onEnd();
			});
			/*#/if*/
		},
		get:function(key){
			/*#if DEV*/ if(!connections[key]) throw new Error('No connections for db "'+key+'"'); /*#/if*/
			return connections[key];
		},
	};
	return Db;
})();
