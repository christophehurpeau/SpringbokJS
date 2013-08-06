/* https://raw.github.com/julienw/dollardom/master/dollardom-full.debug.js */

var _regexp_get_alias = /-(\w)/g, _regexp_singleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
var _getStyle = window.getComputedStyle ?
		function (elm, property) {
			var prop = _getStyleAlias(property), handler = Elt.styleHooks[property];
			if(handler && handler.get) return handler.get(elm);
			var computed = getComputedStyle(elm, null);
			return computed.getPropertyValue(property) || computed[property];
		}
	:
		function (elm, property) {
			var prop = _getStyleAlias(property), handler = Elt.styleHooks[prop];
			return ((handler && handler.get) ? handler.get(elm) : elm.currentStyle[prop]);
		}
	,
	styleAlias = {  },
	_getStyleAlias=function(property){
		return styleAlias[property] || (styleAlias[property] = property.replace(_regexp_get_alias, function (m, l) { return l.toUpperCase(); }));
	};

var optionValue=function(){
	var val=Elt.getAttr(elt,'value');
	return val != null ? val : elt.text;
};


Elt.attrHooks={};
Elt.propHooks={};
Elt.styleAlias={ 'float': "cssFloat" in document.documentElement.style ? "cssFloat" : "styleFloat"};
Elt.styleHooks={
	borderWidth: {
		get: function(e){
			return _getStyle(e, "border-left-width");
		}
	},
	padding: {
		get: function (e) {
			return _getStyle(e, "padding-left");
		}
	},
	margin: {
		get: function (e) {
			return _getStyle(e, "margin-left");
		}
	}
};

(function(){
	var inputTest=document.createElement('input');
	
	//https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
	//TODO : in compat script instead !
	
	//pattern, placeholder, required properties 	(Yes) 	4.0 (2) 	(Yes) 	(Yes) 	(Yes)
	if( inputTest.required === undefined ){
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
		}
	}
	
	inputTest=null;
})();

//var eventChange=new Event('change');

UObj.extend(Elt,{
	/* NODE ATTRIBUTES AND PROPERTIES */
	nodeName:function(elt){
		return elt.nodeName.toLowerCase();
	},
	
	attrs:function(elt,attrs){
		for(var key in attrs) Elt.setAttr(elt,key,attrs[key]);
	},
	getAttr:function(elt,name){
		/*#if DEV*/if(elt.nodeType !== NodeTypes.ELEMENT) throw new Error('getAttr not allowed on non-element nodes'); /*#/if*/
		if(Elt.attrHooks[name] && Elt.attrHooks[name].get) return Elt.attrHooks[name].get(elt);
		return elt.getAttribute(name) || null;
	},
	setAttr:function(elt,name,value){
		/*#if DEV*/if(elt.nodeType !== NodeTypes.ELEMENT) throw new Error('setAttr not allowed on non-element nodes'); /*#/if*/
		if(value===null) elt.removeAttribute(name);
		else elt.setAttribute(name,value);
	},
	getProp:function(elt,name){
		/*#if DEV*/if(elt.nodeType !== NodeTypes.ELEMENT) throw new Error('getProp not allowed on non-element nodes'); /*#/if*/
		if(Elt.propHooks[name] && Elt.propHooks[name].get) return Elt.propHooks[name].get(elt);
		return elt[name];
	},
	setProp:function(elt,name,value){
		/*#if DEV*/if(elt.nodeType !== NodeTypes.ELEMENT) throw new Error('setProp not allowed on non-element nodes'); /*#/if*/
		if(Elt.propHooks[name] && Elt.propHooks[name].set) return Elt.propHooks[name].set(elt,value);
		return elt[name]=value;
	},
	
	removeAttr:function(elt){
		/*#if DEV*/if(elt.nodeType !== NodeTypes.ELEMENT) throw new Error('removeAttr not allowed on non-element nodes'); /*#/if*/
		elt.removeAttribute(attrName);
	},
	setClass:function(elt,$class){
		Elt.setAttr(elt,'class',$class);
	},
	id:function(elt,id){
		Elt.setAttr(elt,'id',id);
	},
	addClass: document.documentElement.classList && document.documentElement.classList.add ? function(elt,_class){
		elt.classList.add(_class);
	} : function(elt,_class){
		var _e_class=Elt.getAttr(elt,'class');
		Elt.setAttr(elt,'class',_e_class ? _e_class+' '+_class : _class);
	},
	hasClass: (document.documentElement.classList && document.documentElement.classList.contains ? function(elt,_class){
		elt.classList.contains(_class);
	} : function(elt,_class){
		/*#if DEV*/
		if(elt.nodeType !== NodeTypes.ELEMENT) throw new Error('hasClass not allowed on non-element nodes');
		if(!S.isString(_class)) throw new Error('className must be a string');
		if(_class.contains(' ')) throw new Error('className must have no spaces');
		/*#/if*/
		if( elt.className && (' ' + elt.className + ' ').indexOf(' ' + _class + ' ') >= 0 )
			return true;
	}),
	removeClass: (document.documentElement.classList && document.documentElement.classList.contains ? function(elt,_class){
		elt.classList.remove(_class);
	} : function(elt,_class){
		if(Elt.hasClass(elt,_class)){
			elt.className = elt.className.replace(new RegExp("(^|\\s)" + _class + "(\\s|$)"), " ").replace(/\s$/, "");
			return true;
		}
		return false;
	}),
	
	toggleClass: (document.documentElement.classList && document.documentElement.classList.toggle ? function(elt,_class){
		elt.classList.toggle(_class);
	} : (document.documentElement.classList &&  document.documentElement.classList.contains ? function(elt,_class){
			elt.classList.contains(_class) ? Elt.removeClass(elt,_class) : Elt.addClass(elt,_class);
		} : function(elt,_class){
			Elt.removeClass(elt,_class) || Elt.addClass(elt,_class);
		})
	),
	
	getVal:function(elt){
		switch(Elt.nodeName(elt)){
			//case 'input':
				/* even for radio and checkbox : we want to return value */
			//	return elt.value;
			case 'select':
				var options = elem.options, index = elem.selectedIndex;
				if(elem.type === "select-one")
					return index >= 0 ? Elt.getVal(options[index]) : null;
				
				var values=[];
				for (var i = 0, length = options.length; i < length; i++) {
					var opt = options[i];
					if (opt.selected) values.push(optionValue(opt));
				}
				return values;
				
			case 'option':
				return optionValue(elt);
		}
		return elt.value;
	},
	setVal:function(elt,value){
		switch(Elt.nodeName(elt)){
			case 'input':
				switch(elt.type){
					case 'checkbox':
					case 'radio':
						elt.checked=!!value;
						break;
					default:
						elt.value=''+value;
						break;
				}
				break;
			case 'select':
				var options = elt.options;
				if(!S.isFunc(value))
					value=S.isArray(value) ? function(value){ return values.indexOf(value)!==-1; }.bind(value)
								: function(value){ return this===value; }.bind(value);
				for (var i = 0, length = options.length; i < length; i++) {
					var opt = options[i];
					opt.selected = value(optionValue(opt));
				}
				break;
				
			case 'option':
				throw new Error;
				//Todo : Elt.setVal(option. [ select parent ],optionValue(opt))
			default:
				throw new Error;
		}
		//elt.dispatchEvent(eventChange);
	},
	
	getStyle:function(elt,prop){
		return _getStyle(elt,prop) || 0;
	},
	
	setStyle:function(elt,prop,value){
		var prop = _getStyleAlias(prop), hook = Elt.styleHooks[prop];
		return (hook && hook.set) ? hook.set(elt, value) : elt.style[prop] = value;
	},
	
	
	is:function(elt,selectors){
		var matchesSelector=elt.webkitMatchesSelector || elt.mozMatchesSelector || elt.oMatchesSelector || elt.matchesSelector || elt.matches;
		if (matchesSelector) return matchesSelector.call(elt, selectors);
		// fall back to performing a selector: TODO : this doesnt work
		return $(selector,elt.parentNode).indexOf(elt)
	},
	
	isEditable:function(elt){
		if(Elt.nodeName(elt) === 'input')
			return !elt.disabled && !elt.readonly;
	},
	
	/* // now use FormData !
	serialize:function(elt){
		if(!elt.elements) throw new Error;
		var res='';
		Array.forEach(elt.elements,function(e){
			if(!e.name || e.disabled || e.type == 'file' || e.type == 'submit') return;
			var value=Elt.hasClass(e,'placeholder') ? '' : Elt.getVal(e);
			if(value != null)
				res+='&'+encodeURIComponent(e.name)+'='
					+encodeURIComponent(value.replace(/(\r)?\n/,'\r\n')).replace('%20','+');
		});
		return res && res.substr(1);
	},
	*/
	formData:function(e){
		return new FormData(e);
	},
	
	/* VISIBILITY */
	
	isVisible:function(e){
		return e.style.display !== 'none';
	},
	
	hide:function(e){
		Elt.addClass(e,'hidden');
	},
	show:function(e){
		if(e.style.display==='none') e.style.display = '';
		Elt.removeClass(e,'hidden');
	},
	
	/* MANIPULATION */
	
	/** Completely removes element from the document */
	remove:function(e){
		if(e.parentNode != null)
			e.parentNode.removeChild(e);
	},
	
	/* content */
	doc:function(elt){ return elt && elt.ownerDocument || document; },
	
	text:function(e,content){ Elt.empty(e); Elt.appendText(e,content); },
	html:function(e,content){ Elt.empty(e); e.innerHTML=content; },
	appendText:function(e,content){ Elt.append(e,Elt.doc(e).createTextNode(content)); },
	prependText:function(e,content){ Elt.prepend(e,Elt.doc(e).createTextNode(content)); },
	empty:function(e){
		if(e.nodeType == NodeTypes.ELEMENT)
			$.disposeElements($.getAll(e,false))
		while( e.firstChild )
			e.removeChild( e.firstChild );
	},
	
	append:function(e,child){
		/*#if DEV*/
		if(!UArray.has([NodeTypes.ELEMENT,NodeTypes.DOCUMENT_FRAGMENT,NodeTypes.DOCUMENT],e.nodeType))
			throw new Error('append not allowed on non-element|document nodes');
		/*#/if*/
		//for(var i=0,l=content.length;i<l;i++)
		//	e.appendChild(content[i]);
		e.appendChild(child.nodeType ? child : (S.isString(child) ? Elt.parse(child) : child[0]));
	},
	prepend:function(e,child){
		this.appendBefore(e,e.firstChild,child);
	},
	
	appendBefore:function(e,node,child){
		/*#if DEV*/
		if(!UArray.has([NodeTypes.ELEMENT,NodeTypes.DOCUMENT_FRAGMENT,NodeTypes.DOCUMENT],e.nodeType))
			throw new Error('append not allowed on non-element|document nodes');
		/*#/if*/
		e.insertBefore(child.nodeType ? child : (S.isString(child) ? Elt.parse(child) : child[0]),node.nodeType ? node : node[0]);
	},
	
	appendTo:function(e,parent){
		Elt.append(parent.nodeType ? parent : (S.isString(parent) ? Elt.parse(parent) : parent[0]),e);
	},
	prependTo:function(e,parent){
		Elt.prepend(parent.nodeType ? parent : (S.isString(parent) ? Elt.parse(parent) : parent[0]),e);
	},
	
	parse:function(string,context){
		context=context||document;
		var parsed = _regexp_singleTag.exec( string );
		if ( parsed ) return context.createElement(parsed[1]);
		
		var fragment = document.createDocumentFragment(),
			tmp = fragment.appendChild( context.createElement("div") ),
			node;
		tmp.innerHTML=string;
		while(node=tmp.firstChild)
			fragment.appendChild(node);
		fragment.removeChild(tmp);
		return fragment;
	},
});
Elt.setAttrs=Elt.attrs;