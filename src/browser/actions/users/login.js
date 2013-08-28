App.Controller.Action(function(req,H){
	this.layout('page',function(l,c){
		var form = H.FormForModel('User'), secure = req.secure();
		if(secure.redirectIfConnected()) return;
		l.title('Login')
			.content(
				new LoginWidget()
			);
	});
})/*#if false*/;/*#/if*/