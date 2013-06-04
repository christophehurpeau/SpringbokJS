includeCore('browser/base/S.Ajax');
(function(){
	var required=[];
	S.require=function(onEnd){
		var nbFilesLoaded=0,loaded=S.loading(true);
		UArray.forEachAsync(arguments,function(fileName,onEnd){
			if(!UArray.has(required,fileName)){
				required.push(fileName);
				nbFilesLoaded++;
				S.loadScript('/web/js/'+S.require.prefix+fileName+'.js'/*#if DEV*/+'?'+(new Date().getTime())/*#/if*/,{async:true},onEnd);
			}
		},function(){
			loaded();
			onEnd(nbFilesLoaded);
		});
	};
	S.require.prefix='';
})();
