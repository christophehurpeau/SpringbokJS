module.exports=App.AdminController({
	Index:App.Controller.Action(function(req,res){
		this.table('Page','name,status,created,updated')
			.allowFilters()
			.paginate()
			.actionClick('edit')
			.layout('admin/cms').render('Pages','/Cms/add');//TODO : routes = CMS.add
	}),
	Add:App.Controller.Action(function(req,res){
		var v=req.validParams(), page=v.model('Page').val;
		this.renderText(JSON.stringify(page));
		
	}),
	Edit:App.Controller.Action(function(req,res){
		var v=req.validParams(), slug=v.str('slug',1).notEmpty().val;
		var page=M.Page.ById(slug)
		req.notFoundIfFalse(page);
		this.render([page]);
	})
});