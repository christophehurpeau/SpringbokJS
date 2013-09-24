S.Elt.Table=S.Elt.WithContent.extend({
	tagName:'table',
	
	tr: function(){
		return $.tr().appendTo(this);
	}
});
S.Elt.Table.R=S.Elt.WithContent.extend({
	tagName:'tr',
	
	td: function(){
		return $.td().appendTo(this);
	},
	
	th: function(){
		return $.th().appendTo(this);
	}
});
S.Elt.Table.D=S.Elt.WithContent.extend({
	tagName:'td',
	
	colspan:function(n){
		return this.attr('colspan',n);
	}
});
S.Elt.Table.H=S.Elt.Table.D.extend({
	tagName:'th',
});
$.table = function(){ return new S.Elt.Table; };
$.tr = function(){ return new S.Elt.Table.R; };
$.td = function(){ return new S.Elt.Table.D; };
$.th = function(){ return new S.Elt.Table.H; };
