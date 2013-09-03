/*#if NODE*/
var EventEmitter = require("events").EventEmitter;
S.Listenable=S.newClass({
	ctor:function(){ EventEmitter.call(this); },
	fire:EventEmitter.prototype.emit,
	on:EventEmitter.prototype.on,
	once:EventEmitter.prototype.once,
	removeEvent:EventEmitter.prototype.removeAllListeners,
	removeListener:EventEmitter.prototype.removeListener,
	listeners:EventEmitter.prototype.listeners,
	dispose:function(){
		this.removeAllListeners();
	}
});
/*#else*/
S.Listenable=S.newClass({
	on: function(event,listener){
		var events = this._events || (this._events = new Map);
		var callbacks;
		if(!this._events.has(event)) this._events.set(event,callbacks = new Set);
		else callbacks = this._events.get(event);
		callbacks.add(listener);
		return this;
	},
	once: function(event,listener){
		var t = this;
		t.on(event,function on(){
			t.off(event,on);
			return listener.apply(this,arguments);
		});
		return this;
	},
	off: function(event,listener){
		var callbacks = this.listeners(event);
		if(callbacks){
			callbacks.remove(listener);
			if(callbaks.size === 0) this._events['delete'](event);
		}
		return this;
	},
	fire: function(event/*,args*/){
		/*if(this._events[event]){
			args = UArray.slice1(arguments);
			for(var i=0,events=this._events[event],l=events.length; i<l; i++)
				events[i].apply(this,args);
		}*/
		var callbacks = this.listeners(event);
		if(callbacks){
			var response, args=UArray.slice1(arguments);
			var it = S.iterator(callbacks);
			while(it.hasNext() && response !== false){
				var next = it.next();
				console.log(next);
				response = next.apply(this,args);
				//response = it.next().apply(this,args);
			}
		}
		return this;
	},
	listeners: function(event){
		return this._events && this._events.get(event);
	},
	removeEvent: function(event){
		event ? this._events['delete'](event) : this._events.clear();
	},
	removeListener: function(event,listener){
		if(this._events && this._events.has(event))
			this._events.set(event,UArray.remove(this._events.get(event),listener));
	},
	dispose: function(){
		delete this._events;
	}
});

S.Listenable.extendObject = function( object ){
	var extendsProps = { _events: new Map };
	'on once off fire listeners removeEvent removeListener'.split(' ').forEach(function(mName){
		extendsProps[mName] = S.Listenable.prototype[mName];
	});
	return S.defineProperties(object, extendsProps);
};
/*#/if*/