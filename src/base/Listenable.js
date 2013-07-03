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
	on:function(event,listener){
		var events = this._events || (this._events = {}),callbacks=events[event];
		if(!callbacks) callbacks=/*this._events*/events[event]=[];
		else if(UArray.has(callbacks,listener)) return this;
		callbacks.push(listener);
		return this;
	},
	once:function(event,listener){
		var t=this;
		t.on(event,function on(){
			t.off(event,on);
			return listener.apply(this,arguments);
		})
	},
	off:function(event,listener){
		var callbacks=this.listeners(event),i;
		if(callbacks && (i=callbacks.indexOf(listener))){
			callbacks.splice(i,1);
			if(callbacks.length === 0) delete this._events[evt];
		}
		return this;
	},
	fire:function(event/*,args*/){
		/*if(this._events[event]){
			args = UArray.slice1(arguments);
			for(var i=0,events=this._events[event],l=events.length; i<l; i++)
				events[i].apply(this,args);
		}*/
		var callbacks=this.listeners(event);
		if(callbacks && callbacks.length!==0){
			var i = callbacks.length,response,args=UArray.slice1(arguments);
			while(i--){
				response = callbacks[i].apply(this,args);
				if(response===false) break;
			}
		}
		return this;
	},
	listeners:function(event){
		return this._events && this._events[event];
	},
	removeEvent:function(event){
		event ? delete this._events[event] : delete this._events;
	},
	removeListener:function(event,listener){
		this._events && this._events[event] && UArray.remove(this._events[event],listener);
	},
	dispose:function(){
		delete this._events;
	}
});
/*#/if*/