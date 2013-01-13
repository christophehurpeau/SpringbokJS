/* NODE */ var mongoose=require('mongoose'); /* /NODE */
/* http://axemclion.github.com/IndexedDBShim/dist/IndexedDBShim.min.js */
S.Db=(function(){
	var connections={},Db={
		init:function(onEnd){
			S.asyncObjForEach(Config.db,function(key,dbConfig,onEnd){
				Db.create(key,dbConfig,onEnd);
			},onEnd);
		},
		create:function(key,dbCondig,onEnd){
			/* NODE */
			var db=connections[key]=mongoose
					.createConnection('mongodb://localhost/'+dbCondig.dbName);
			db.on('error',console.error.bind(console,'connection error:'));
			db.once('open',function(){
				S.log('connection to '+key+' [ok]')
				onEnd();
			});
			/* /NODE */
		},
		get:function(key){
			/* DEV */ if(!connections[key]) throw new Error('No connections for db "'+key+'"'); /* /DEV */
			return connections[key];
		}
	};
	return Db;
})();
