S.require('vL/page','m/todos',function(){
	var UlContainer=S.Form.extend({
		tagName:'ul', _tagContainer:'li',
	})
	
	App.Controller('Site',{
		Index:App.Controller.Action(function(req,res){
			S.log('Site::Index');
			this.layout('page',function(l){
				var form=S.Form.ForModel('Todo');
				
				var ul=$.ul().id('todos').setClass('nobullets');
				$.li().append(
					form.input().placeholder('What needs to be done ?')
						.keydown(function(e){
							if(e.keyCode===keyCodes.ENTER || e.keyCode===keyCodes.NUMPAD_ENTER){
								e.stopPropagation(); e.preventDefault();
								console.log(this);
							}
						})
				).appendTo(ul);
				l.title('todos').content(ul);
				M.Todo.find.all()
					.each(function(todo){
						ul.append(todo.toLi());
					});
			});
		})
	});
});