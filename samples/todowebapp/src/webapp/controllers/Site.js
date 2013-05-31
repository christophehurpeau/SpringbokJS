App.Controller({
	Index:App.Controller.Action(function(req,res){
		this.layout('default').title('todos')
			.top('<h1>todos</h1>')
			.content(M.Todo.find.all().toUl())
	})
});