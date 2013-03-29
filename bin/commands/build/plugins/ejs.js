var ejs=require('springbokejs');
module.exports={
	type:'template',
	extension:'ejs',
//	compiledExtension:'js',
	priority:0,
	
	compile:function(file,data,callback){
		try{
			var contentDev='module.exports='+ejs.compile(data,{compileDebug:true,server:true}).toString(),
				contentProd='module.exports='+ejs.compile(data,{compileDebug:false,server:true}).toString();
			callback(null,contentDev,contentProd);
		}catch(error){
			callback(error);
		}
		//callback(null,data,data);
	},
}
