App.Layout=S.Widget.extend({
	ctor:function(name,parent,methods,init,removeLayout){
		var t=this;
		t.parent=parent;
		t.name=name;
		t.page=App.page;
		t.init=init;
		removeLayout && (t.removeLayout = removeLayout);
		(t.methods=methods.split(' ')).forEach(function(v){
			t[v]=function(){
				t['$'+v].empty().append.apply(t['$'+v],arguments);
				return t;
			};
			t['append'+UString.ucFirst(v)]=function(){
				t['$'+v].append.apply(t['$'+v],arguments);
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
		S.log('install layout '+this.name);
		this.installed=true;
		this.init();
		this.fire(App.Layout.installEvent);
	},
	dispose:function(){
		S.log('dispose layout '+this.name);
		this.child && this.child.dispose();
		delete this.child;
		this.installed=false;
		this.removeLayout && this.removeLayout();
		this.methods.forEach(function(v){
			//this['$'+v] && this['$'+v].dispose(); instead of dispose we could use remove, but is it really necessary ?
			this['$'+v] && this['$'+v].remove();
			delete this['$'+v];
		}.bind(this));
	},
	
	title:function(t){ document.title=t; return this; },
	render:function(callback){
		this._init(null,callback);
	}
},{
	installEvent:new Event('install'),
	add:function(name,parent,methods,init){
		L.set(name,new App.Layout(name,parent,methods,init));
	}
});
