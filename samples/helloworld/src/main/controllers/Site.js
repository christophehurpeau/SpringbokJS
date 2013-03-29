module.exports=function(App){
	return App.Controller.extend({
		Index:function(req,res){
			var v=req.validParams(), name=v.str('name',1).notEmpty().val;
			res.end('Hello '+name+' !');
		}
	});
};