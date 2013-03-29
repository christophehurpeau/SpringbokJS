var _javascript=require('./javascript');
module.exports={
	type:'javascript',
	extension:'js',
	pattern: /\^jsapp$/,
	priority:1,
	
	
	init:function(config){
		console.log(config);
	},
	
	compile:function(file,data,callback){
		
	}
};