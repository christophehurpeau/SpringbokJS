var jade=require('jade');
module.exports={
	type:'template',
	extension:'jade',
	
	compile:function(file,data,callback){
		try{
			var contentDev=jade.compile(data,{compileDebug:true,pretty:false,client:true,filename:file.path}),
				contentProd=jade.compile(data,{compileDebug:false,pretty:false,client:true});
			callback(null,contentDev,contentProd);
		}catch(error){
			callback(error);
		}
	},
}
