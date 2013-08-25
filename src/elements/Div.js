
S.Elt.Div = S.Elt.WithContent.extend({
	tagName:'div',
	
	div: function(){
		return $.div().appendTo(this).setOrigin(this);
	},
	content:function(){
		return $.div().setClass('content').appendTo(this).setOrigin(this);
	},
	ul: function(){
		return $.ul().appendTo(this).setOrigin(this);
	}
});

$.div = function(){ return new S.Elt.Div; };