includeJsCore('browser/base/');
includeJsCore('browser/ui/base');

S.ui.InputFollow = S.Widget.extend({
	ctor: function($input){
		this.$input=$input.on('dispose',this._onDispose = function(){ this.dispose(); }.bind(this));
		if( ! $input.InputFollow )
			$input.InputFollow = [];
		$input.InputFollow.push(this);
	},
	dispose: function(){
		if(this.$input){
			this.$input.off('dispose',this._onDispose);
			if(this.$input.InputFollow && this.$input.InputFollow.length)
				UArray.remove(this.$input.InputFollow, this);
		}
		S.ui.InputFollow.super_.dispose.call(this);
	},
	
	isEditable: function(){return Elt.isEditable(this.$input[0]); } //TODO : prop editable ??
});
