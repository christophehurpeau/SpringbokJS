var ejs=require('springbokejs');
module.exports={
	type:'template',
	extension:'ejs',
//	compiledExtension:function(file){ file.isBrowser ? 'js': null },
	priority:0,
	
	compile:function(file,data,callback){
		try{
			var prefix=(file.isBrowser?'throw new Error;L.set("'+file.basename.slice(0,-4)+'",':'module.exports='),suffix=(file.isBrowser?')':'');
				contentDev=prefix+ejs.compile(data,{compileDebug:true,server:true}).toString()+suffix,
				contentProd=prefix+ejs.compile(data,{compileDebug:false,server:true}).toString()+suffix;
			callback(null,contentDev,contentProd);
		}catch(error){
			callback(error);
		}
		//callback(null,data,data);
	},
}
