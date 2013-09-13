/* Maybe Watcher is not the best name */
/* This is an abstract Class ! */
S.Watcher=S.Listenable.extend({
	ctor:function(){
		S.Listenable.call(this);
		this.nodes=[];
		/*#if DEV*/ if(!this._render) console.error('this._render must exists !',this); /*#/if*/
	},
	
	toLi:function(){
		return this.render($.li());
	},
	
	render:function(wrapper){
		this._render(wrapper);
		wrapper.on('dispose',function(){
			UArray.remove(this.nodes,wrapper);
		}.bind(this));
		this.nodes.push(wrapper);
		return wrapper;
	},
	rerender:function(){
		this.nodes.forEach(function(node){
			this._render(node);
		});
	},
});