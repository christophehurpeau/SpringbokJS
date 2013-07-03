S.require('vL/page',function(){
	App.Layout.add('default',L.get('page'),'content',function(){
		console.log(this.parent);
		this.parent.$content.html('<div id="pageContent" class="col variable"></div>');
		this.$content=$.first('#pageContent');
	});
});