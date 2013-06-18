S.require('vL/page','m/todos',function(){
	App.Controller('Site',{
		Index:App.Controller.Action(function(req,res){
			S.log('Site::Index');
			this.layout('page',function(l){
				var ul=$.ul();
				ul.append($.li().html('What needs to be done ?'));
				l.title('todos').content(ul);
				M.Todo.find.all()
					.each(function(todo){
						ul.append(todo.toLi());
					});
			});
		})
	});
});