module.exports=function(App){
	return App.Controller.extend({
		Index:function(req,res){
			req.route.nParams.slug='Accueil';
			this.View(req,res);
		},
		View:function(req,res){
			var v=req.validParams(), slug=v.str('slug',1).notEmpty().val;
			//res.end('Page '+slug);
			this.render({slug:slug},'View');
		}
	});
};