module.exports=App.Controller({layout:'admin/page'},{
	beforeDispatch:function(req,res){
		console.log(this.self);
	},
	Index:App.Controller.Action(function(req,res){
		this.render();
	})
});