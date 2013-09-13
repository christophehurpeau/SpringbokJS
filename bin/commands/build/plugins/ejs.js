var ejs=require('springbokejs');
module.exports={
	type:'template',
	extension:'ejs',
//	compiledExtension:function(file){ file.isBrowser ? 'js': null },
	priority:0,
	
	compile:function(file,data,callback){
	
		var prefix=(file.isBrowser?'throw new Error;L.set("'+file.basename.slice(0,-4)+'",':'module.exports='),suffix=(file.isBrowser?')':'');
		
		var results = {};
		file.forEachOutputs(function(output,type,onEnd){
			try{
				results[output] = results[type] || 
					(results[type] = prefix+ejs.compile(data,{compileDebug:type==='dev',server:true}).toString()+suffix);
				onEnd();
			}catch(error){
				onEnd(error);
			}
		},function(err){
			callback(err,results);
		});
	},
};