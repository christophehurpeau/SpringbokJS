includeCore('browser/base/');
includeCore('elements/');
(function(){
	var nbCurrentlyLoaded=0,
		divLoading=$.div().setClass('globalAjaxLoading').text(S.tC('Loading...')),
		loaded=function(callback){
			nbCurrentlyLoaded--;
			if(nbCurrentlyLoaded===0){
				return callback&&callback(true);
			}
			callback&&callback();
		};
	UObj.extend(S,{
		loading:function(block){
			if(nbCurrentlyLoaded===0){
				if(block){
					//block user interaction
					//if(S.isFunc(block)) //cancelable ?
				}
			}
			nbCurrentlyLoaded++;
			return loaded;
		},
	});
})();
