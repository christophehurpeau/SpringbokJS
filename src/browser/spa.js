/* Single-Page Application (old springbok.ajax, only the common part with webapp) */



(function(){
	var lastConfirmResult = true;
	document.confirm = function(param){ return lastConfirmResult = window.confirm(param); };
	
	/*var divContainer,divPage,divVariable,divContent,linkFavicon,normalFaviconHref,
		changeLinkFavicon=function(href){
			if(normalFaviconHref) linkFavicon.remove().attr('href',href).appendTo('head')
		};
	S.ready(function(){
		//console.log('AJAX DOCUMENT READY');
		divContainer=$('#container');
		divPage=$('#page');
		linkFavicon=$('head link[rel="icon"],head link[rel="shortcut icon"]');
		normalFaviconHref=linkFavicon.length===0 ? false : linkFavicon.attr('href');
		S.ajax.updateVariable(divPage);
		var mustLoad=!S.history.start();
		S.ajax.init();
		if(mustLoad) S.history.loadUrl();
		
		S.ready=function(callback){ readyCallbacks.add(callback); };
	});*/
	
	S.ready(function(){
		
		
		$document.on('click','a[href]:not([href^="#"]):not([target]):not([href*=":"])',function(evt){
				if(evt.$target.is('a[onclick^="return"]') && !lastConfirmResult) return false;
				evt.preventDefault();
				evt.stopPropagation();
				var a=evt.$target, url = a.attr('href'), confirmMessage = a.attr('data-confirm');
				if(confirmMessage && !confirm(confirmMessage=='1' ? S.tC('Are you sure ?') : confirmMessage)) return false;
				
				var allMenuLinks=$('nav a[href="'+url+'"]');
				var menu=allMenuLinks.closest('nav');
				
				if(menu){
					menu.find('a.current').removeClass('current');
					allMenuLinks.addClass('current');
				}
				
				App.load(url);
				return false;
			})
			.on('click','ul.clickable li[data-url]',function(evt){
				var li=evt.$target,ul=li.closest('ul');
				ul.find('li').removeClass('current');
				li.addClass('current');
				App.load(li.attr('data-url'));
				return false;
			});
	});
})();
