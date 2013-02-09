module.exports=App.AdminController({
	Index:App.Controller.Action(function(req,res){
		this.table('Page','name,status,created,updated')
			.allowFilters()
			.paginate()
			.actionClick('edit')
			.layout('admin/cms').render('Pages','/Cms/add');//TODO : routes = CMS.add
	}),
	Add:App.Controller.Action(function(req,res){
		var c=this,v=req.validParams(), page=v.model('Page').val;
		/*if(!page.title) c.redirect('/Cms');
		else */page.save(function(err,page){
			if(err) res.end(err.err);
			else c.redirect('/Cms/edit/'+page.slug);
		});
	}),
	Edit:App.Controller.Action(function(req,res){
		var c=this,v=req.validParams(), slug=v.str('slug',1).notEmpty().val;
		c.findOne('Page').byIdNotNull(slug,function(page){
			c.render({page:page});
		});
	})
});