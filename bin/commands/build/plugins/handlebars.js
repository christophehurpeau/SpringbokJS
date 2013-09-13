

module.exports={
	type:'template',
	extension:'hbs',
	pattern: /\.(?:hbs|handlebars)$/,
	priority:-1,
	
	include:[__dirname+'/../../../../vendor/handlebars-1.0.rc.1.js'],
	
	compile:function(data,path,callback){
		try{
			var content=handlebars.precompile(data);
			callback(null,"module.exports=Handlebars.template("+content+");");
		}catch(error){
			callback(error);
		}
	},
};