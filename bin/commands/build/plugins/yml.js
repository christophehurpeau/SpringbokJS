var yml=require('./yml/');
module.exports={
	type:'yml',
	extension:'yml',
	priority:0,
	
	compile:function(file,data,callback){
		if(file.isWebApp) return callback(false);
		if(file.path.indexOf('config/')===0) return yml.config(file,data,callback);
		return callback(null,data,data);
	}
}
