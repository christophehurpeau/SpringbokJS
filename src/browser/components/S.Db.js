includeCore('browser/webapp/Model');
includeCoreUtils('S.alphaNumber');

/*https://github.com/jensarps/IDBWrapper/blob/master/idbstore.js
 * 
 * S.Db('default',{ version:1, upgrade:function(){} })
 * options : contient par exemple les instructions de modifications de versions, les instructions d'initialisation de la base, ...
 * 
 */
S.Db=(function(){
	var dbs=new Map;
	
	var Db=S.newClass({
		ctor:function(dbName,options){
			this.dbName=dbName;
			options.dbName=dbName;
			this.options=options;
			this.models=[];
		},
		
		add:function(){
			var model=App.Model.apply(null,arguments);
			this.models.push(model);
			model.db=this;
			model.store=new (model.Store||this.options.Store||S.Db.LocalStore)(model);
			M[model.modelName]=model;
			S.log('Addubg new model: ',model);
			return model;
		}
	}),
		indexComplies=function(actual, expected){
			// IE10 returns undefined for no multiEntry
			if (actual.multiEntry === undefined && expected.multiEntry === false) return true;
			else if(actual.multiEntry != expected.multiEntry) return false;
			return actual.keyPath == expected.keyPath && actual.unique == expected.unique;
		};

	
	if(window.indexedDB){
		S.extProto(Db,{
			configurable:{
				init:function(){
					S.require.increment();
					S.log('init db '+this.dbName);
					Object.defineProperty(Db,'init',{ value:function(callback){ callback(this); } });
					
					var thisdb=this,options=this.options,request=window.indexedDB.open(this.dbName,options.version);
					request.onblock=function(e){
						new FatalError("Please close all other tabs with this site open!");
					};
					
					request.onerror=function(error){
						/*#if DEV*/
						var gotVersionErr;
						if ('error' in error.target)
							gotVersionErr = error.target.error.name == "VersionError";
						if(gotVersionErr)
							alert('The version number provided is lower than the existing one.');
						else console.error(error) , 
						/*#/if*/
							alert("Why didn't you allow my web app to use IndexedDB?!");
					};
					
					var preventSuccessCallback = false;
					
					request.onsuccess=function(event){
						if (preventSuccessCallback) return;
						thisdb.db=event.target.result;
						Object.seal(thisdb);
						
						if(typeof thisdb.db.version == 'string')
							new FatalError('The IndexedDB implementation in this browser is outdated. Please upgrade your browser.');
						
						
						
						thisdb.db.onerror=function(event){
							alert("Database error: " + event.target.errorCode);
						};
						S.log('init success db '+this.dbName);
						S.require.decrement();
					};
					
					request.onupgradeneeded = function(event){
						S.log('onupgradeneeded');
						var db=event.currentTarget.result;
						//options.upgrade && options.upgrade(sb);
						//TODO : upgrade should contains an array of versions upgrades.
						//TODO : download for each migrations an apply it
						//TODO : then update the database with Models, like we do with Mongo / MySQL in Springbok PHP.
						
						UArray.forEachAsync(thisdb.models,function(model,onEnd){
							S.log('add model '+model.modelName+' in db ',db);
							var store;
							if(db.objectStoreNames.contains(model.modelName)){
								store=event.target.transaction.objectStore(model.modelName)
								if(model.keyPath !== store.keyPath){
									S.log('recreate store: '+model.modelName);
									db.deleteObjectStore(model.modelName);
									store=db.createObjectStore(model.modelName,{keyPath:model.keyPath});
								}
							}else
								store=db.createObjectStore(model.modelName,{keyPath:model.keyPath});
							
							model.indexes && model.indexes.forEach(function(index){
								var indexName = index.name;
	
								if(!indexName){
									preventSuccessCallback = true;
									new FatalError('Cannot create index: No index name given.');
								}
								
								index.keyPath = index.keyPath || index.name;
								index.unique = !!index.unique;
								index.multiEntry = !!index.multiEntry;
								
								if(store.indexNames.contains(indexName)){
									// check if it complies
									var actualIndex = store.index(indexName);
									if(!indexComplies(actualIndex,index)){
										// index differs, need to delete and re-create
										store.deleteIndex(indexName);
										store.createIndex(indexName, index.keyPath, { unique: index.unique, multiEntry: index.multiEntry });
									}
								}else{
									store.createIndex(indexName, index.keyPath, { unique: index.unique, multiEntry: index.multiEntry });
								}
							});
							App.Model.Model.init(model,onEnd);
						},function(){
							S.log('init success (onupgradeneeded) db '+thisdb.dbName);
						});
					};
				}
			},
			
			useDatabase:function(db){
				// Make sure to add a handler to be notified if another page requests a version
				// change. We must close the database. This allows the other page to upgrade the database.
				// If you don't do this then the upgrade won't happen until the user close the tab.
				db.onversionchange = function(event) {
					db.close();
					alert("A new version of this page is ready. Please reload!");//TODO confirm reload auto
				};
			}
		});
	}else{
		S.extProto(Db,{
		});
	}
	
	var SDb=function(dbName,options){
		S.log('Creating new db: '+dbName);
		var db=new Db(dbName,options);
		dbs.set(dbName,db);
		return db;
	};
	return S.defineProperties(SDb,{
		get:function(dbName,callback){
			S.log('S.db.get: '+dbName);
			return dbs.get(dbName).init(callback);
		},
		forEach:function(){
			return dbs.forEach.apply(dbs,arguments);
		}
	});
})();
