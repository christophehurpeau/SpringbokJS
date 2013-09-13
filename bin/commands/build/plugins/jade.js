var jade=require('jade');
module.exports={
	type:'template',
	extension:'jade',
	priority:-1,
	
	compile:function(file,data,callback){
		var results = {};
		file.forEachOutputs(function(output,type,onEnd){
			try{
				results[output] = results[type] || 
					(results[type] = jade.compile(data,{compileDebug:type==='dev',pretty:false,server:true}));
				onEnd();
			}catch(error){
				onEnd(error);
			}
		},function(err){
			callback(err,results);
		});
	},
};