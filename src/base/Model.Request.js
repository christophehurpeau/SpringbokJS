/*#ifelse BROWSER*/(var Request||module.exports)/*#/if*/=S.Listenable.extend({
	ctor:function(model,H){
		this.model=model;
		this.H=H;
		this.on('started',function(){
			this._started=true;
			this.model.fire('request.started');
		}.bind(this));
		this.on('success',function(){
			this._success=true;
			this.model.fire('request.success');
			this._synced && this.model.fire('synced');
		}.bind(this));
		this.on('failed',function(){
			this._success=false;
			this.model.fire('request.failed');
		}.bind(this));
		this.on('synced',function(){
			this._synced=true;
			this.success && this.model.fire('synced'); // ensure that sync is always called after success
		}.bind(this));
	},
	
	success:function(callback){
		if(this._success === undefined) return this.on('success',callback);
		this._success && callback.call(this);
	},
	
	synced:function(callback){
		if(this._synced === undefined) return this.on('synced',callback);
		this._synced && callback.call(this);
	},
	
	failed:function(callback){
		if(this._success === undefined) return this.on('failed',callback);
		if(this._success===false) callback.call(this)
	},
	
});
