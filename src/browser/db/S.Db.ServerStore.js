S.Db.ServerStore=S.newClass({
	ctor:function(model){
		this.model=model;
		this.db=model.db;/*db.db is not defined yet*/
	},
	store:function(mode){
		//connexion permanente vers le serveur pour dialoguer avec la base
		//fallback vers une api get/post/put basique
		return this;
	},
	insert:function(data,options,r){
		//le before insert ne sera pas nécessaire : le serveur s'occupera de rajouter l'id si besoin Il faudra par contre penser à le récupérer
		var request=this.store('readwrite').add(this._beforeInsert(data));
		request.onsuccess=function(event){
			console.log('successful insert',event);
			r.fire('success');
		};
	},
	update:function(data,options,callback){
	},
	'delete':function(key,options,callback){
	},
	cursor:function(callback,range,direction){
	},
});