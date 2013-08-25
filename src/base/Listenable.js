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
		if(!this._events.has(event)) this._events.set(event,callbacks = []);
		else{
			callbacks = this._events.get(event);
			if(UArray.has(callbacks,listener)) return this;
		}
		callbacks.push(listener);
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
		var callbacks = this.listeners(event),i;
		if(callbacks && (i = callbacks.indexOf(listener))){
			callbacks.splice(i,1);
			if(callbacks.length === 0) delete this._events[evt];
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
		if(callbacks && callbacks.length!==0){
			var i = callbacks.length,response,args=UArray.slice1(arguments);
			while(i--){
				response = callbacks[i].apply(this,args);
				if(response===false) break;
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