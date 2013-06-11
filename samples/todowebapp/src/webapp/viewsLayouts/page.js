App.Layout.add('page',App.topLayout,'content',function(){
	this.parent.body.html('<header><h1>todos</h1></header><div id="page"></div><footer>Optimisé pour Firefox 19 et +</footer>');
	this.$content=$('#page');
});