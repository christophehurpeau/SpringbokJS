module.exports=App.Controller({
	Index:App.Controller.Action(function(req,res){
		var v=req.validParams(), name=v.str('name',1).notEmpty().val;
		res.end('Hello '+name+' !');
		this.render();
	})
});