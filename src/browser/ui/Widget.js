includeJsCore('base/Listenable');

S.Widget=S.Listenable.extend({
	dispose:function(){
		Object.keys(this).forEach(function(key){
			delete this[key];
		}.bind(this));
	}
});
