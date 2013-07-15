includeCore('enums/keyCodes');
S.require('vL/default','m/todos',function(){
	var UlContainer=S.Form.extend({
		tagName:'ul', _tagContainer:'li',
	})
	
	App.Controller('Site',{
		Index:App.Controller.Action(function(req,H){
			this.layout('default',function(l){
				var form=H.FormForModel('Todo');
				
				var ul=$.ul().id('todos').setClass('nobullets');
				$.li().append(
					form.input('name').placeholder('What needs to be done ?')
						.on('keydown',function(e){
							if(e.keyCode===keyCodes.ENTER || e.keyCode===keyCodes.NUMPAD_ENTER){
								e.stopPropagation(); e.preventDefault();
								var input=$(this);// transform a dom element into a element wrapper
								//validation
								//TODO validation
								if(input.val()){
									//add the new todo in the database and in the html
									M.Todo.create(input.val(),function(todo,request){
										ul.append(todo.toLi());
									});
									input.val('');
								}
							}
						})
				).appendTo(ul);
				l.title('todos').content(ul);
				M.Todo.find.all()
					.each(function(todo){
						ul.append(todo.toLi());
					});
			});
		}),
		RedirectToIndex:App.Controller.Action(function(req,H){
			H.redirect('/');
		})
	});
});
