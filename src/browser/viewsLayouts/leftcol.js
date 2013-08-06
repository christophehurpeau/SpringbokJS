S.require('vL/page',function(){
	App.Layout.add('onecol',L.get('page'),'content',function(){
		this.parent.$content.html('<div class="col left w200"></div><div class="col variable"></div>');
		this.$left=this.parent.$content.child();
		this.$content=this.parent.$content.child(1);
	});
});