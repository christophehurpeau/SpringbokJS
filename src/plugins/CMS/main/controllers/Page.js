App.Controller({
	Index:App.Controller.Action(function(req,res){
		req.route.nParams.slug='Accueil';
		this.View(req,res);
	}),
	View:App.Controller.Action(function(req,res){
		var v=req.validParams(), slug=v.str('slug',1).notEmpty().val;
		//res.end('Page '+slug);
		this.render({slug:slug},'View');
	})
});