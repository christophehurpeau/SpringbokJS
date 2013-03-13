module.exports=App.AdminController({
	Index:App.Controller.Action(function(req,res){
		this.table('Page','name,status,created,updated')
			.allowFilters()
			.paginate()
			.actionClick('edit')
			.layout('admin/cms').render('Pages','/Cms/add');//TODO : routes = CMS.add
	}),
	Add:App.Controller.Action(function(req,res){
		var c=this,v=req.validParams(), page=v.model('Page').required().val;
		/*if(!page.title) c.redirect('/Cms');
		else */page.insertNoWait(function(err,page){
			S.log(page);
			if(err) res.end(err.err);
			//else c.redirect('/Cms/edit/'+page.slug);
			else res.end(UDebug.dump(page));
		});
	}),
	Edit:App.Controller.Action(function(req,res){
		var c=this,v=req.validParams(), slug=v.str('slug',1).notEmpty().val;
		c.findOne('Page').byIdNotNull(slug,function(page){
			c.render({page:page});
		});
	})
});