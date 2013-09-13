App.Controller.Action(function(req,H){
	this.layout('page',function(l,c){
		var secure = req.secure();
		if(secure.redirectIfConnected()) return;
		
		var loginFragment = new S.ui.LoginFragment();
		loginFragment.$form.setClass('w400 centered big');
		l.title('Login').content(loginFragment);
	});
})/*#if false*/;/*#/if*/