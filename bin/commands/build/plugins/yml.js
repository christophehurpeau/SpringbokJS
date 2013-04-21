var yml=require('./yml/');
module.exports={
	type:'yml',
	extension:'yml',
	priority:0,
	
	compile:function(file,data,callback){
		if(file.path.indexOf('config/')===0) yml.config(file,data,callback);
		else callback(null,data,data);
	}
}
