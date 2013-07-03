/* http://documentcloud.github.com/backbone/backbone.js */
S.History=(function(){
	var started=false;
	
	// Cached regex for stripping a leading hash/slash and trailing space.
	var routeStripper = /^[#\/]|\s+$/g;
	
	var _hasPushState= window.history && window.history.pushState;
	return {
		start:function(){
			if (started) throw new Error/*#if DEV*/("history has already been started")/*#/if*/;
			started=true;
			
			var fragment=this.getFragment(),docMode=document.documentMode;
			
			if(OLD_IE){
				this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
				this.navigate(fragment);
			}
			
			// Depending on whether we're using pushState or hashes, and whether
			// 'onhashchange' is supported, determine how we check the URL state.
			if(_hasPushState) $(window).bind('popstate', this.checkUrl);
			else if(('onhashchange' in window) && !OLD_IE) $(window).bind('hashchange', this.checkUrl);
			else this._checkUrlInterval=setInterval(this.checkUrl,50);
			
			// Determine if we need to change the base url, for a pushState link
			// opened by a non-pushState browser.
			this.fragment = fragment;
			var loc = window.location;
			
			// If we've started out with a hash-based route, but we're currently
			// in a browser where it could be `pushState`-based instead...
			if (_hasPushState && loc.hash && loc.pathname==='/') {
				this.fragment = this.getHash().replace(routeStripper, '');
				loc.hash='';
				window.history.replaceState({fragment:this.fragment},document.title,loc.protocol + '//' + loc.host + baseUrl + this.fragment);
				return false;
			}
			return _hasPushState || fragment==='';
		},
		
		getHash:function(windowOverride){
			var match = (windowOverride||window).location.href.match(/#\/(.*)$/);
			return match ? match[1] : '';
		},
		
		getFragment:function(fragment){
			if(fragment == null){
				if(_hasPushState){
					fragment=window.location.pathname;
					var search=window.location.search;
					if(search) fragment+=search;
				}else fragment=this.getHash();
			}
			if(fragment.startsWith(baseUrl)) fragment=fragment.substr(baseUrl.length);
			return fragment.replace(routeStripper,'');
		},
		
		
		// Checks the current URL to see if it has changed, and if it has,
		// calls `loadUrl`, normalizing across the hidden iframe.
		checkUrl:function(e){
			var history=S.History, current = history.getFragment();
			if(OLD_IE && current == history.fragment && history.iframe) current = history.getFragment(history.getHash(history.iframe));
			if(current == history.fragment) return false;
			if(history.iframe) history.navigate(current);
			history.loadUrl();
		},
		
		// Attempt to load the current URL fragment.
		loadUrl:function(fragmentOverride,state){
			var fragment = baseUrl+( this.fragment = this.getFragment(fragmentOverride));
			if(fragment){
				var a=$('a[href="'+fragment+'"]');
				a.length===0 ? S.redirect(fragment) : a.click();
			}
		},
		
		
		navigate:function(fragment,replace){
			var frag = (fragment || '').replace(routeStripper, ''),loc=window.location;
			if(frag.charAt(0)==='?') frag=loc.pathname+frag;
			if(this.fragment == frag) return;
			if(window._gaq) _gaq.push(['_trackPageview',frag]);
			
			if(frag.startsWith(baseUrl)) frag=frag.substr(baseUrl.length);
			if(this.fragment == frag) return;
			
			this.fragment=frag;
			if(_hasPushState){
				//if(console && console.log) console.log('push: '+loc.protocol + '//' + loc.host + baseUrl+frag);
				//var title=document.title;
				window.history[replace?'replaceState':'pushState']({},document.title, loc.protocol+'//'+loc.host + baseUrl+frag);
			}else{
				this._updateHash(loc,frag,replace);
				if(OLD_IE && this.iframe && (frag != this.getFragment(this.iframe.location.hash))){
					if(!replace) this.iframe.document.open().close();
					this._updateHash(this.iframe.location,frag,replace);
				}
			}
		},
		_updateHash:function(location,fragment,replace){
			replace ? location.replace(location.toString().replace(/(javascript:|#).*$/, '') + '#/' + fragment) : location.hash = '/'+fragment; 
		}
	};
})();