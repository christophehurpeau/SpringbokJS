includeCoreUtils('Listenable');

S.Widget=(function(){
	var registeredEventDispose = function(listenable){
		if(!this._registeredEvents) return;
		for(var i=0; i<this._registeredEvents.length;){
			if(this._registeredEvents[i][0] === listenable)
				this._registeredEvents.splice(i,1);
			else i++;
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
		
		remove:function(){
			this._registeredEvents && this._registeredEvents.forEach(function(registeredEvent){
				registeredEvent[0].off(registeredEvent[1],registeredEvent[2]);
			});
			this.fire('dispose');
			Object.keys(this).forEach(function(key){
				delete this[key];
			}.bind(this));
		},
		
		dependsOn:function($elt){
			console.log(this,'dependsOn',$elt);
			var fnDisposeElt, fnDisposeWidget; 
			$elt.on('dispose',fnDisposeElt = function(){
				console.log('dependsOn elt disposed',$elt,this);
				this.off('dipose',fnDisposeWidget);
				setTimeout(this.remove.bind(this));
			}.bind(this));
			
			this.on('dispose',fnDisposeWidget = (function(){
				console.log('dependsOn widget disposed',$elt,this);
				$elt.off('dispose',fnDisposeElt);
			}.bind(this)));
			return this;
		}
	});
})();

S.Widget.Element = S.Widget.extend({
	ctor: function($elt){
		S.Widget.call(this);
		if(!$elt) $elt = $.widget();
		this.$elt = $elt;
		
		var fnDisposeWidget, fnDisposeElt;
		this.on('dispose',fnDisposeWidget = (function(){
			if(this.$elt){
				this.$elt.off('dispose',fnDisposeElt);
				this.$elt.remove();
				delete this.$elt;
			}
			console.log('S.Widget.Element disposed',this,' : remove ',this.$elt);
		}.bind(this)));
		
		this.$elt.on('dispose',fnDisposeElt = (function(){
			this.off('dispose',fnDisposeWidget);
			setTimeout(this.remove.bind(this));
			console.log('S.Widget.Element element disposed',this,' : ',this.$elt);
		}.bind(this)));
	},
	
	elt: function(){
		return this.$elt.setOrigin(this);
	}
});

'toggle show hide'.split(' ').forEach(function(mName){
	Object.defineProperty(S.Widget.Element.prototype,mName,{ value: function(){ this.$elt[mName].apply(this.$elt,arguments); } });
});


S.Elt.Widget = S.Elt.Div.extend({
	ctor:function(){
		S.Elt.Div.call(this);
		this.setClass('widget');
	},
});
S.Elt.WidgetBox = S.Elt.Widget.extend({
	ctor:function(){
		S.Elt.Div.call(this);
		this.setClass('widget widgetBox');
		this.registerEvents();
	},
	
	registerEvents:function(){
		$window.on('click',function(){
			this.hide();
		}.bind(this));
	}
});
S.Elt.WidgetWrapper = S.Elt.Div.extend({
	widget:function(){
		return $.widget().appendTo(this).setOrigin(this);
	},
	widgetBox:function(){
		return $.widgetBox().appendTo(this).setOrigin(this);
	}
});
$.widget = function(){ return new S.Elt.Widget; };
$.widgetBox = function(){ return new S.Elt.WidgetBox; };
$.widgetWrapper = function(){ return new S.Elt.WidgetWrapper; };

S.Elt.Element.prototype.widget = function($elt){
	return new S.Widget.Element($elt).dependsOn(this);
};
