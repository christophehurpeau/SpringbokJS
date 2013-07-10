App.Request = S.newClass({
	check:function(){
		if(this.secure().checkAccess()) throw new S.Controller.Stop();
	},
	
	redirect:function(to,exit){
		App.load(to);
		if(exit) throw new S.Controller.Stop();
	},
});