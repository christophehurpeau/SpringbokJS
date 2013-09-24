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
	
	
	//https://developer.mozilla.org/en-US/docs/Web/API/window.getComputedStyle : IE <9
	if(!window.getComputedStyle){
		Elt._getStyle = function (elm, property) {
			var prop = Elt._getStyleAlias(property), handler = Elt.styleHooks[prop];
			return ((handler && handler.get) ? handler.get(elm) : elm.currentStyle[prop]);
		};
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
	
	/* Internet Explorer Version */
	
	var ieVersion = (function(){
		//http://msdn.microsoft.com/en-us/library/ms537509%28v=vs.85%29.aspx
		var rv = false; // Return value assumes failure.
		if (navigator.appName == 'Microsoft Internet Explorer'){
			var ua = navigator.userAgent;
			var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) != null)
				rv = parseFloat( RegExp.$1 );
		}
		return rv;
	});
	
	
	/* Hacks */
	
	var support = {};
	
	/* Inspired by jQuery ! Thanks. */
	
	
	var div =  document.createElement('div'),
		a, input,
		select = document.createElement("select"),
		opt = select.appendChild( document.createElement("option") );;
	
	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	
	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		alert('Your browser is way too old ! Not supported.');
		return support;
	}
	
	a = div.getElementsByTagName("a")[ 0 ];
	input = div.getElementsByTagName("input")[ 0 ];
	a.style.cssText = "top:1px;float:left;opacity:.5";
	
	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";
	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";
	
	
	
	S.ready(function(){
		var body = document.getElementsByTagName("body")[0];
		if(!body) return;
		
		// Prevent IE 6 from affecting layout for positioned elements
		// Prevent IE from shrinking the body in IE 7 mode
		if(ieVersion < 8) body.style.zoom = 1;
	});
	/* END jQuery support */
	
	/* Springbok added support */
	
	support.s = {};
	support.s.required = input.required === undefined;
	support.s.offset = !!(input.offsetLeft && input.offsetTop);
	support.s.elementSiblings = !!(document.documentElement.nextElementSibling && document.documentElement.previousElementSibling);
	support.s.elementChildren = !!document.documentElement.children;
	
	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;
	
	
	
	
	
	/* */
	
	// http://www.quirksmode.org/dom/w3c_cssom.html
	/* ====> PROPERTIES : S.Elt.propHooks */
	
	/* https://developer.mozilla.org/en-US/docs/Web/API/Node.textContent
	 * IE < 9 */
	
	/* https://developer.mozilla.org/en-US/docs/Web/API/Element.children
	 * Firefox < 3.5, IE < 9 (IE6-8 include comment nodes), Opera < 10, Safari < 4 */
	
	
	
	/* https://developer.mozilla.org/en-US/docs/Web/API/Element.outerHTML
	 * Firefox < 11 */
	Elt.propHooks.outerHTML={
		get: function(elt){ throw new Error; },
		set: function(elt, value){ throw new Error; }
	};
	
	//https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
	//TODO : in compat script instead !
	
	//pattern, placeholder, required properties 	(Yes) 	4.0 (2) 	(Yes) 	(Yes) 	(Yes)
	if( !support.required ){
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
	if( !support.s.offset ){
		Elt.propHooks.offsetLeft={
			get:function(e){
				throw new Error;
			}
		};
		Elt.propHooks.offsetTop={
			get:function(e){
				throw new Error;
			}
		};
	}
	
	
	if( !support.s.elementSiblings ){
		var findElementIn = function (elt,propName){
			do {
				elt = elt[ propName ];
			} while ( elt && elt.nodeType !== 1 );
			return elt;
		};
		
		/* https://developer.mozilla.org/en-US/docs/Web/API/ElementTraversal.previousElementSibling */
		Elt.propHooks.previousElementSibling={
			get: function(elt){ return findElementIn(elt, 'previousSibling'); },
			set: function(elt, value){ throw new Error; }
		};
		
		/* https://developer.mozilla.org/en-US/docs/Web/API/ElementTraversal.nextElementSibling */
		Elt.propHooks.nextElementSibling={
			get: function(elt){ return findElementIn(elt, 'nextSibling'); },
			set: function(elt, value){ throw new Error; }
		};
	};
	
	
	if( ieVersion < 9 || !support.s.elementChildren ){
		Elt.propHooks.children={
			get: function(elt){ throw new Error; }, //TODO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			set: function(elt, value){ throw new Error; }
		};
	}
	
	
	if( !support.hrefNormalized ){
		// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
		'href src'.split(' ').forEach(function(name){
			Elt.propHooks[name]={
				get: function(elt){
					return elt.getAttribute( name, 4 );
				}
			};
		});
	}
	
	if( !support.enctype ){
		Elt.propHooks.enctype={
			get: function(elt){ Elt.getProp(elt, 'encoding'); },
			set: function(elt, value){ Elt.setProp(elt, 'encoding', value); },
		};
	}
	
	if( !support.optSelected ){
		Elt.propHooks.selected={
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
	Elt.attrHooks.style={
		get: function(elt){
			return elt.style.cssText || undefined;
		},
		set: function(elt, value) {
			return ( elt.style.cssText = value + "" );
		}
	};
	
	
	if( !support.radioValue ){
		Elt.attrHooks.type={
			set: function(elt, value){
				if(value === 'radio' && Elt.nodeName(elt) === 'input'){
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elt.value;
					elt.setAttribute('type',value);
					if(val) elt.value = val;
					return value;
				}else{
					elt.setAttribute('type',value);
				}
			}
		};
	}
	
	// fix oldIE attroperties
	var nodeHookSet;
	if( !support.getSetInput || !support.getSetAttribute ){
		Elt.attrHooks.value = {
			set: function(elt, value){
				if(Elt.nodeName(elt) === 'input'){
					elt.defaultValue = value;
					elt.setAttribute('value',value);
				}else{
					if(nodeHookSet) nodeHookSet(elt,value,'value');
					else elt.setAttribute('value',value);
				}
			}
		};
	}
	
	// IE6/7 do not support getting/setting some attributes with get/setAttribute
	//maybe already handled by base2 ?
	if( !support.getSetAttribute ){
		// Use this for any attribute in IE6/7
		// This fixes almost every IE6/7 issue
		nodeHookSet = function(elt, value, name){
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		};
		
		
	}
	
	
	
	
	/* ====> STYLES : S.Elt.styleHooks */
	
	// Internet Explorer opacity
	if (! ("opacity" in document.documentElement.style) && ("filters" in document.documentElement)) {
		Elt.styleHooks.opacity = {
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
})();
