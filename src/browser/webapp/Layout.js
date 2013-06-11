App.Layout=S.newClass({
	ctor:function(name,parent,methods,init){
		var t=this;
		t.parent=parent;
		t.name=name;
		t.page=App.page;
		t.init=init;
		(t.methods=methods.split(',')).forEach(function(v){
			t[v]=function(){
				t['$'+v].empty().append.apply(elt,arguments);
				return t;
			};
		});
	},
	_init:function(child,callback){
		if(this.installed){
			if(this.child !== child){
				this.child && this.child.dispose();
				this.child=child;
			}
			return callback(this);
		}else{
			this.parent._init(this,function(){
				this._install();
				this.child=child;
				callback(this);
			}.bind(this));
		}
	},
	_install:function(callback){
		this.installed=true;
		this.init();
	},
	dispose:function(){
		this.child && this.child.dispose();
		delete this.child;
		this.installed=false;
		this.methods.forEach(function(v){
			this['$'+v] && this['$'+v].dispose();
			delete this['$'+v];
		}.bind(this));
	},
	
	title:function(t){ document.title=t; return this; },
	render:function(callback){
		this._init(null,callback);
	}
},{
	add:function(name,parent,methods,init){
		L.set(name,new App.Layout(name,parent,methods,init));
	}
});
