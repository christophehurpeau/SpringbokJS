includeCore('browser/base/');
includeCore('browser/base/S.loading');
/* 
 * http://stackoverflow.com/questions/7718935/load-scripts-asynchronously
 * http://css-tricks.com/thinking-async/
 */
UObj.extend(S,{
	loadScript:function(src,options,callback,to){
		if(S.isFunc(options) || (!options && !callback)){ callback=options; options={async:true}; }
		var s=document.createElement('script'),r=false;
		s.type = 'text/javascript';
		s.src = src;
		options && UObj.forEach(options,function(k,v){ s[k]=v; });
		s.onload = s.onreadystatechange = function(){
			if(r || (this.readyState && this.readyState != 'complete' && this.readyState != 'loaded')) return;
			r = true;
			s.onload = s.onreadystatechange = null;
			s = undefined;
			callback();
		};
		(to||document.body).appendChild(s);
	},
});