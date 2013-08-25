S.Elt.Navigation=S.Elt.WithContent.extend({
	tagName:'nav',
	
	ul: function(){
		return $.ul().appendTo(this).setOrigin(this);
	}
});
$.navigation = function(){ return new S.Elt.Navigation; };
