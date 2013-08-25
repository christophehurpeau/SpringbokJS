includeJsCore('base/Listenable');

S.Widget=(function(){
	var registeredEventDispose = function(listenable){
		if(!this._registeredEvents) return;
		for(var i=0; i<this._registeredEvents.length;){
			if(this._registeredEvents[i][0] === listenable)
				this._registeredEvents.splice(i,1);
			else i++
		}
	};
	return S.Listenable.extend({
		onFor:function(listenable,eventNames,callback){
			listenable.on(eventNames,callback);
			if(!this._registeredEvents) this._registeredEvents = [];
			else this._registeredEvents.some(function(registeredEvent){
				return registeredEvent[0] === listenable;
			}) || listenable.on('dispose',this._registeredEventDispose || (this._registeredEventDispose = registeredEventDispose.bind(this)));
			this._registeredEvents.push([listenable,eventNames,callback]);
			
			listenable.on(eventNames,callback);
			return this;
		},
		
		dispose:function(){
			this._registeredEvents && this._registeredEvents.forEach(function(registeredEvent){
				registeredEvent[0].off(registeredEvent[1],registeredEvent[2]);
			});
			this.fire('dispose');
			Object.keys(this).forEach(function(key){
				delete this[key];
			}.bind(this));
		}
	});
})();

S.Elt.Widget = S.Elt.Div.extend({
	ctor:function(){
		S.Elt.Div.call(this);
		this.setClass('widget');
	},
});
S.Elt.WidgetWrapper = S.Elt.Div.extend({
	widget:function(){
		return $.widget().appendTo(this).setOrigin(this);
	}
});
$.widget = function(){ return new S.Elt.Widget; };
$.widgetWrapper = function(){ return new S.Elt.WidgetWrapper; };
