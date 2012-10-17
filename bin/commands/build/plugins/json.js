var json=require('./json/');
module.exports={
	type:'json',
	extension:'json',
	
	compile:function(file,data,callback){
		if(file.path.indexOf('config/')===0) json.config(file,data,callback);
		else callback(null,data,data);
	}
}
