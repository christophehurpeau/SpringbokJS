App.Controller.Action(function(req,H){
	this.layout('page',function(l,c){
		var secure = req.secure();
		if(secure.redirectIfConnected()) return;
		
		var loginWidget = new S.ui.LoginWidget();
		loginWidget.$form.setClass('w400 centered big');
		l.title('Login').content(loginWidget);
	});
})/*#if false*/;/*#/if*/