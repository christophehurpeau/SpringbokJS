includeCore('browser/base/S.Ajax');
(function(){
	var required=[],requiring=0;
	S.require=function(){
		requiring++;
		var nbFilesLoaded=0,loaded=S.loading(true),args=arguments,onEnd=Array.pop(args);
		UArray.forEachAsync(args,function(fileName,onEnd){
			if(!UArray.has(required,fileName)){
				required.push(fileName);
				nbFilesLoaded++;
				S.loadScript('/web/'+S.require.prefix+fileName+'.js'/*#if DEV*/+'?'+Date.now()/*#/if*/,{async:true},onEnd);
			}
		},function(){
			loaded(); requiring--;
			S.nextTick(function wait(){
				if(requiring!==0)
					return S.nextTick(wait);
				onEnd&&onEnd(nbFilesLoaded);
			});
		});
	};
	S.require.prefix='';
})();
