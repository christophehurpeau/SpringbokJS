S.extObj(S,{
	nextTick:((/* NODE||BROWSER */process.nextTick||function(fn){ setTimeout(fn,0); })),
	asyncForEach:function(arr, iterator, callback){
		if(!arr.length) return callback();
		
		var l=arr.length,completed=0;
		arr.forEach(function(x){
			iterator(x,function(err){
				if (err) {
					callback(err);
					callback = function () {};
				}else{
					completed += 1;
					if(completed === l)
						callback(null);
				}
			});
		});
	},
	asyncObjForEach:function(obj,iterator,callback){
		S.asyncForEach(Object.keys(obj),
			function(k,onEnd){ iterator(k,obj[k],onEnd); },callback);
	}
});
