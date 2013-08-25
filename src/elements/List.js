
S.Elt.List = S.Elt.WithContent.extend({
	tagName:'ul',
	
	li: function(){
		return $.li().appendTo(this).setOrigin(this);
	},
	
	link: function(){
		var li = $.li().appendTo(this);
		return li.link.apply(li,arguments).setOrigin(this);
	},
	
	fromArray: function(array,callback){
		array.forEach(function(e){
			callback.call(this,e);
		}.bind(this));
	}
});
S.Elt.OList = S.Elt.List.extend({
	tagName:'ol'
});


S.Elt.ListItem = S.Elt.WithContent.extend({
	tagName:'li',
	
	link: function(title,url,options){
		options = options || {};
		if(options.escape === undefined) options.escape = true;
		return App.helpers.linkHtml(title,url,options).appendTo(this).setOrigin(this);
	}
});

$.ul = function(){ return new S.Elt.List; };
$.ol = function(){ return new S.Elt.OList; };
$.li = function(){ return new S.Elt.ListItem; };