/* https://raw.github.com/julienw/dollardom/master/dollardom-full.debug.js */

var _regexp_get_alias = /-(\w)/g, _regexp_singleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;

Elt._getStyle = function (elm, property) {
	var prop = Elt._getStyleAlias(property), handler = Elt.styleHooks[property];
	if(handler && handler.get) return handler.get(elm);
	var computed = getComputedStyle(elm, null);
	return computed.getPropertyValue(property) || computed[property];
};
Elt._getStyleAlias=function(property){
	return Elt.styleAlias[property] || (Elt.styleAlias[property] = property.replace(_regexp_get_alias, function (m, l) { return l.toUpperCase(); }));
};

var optionValue=function(){
	var val=Elt.getAttr(elt,'value');
	return val != null ? val : elt.text;
};


Elt.styleAlias={ 'float': "cssFloat" in document.documentElement.style ? "cssFloat" : "styleFloat"};
Elt.styleHooks={};

//var eventChange=new Event('change');

UObj.extend(Elt,{
	/* NODE ATTRIBUTES AND PROPERTIES */
	nodeName:function(elt){
		return elt.nodeName.toLowerCase();
	},
	
	attrs:function(elt,attrs){
		for(var key in attrs) Elt.setAttr(elt,key,attrs[key]);
	},
	/** Overrided in dom.js */
	getAttr:function(elt,name){
		/*#if DEV*/if(elt.nodeType !== NodeTypes.ELEMENT) throw new Error('getAttr not allowed on non-element nodes'); /*#/if*/
		return elt.getAttribute(name) || null;
	},
	/** Overrided in dom.js */
	setAttr:function(elt,name,value){
		/*#if DEV*/if(elt.nodeType !== NodeTypes.ELEMENT) throw new Error('setAttr not allowed on non-element nodes'); /*#/if*/
		value===null ? elt.removeAttribute(name) : elt.setAttribute(name,value);
	},
	/** Overrided in dom.js */
	getProp:function(elt,name){
		/*#if DEV*/if(elt.nodeType !== NodeTypes.ELEMENT && elt.nodeType !== NodeTypes.DOCUMENT) throw new Error('getProp not allowed on non-element nodes'); /*#/if*/
		return elt[name];
	},
	/** Overrided in dom.js */
	setProp:function(elt,name,value){
		/*#if DEV*/if(elt.nodeType !== NodeTypes.ELEMENT) throw new Error('setProp not allowed on non-element nodes'); /*#/if*/
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
	
	/** Overrided in dom.js */
	addClass: function(elt,_class){
		elt.classList.add.apply(elt.classList,_class.split(' '));
	},
	/** Overrided in dom.js */
	hasClass: function(elt,_class){
		return elt.classList.contains(_class);
	},
	/** Overrided in dom.js */
	removeClass: function(elt,_class){
		var oldLength = elt.classList.length;
		elt.classList.remove(_class);
		return oldLength !== elt.classList.length;
	},
	
	/** Overrided in dom.js | return true if added, false if removed */
	toggleClass: function(elt,_class){
		elt.classList.toggle(_class);
	},
	
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
		return Elt._getStyle(elt,prop);
	},
	getIntStyle: function(elt,prop){
		return parseInt(Elt._getStyle(elt,prop) || 0,10);
	},
	
	setStyle:function(elt,prop,value){
		var prop = Elt._getStyleAlias(prop), hook = Elt.styleHooks[prop];
		return (hook && hook.set) ? hook.set(elt, value) : elt.style[prop] = value;
	},
	
	
	is:function(elt,selectors){
		///*#if DEV*/if(elt.nodeType !== NodeTypes.ELEMENT) throw new Error('setAttr not allowed on non-element nodes'); /*#/if*/
		if(elt.nodeType === NodeTypes.DOCUMENT) return false;
		var matchesSelector=elt.webkitMatchesSelector || elt.mozMatchesSelector || elt.oMatchesSelector || elt.matchesSelector || elt.matches;
		if (matchesSelector) return matchesSelector.call(elt, selectors);
		// fall back to performing a selector: TODO : this doesnt work
		return $(selector,elt.parentNode).indexOf(elt);
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
	toggle:function(e,anim){
		console.log('toggle',e,anim,Elt.hasClass(e,'hidden'));
		if(anim){
			if(Elt.hasClass(e,'hidden')){
				Elt.setStyle(e,'opactity',0);
				Elt.removeClass(e,'hidden');
				Elt.fadeIn(e,anim);
			}else{
				Elt.fadeOut(e,anim,function(){ Elt.addClass(e,'hidden'); });
				return true;
			}
		}else
			return Elt.toggleClass(e,'hidden');
	},
	
	
	/* MANIPULATION */
	
	/** Completely removes element from the document */
	remove:function(e){
		if(e.parentNode != null){
			$.disposeElements($.getAll(e,false));
			$.disposeElement(e);
			e.parentNode.removeChild(e);
		}
	},
	
	/* content */
	doc:function(elt){ return elt && elt.ownerDocument || document; },
	
	text:function(e,content){ Elt.empty(e); Elt.appendText(e,content); },
	html:function(e,content){ Elt.empty(e); e.innerHTML=content; },
	appendText:function(e,content){ Elt.append(e,Elt.doc(e).createTextNode(content)); },
	prependText:function(e,content){ Elt.prepend(e,Elt.doc(e).createTextNode(content)); },
	empty:function(e){
		if(e.nodeType == NodeTypes.ELEMENT)
			$.disposeElements($.getAll(e,false));
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
		e.appendChild(child);
	},
	prepend:function(e,child){
		e.insertBefore(child,e.firstChild);
	},
	
	insertBefore:function(e,sibling){
		e.parentNode.insertBefore(sibling,e);
	},
	insertAfter:function(e,sibling){
		var parent = e.parentNode;
		if(parent.lastChild == e)
			parent.appendChild(sibling);
		else
			parent.insertBefore(sibling, e.nextSibling);
	},
	
	appendTo:function(e,parent){
		Elt.append(parent,e);
	},
	prependTo:function(e,parent){
		Elt.prepend(parent,e);
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