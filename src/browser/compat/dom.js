/*
 * Need called for:
 * Firefox < 11
 * Opera < 10
 * Safari < 4
 * Chrome < 1
 * IE < 10
 */
(function(){
	var Elt = S.Elt;
	
	/* Override Elt.dom.js methods */
	
	
	if(!window.getComputedStyle){
		
	}
	
	
	S.defineProperty(Elt,'attrHooks',{});
	
	S.defineProperty(Elt,'getAttr', function(elt,name){
		/*#if DEV*/if(elt.nodeType !== NodeTypes.ELEMENT) throw new Error('getAttr not allowed on non-element nodes'); /*#/if*/
		if(Elt.attrHooks[name] && Elt.attrHooks[name].get) return Elt.attrHooks[name].get(elt);
		return elt.getAttribute(name) || null;
	});
	
	S.defineProperty(Elt,'setAttr', function(elt,name,value){
		/*#if DEV*/if(elt.nodeType !== NodeTypes.ELEMENT) throw new Error('setAttr not allowed on non-element nodes'); /*#/if*/
		if(Elt.attrHooks[name] && Elt.attrHooks[name].set) return Elt.attrHooks[name].set(elt,value);
		if(value===null) elt.removeAttribute(name);
		else elt.setAttribute(name,value);
	});
	
	S.defineProperty(Elt,'propHooks',{});
	
	S.defineProperty(Elt,'getProp',function(elt,name){
		/*#if DEV*/if(elt.nodeType !== NodeTypes.ELEMENT && elt.nodeType !== NodeTypes.DOCUMENT) throw new Error('getProp not allowed on non-element nodes'); /*#/if*/
		if(Elt.propHooks[name] && Elt.propHooks[name].get) return Elt.propHooks[name].get(elt);
		return elt[name];
	});
	S.defineProperty(Elt,'setProp',function(elt,name,value){
		/*#if DEV*/if(elt.nodeType !== NodeTypes.ELEMENT) throw new Error('setProp not allowed on non-element nodes'); /*#/if*/
		if(Elt.propHooks[name] && Elt.propHooks[name].set) return Elt.propHooks[name].set(elt,value);
		return elt[name]=value;
	});
	
	if(!document.documentElement.classList || !document.documentElement.classList.add || !document.documentElement.classList.remove){
		S.defineProperty(Elt,'addClass',function(elt,_class){
			var _e_class=Elt.getAttr(elt,'class');
			Elt.setAttr(elt,'class',_e_class ? _e_class+' '+_class : _class);
		});
		
		S.defineProperty(Elt,'removeClass',function(elt,_class){
			if(Elt.hasClass(elt,_class)){
				elt.className = elt.className.replace(new RegExp("(^|\\s)" + _class + "(\\s|$)"), " ").replace(/\s$/, "");
				return true;
			}
			return false;
		});
	}
	if(!document.documentElement.classList || !document.documentElement.classList.contains){
		S.defineProperty(Elt,'hasClass',function(elt,_class){
			/*#if DEV*/
			if(elt.nodeType !== NodeTypes.ELEMENT) throw new Error('hasClass not allowed on non-element nodes');
			if(!S.isString(_class)) throw new Error('className must be a string');
			if(_class.contains(' ')) throw new Error('className must have no spaces');
			/*#/if*/
			if( elt.className && (' ' + elt.className + ' ').indexOf(' ' + _class + ' ') >= 0 )
				return true;
		});
	}
	
	if(!document.documentElement.classList || !document.documentElement.classList.toggle){
		S.defineProperty(Elt,'toggleClass',document.documentElement.classList &&  document.documentElement.classList.contains ? function(elt,_class){
			return !(elt.classList.contains(_class) ? Elt.removeClass(elt,_class) : Elt.addClass(elt,_class));
		} : function(elt,_class){
			return !(Elt.removeClass(elt,_class) || Elt.addClass(elt,_class));
		});
	}
	
	/* Hacks */
	
	
	
	
	
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
