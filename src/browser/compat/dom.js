/*
 * Need called for:
 * Firefox < 11
 * Opera < 10
 * Safari < 4
 * Chrome < 1
 * IE < 10
 */
(function(){
	
	var div =  document.createElement('div'),
		a, input,
		select = document.createElement("select"),
		opt = select.appendChild( document.createElement("option") );;
	
	/* Inspired by jQuery ! Thanks. */
	
	div.innerHTML = "  <a href='/a'>a</a><input type='checkbox'/>";
	div.setAttribute( "className", "t" );
	
	a = div.getElementsByTagName("a")[ 0 ];
	input = div.getElementsByTagName("input")[ 0 ];
	a.style.cssText = "top:1px;float:left;opacity:.5";
	
	// ie6/7
	var isIElt8 = div.className === "t";
	
	
	// http://www.quirksmode.org/dom/w3c_cssom.html
	/* ====> PROPERTIES : S.Elt.propHooks */
	
	/* https://developer.mozilla.org/en-US/docs/Web/API/Node.textContent
	 * IE < 9 */
	
	/* https://developer.mozilla.org/en-US/docs/Web/API/Element.children
	 * Firefox < 3.5, IE < 9 (IE6-8 include comment nodes), Opera < 10, Safari < 4 */
	
	
	
	/* https://developer.mozilla.org/en-US/docs/Web/API/Element.outerHTML
	 * Firefox < 11 */
	S.Elt.propHooks.outerHTML={
		get: function(elt){ throw new Error; },
		set: function(elt, value){ throw new Error; }
	};
	
	//https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
	//TODO : in compat script instead !
	
	//pattern, placeholder, required properties 	(Yes) 	4.0 (2) 	(Yes) 	(Yes) 	(Yes)
	if( input.required === undefined ){
		Elt.propHooks.required={
			get:function(e){
				return e.getAttribute('required');
			},
			set:function(e){
				e.setAttribute('required','required');
				e.required=true;
			}
		};
	}
	
	// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
	if( inputTest.offsetLeft ){
		Elt.propHooks.offsetLeft={
			get:function(e){
				
			}
		};
		Elt.propHooks.offsetTop={
			get:function(e){
				
			}
		};
	}
	
	
	
	if(!document.documentElement.nextElementSibling || !document.documentElement.previousElementSibling){
		var findElementIn = function (elt,propName){
			do {
				elt = elt[ propName ];
			} while ( elt && elt.nodeType !== 1 );
			return elt;
		};
		
		/* https://developer.mozilla.org/en-US/docs/Web/API/ElementTraversal.previousElementSibling */
		S.Elt.propHooks.previousElementSibling={
			get: function(elt){ return findElementIn(elt, 'previousSibling'); },
			set: function(elt, value){ throw new Error; }
		};
		
		/* https://developer.mozilla.org/en-US/docs/Web/API/ElementTraversal.nextElementSibling */
		S.Elt.propHooks.nextElementSibling={
			get: function(elt){ return findElementIn(elt, 'nextSibling'); },
			set: function(elt, value){ throw new Error; }
		};
	};
	
	
	if( window.isIElt9 || !document.documentElement.children ){
		S.Elt.propHooks.children={
			get: function(elt){ throw new Error; }, //TODO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			set: function(elt, value){ throw new Error; }
		};
	}
	
	
	/* input.required
	 * 
	 *  : firefox < 4.0 */
	
	
	
	
	
	if(a.getAttribute("href") === "/a"){
		// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
		'href src'.split(' ').forEach(function(name){
			S.Elt.propHooks[name]={
				get: function(elt){
					return elt.getAttribute( name, 4 );
				}
			};
		});
	}
	
	if(!!document.createElement("form").enctype){
		S.Elt.propHooks.enctype={
			get: function(elt){ S.Elt.getProp(elt, 'encoding'); },
			set: function(elt, value){ S.Elt.setProp(elt, 'encoding', value); },
		};
	}
	
	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	if(opt.selected){
		S.Elt.propHooks.selected={
			get: function(elt){
				var parent = elt.parentNode;
		
				if ( parent ) {
					parent.selectedIndex;
		
					// Make sure that it also works with optgroups
					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
				return elt.selected;
			}
		};
	}
	
	
	
	/* ====> ATTRIBUTES : S.Elt.attrHooks */
	S.Elt.attrHooks.style={
		get: function(elt){
			return elt.style.cssText || undefined;
		},
		set: function(elt, value) {
			return ( elt.style.cssText = value + "" );
		}
	};
	
	
	/* ====> STYLES : S.Elt.styleHooks */
	
	// Internet Explorer opacity
	if (! ("opacity" in document.documentElement.style) && ("filters" in document.documentElement)) {
		S.Elt.styleHooks.opacity = {
			set: function (e, v) {
				var f = e.filters.alpha;
				
				if (!f)
					e.style.filter += " Alpha(opacity=" + (v * 100) + ")";
				else
					f.opacity = v * 100;
				
				// IE has trouble with opacity if it does not have layout
				// Force it by setting the zoom level
				e.style.zoom = 1;
			},
			get: function (e) {
				var f = e.filters.alpha;
				return f ? f.opacity / 100 : 1;
			}
		};
	}
	// Null elements to avoid leaks in IE
	div = a = input = select = opt = null;
	
	
	S.ready(function(){
		var body = document.getElementsByTagName("body")[0];
		if(!body) return;
		
		// Prevent IE 6 from affecting layout for positioned elements
		// Prevent IE from shrinking the body in IE 7 mode
		if(isIElt8) body.style.zoom = 1;
	});
})();
