/*#ifelse BROWSER*/(var Request||module.exports)/*#/if*/=S.Listenable.extend({
	ctor:function(H){
		this.H=H;
		this.on('success',function(){
			this._success=arguments;
		});
		this.on('failed',function(){
			this._failed=arguments;
		});
	},
	
	success:function(callback){
		if(this._success === undefined) return this.on('success',callback);
		this._success && setTimeout(callback.bind(this,this._success));
		return this;
	},
	
	failed:function(callback){
		if(this._failed === undefined) return this.on('failed',callback);
		if(this._failed === false) setTimeout(callback.bind(this,this._failed));
		return this;
	},
	
});

/*#ifelse BROWSER*/(Request||module.exports)/*#/if*/.Model = /*#ifelse BROWSER*/(Request||module.exports)/*#/if*/.extend({
	ctor:function(model,H){
		this.model=model;
		this.H=H;
		this.on('started',function(){
			this._started=true;
			/*#if BROWSER*/
			this.model.fire('request.started');
			/*#/if*/
		}.bind(this));
		this.on('success',function(){
			this._success=arguments;
			/*#if BROWSER*/
			this.model.fire('request.success');
			this._synced && this.model.fire('synced');
			/*#/if*/
		}.bind(this));
		this.on('failed',function(){
			this._failed=arguments;
			/*#if BROWSER*/
			this.model.fire('request.failed');
			/*#/if*/
		}.bind(this));
		this.on('synced',function(){
			this._synced=true;
			/*#if BROWSER*/
			this.success && this.model.fire('synced'); // ensure that sync is always called after success
			/*#/if*/
		}.bind(this));
	},
	synced:function(callback){
		if(this._synced === undefined) return this.on('synced',callback);
		this._synced && setTimeout(callback.bind(this));
		return this;
	}
});
