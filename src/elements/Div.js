
S.Elt.Div = S.Elt.WithContent.extend({
	tagName:'div',
	
	div: function(){
		return $.div().appendTo(this);
	},
	content:function(){
		return $.div().setClass('content').appendTo(this);
	},
	ul: function(){
		return $.ul().appendTo(this);
	}
});

$.div = function(){ return new S.Elt.Div; };