App.Controller({
	Index:App.Controller.Action(function(req,res){
		var v=req.validator(), name=v.str('name',1).notEmpty().val;
		res.end(this.H.t('Hello %s!',[ v.isValid() ? name : 'World' ]));
	}),
});