S.ui.LoginWidget = S.Elt.Widget.extend({
	ctor:function(){
		S.Elt.Widget.call(this);
		
		this.append(
			this.$form = App.helpers.FormForModel('User').action('/site/login')
				.fieldsetStart()
					.input('_id').label('Username').placeholder('Enter your username').end()
					.input('pwd').end()
					.submit('Login').container().addClass('center').end()
				.end(false)
				.onSubmit(function($form,onEnd){
					var pError=$form.find('p.error');
					pError && pError.empty();
					S.post('/api/site/login').form($form).send(function(data){
						if(data === '0'){
							pError=pError||$.p().setClass('message error').appendTo($form[0].firstChild);
							pError.text('Authentification failed !');
							onEnd();
						}else{
							var secure = App.secure();
							secure.setConnected(data.userId,data.token);
							secure.redirectAfterConnection();
						}
					});
				})
		);
	},
	
});
