includeCore('browser/base/S.Ajax');
(function(){
	var required=[],nbFilesLoaded=0,requiring=0,callbacks=[];
	S.require=function(){
		S.log('S.require [requiring='+requiring+', nbFilesLoaded='+nbFilesLoaded+']');
		S.require.increment();
		var loaded=S.loading(true),args=arguments,onEnd=Array.pop(args);
		callbacks.push(onEnd);
		UArray.forEachAsync(args,function(fileName,onEnd){
			if(!UArray.has(required,fileName)){
				required.push(fileName);
				nbFilesLoaded++;
				S.loadScript('/web/'+S.require.prefix+fileName+'.js'/*#if DEV*/+'?'+Date.now()/*#/if*/,{async:true},onEnd);
			}
		},function(){
			loaded();
			S.log('S.require END [requiring='+(requiring-1)+', nbFilesLoaded='+nbFilesLoaded+'] ; callbacks=',callbacks);
			S.require.decrement();
		});
	};
	S.require.prefix='';
	S.require.increment=function(){ requiring++; };
	S.require.decrement=function(){
		requiring--;
		if(requiring===0 && callbacks){
			for(var c;c=callbacks.pop();)
				c(nbFilesLoaded);
			nbFilesLoaded=0;
		}
	};
})();
