S.require('vL/page',function(){
	App.Layout.add('onecol',L.get('page'),'content',function(){
		this.parent.$content.html('<div class="col variable"></div>');
		this.$content=this.parent.$content.child();
	});
});