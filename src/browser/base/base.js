// may be used later
var S_loadSyncScript=function(path){
	var xhr=new XMLHttpRequest;
	xhr.open('GET',baseUrl+'web/'+path+'.js', false);
	xhr.send();
	if(xhr.status !== 200) new FatalError(/*#if DEV*/'Unable to load: '+path+'.js'/*#/if*/); 
	var s = document.createElement('script');
	s.type = "text/javascript";
	s.text = xhr.responseText;
	document.getElementsByTagName('head')[0].appendChild(s);
};
if(OLD_IE){
	//include Core('es5-compat.src');
}else{
	//http://kangax.github.com/es5-compat-table/
	if(!Object.keys || !String.contains || !(window.Map && window.Map.prototype.forEach)){ // not String.prototype.contains : the generic version
		//$.ajax({ url:webUrl+'js/es5-compat.js', global:false, async:false, cache:true, dataType:'script' });
		Object.keys || S_loadSyncScript('compat/es5');
		S_loadSyncScript('compat/es6');
	}
}

includeCoreUtils('index');
includeCoreUtils('UObj');
includeCoreUtils('UArray');
includeCoreUtils('UString/');
includeCoreUtils('Callbacks/CallbacksOnce');

UObj.extend(S,{
	ready:function(callback){
		if(!this.readyCallbacks){
			if(document.readyState === "complete" )
				return setTimeout(callback);
			
			this.readyCallbacks=new CallbacksOnce();
			var detach,onReady=function(){
				detach();
				this.readyCallbacks.fire();
				delete this.readyCallbacks;
			};
			
			if(!OLD_IE){
				detach=function(){
					document.removeEventListener('DOMContentLoaded',onReady);
					window.removeEventListener('load',onReady);
				};
				
				// Use the handy event callback
				document.addEventListener( "DOMContentLoaded", onReady, false );
				// A fallback to window.onload, that will always work
				window.addEventListener( "load", onReady, false );
			}else{
				if(document.addEventListener){
					detach=function(){
						document.removeEventListener('DOMContentLoaded',onReady);
						window.removeEventListener('load',onReady);
					};
					
					// Use the handy event callback
					document.addEventListener( "DOMContentLoaded", onReady, false );
					// A fallback to window.onload, that will always work
					window.addEventListener( "load", onReady, false );
				}else{
					var top=false, isReady=false,onReadyIE=function(){
						isReady=true;
						onReady();
					},completed=function(){
						if(event.type === "load" || document.readyState === "complete" )
							onReadyIE();
					};
					
					// Ensure firing before onload, maybe late but safe also for iframes
					document.attachEvent( "onreadystatechange", completed );
					// A fallback to window.onload, that will always work
					window.attachEvent( "onload", completed );
					
					// If IE and not a frame
					try{
						top = window.frameElement == null && document.documentElement;
					}catch(e){}
					
					if(top && top.doScroll){
						(function doScrollCheck() {
							if( !isReady ){
								try {
									// Use the trick by Diego Perini
									// http://javascript.nwbox.com/IEContentLoaded/
									top.doScroll("left");
								} catch(e) {
									return setTimeout( doScrollCheck, 50 );
								}
								
								onReadyIE();
							}
						})();
					}
				}
			}
		}
	},
});