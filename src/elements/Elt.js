S.Elt=(function(){
	function Elt(elt){
		/*#if NODE*/
		this._attributes={};
		/*#else*/
		this.a=elt;
		/*#/if*/
	}
	
	/*#if NODE*/
	var _attrs=function(attrs){
		var res='';
		UObj.forEach(attrs,function(k,v){
			res+=' '+k;
			if(v!==null) res+='="'+S.escape(v)+'"';
		});
		return res;
	},
	_toString=function(tagName,attrs,content){
		//console.log('Elt.toString',tag,attrs,content);
		return '<'+tagName+(attrs?_attrs(attrs):'')+(content===null?'/>':('>'+content+'</'+tagName+'>'));
	};
	/*#else*/
	UObj.extend(Elt,{
		attrs:function(elt,attrs){
			for(var key in attrs) Elt.attr(elt,key,attrs[key]);
		},
		getAttr:function(elt,name){
			if(elt.nodeType !== NodeTypes.ELEMENT) /*#if DEV*/throw new Error('get attr not allowed on non-element nodes');/*#else*/return;/*#/if*/
			var result = elt.getAttribute(name);
			return !result && name in elt ? elt[name] : result;
		},
		setAttr:function(elt,name,value){
			if(elt.nodeType !== NodeTypes.ELEMENT) /*#if DEV*/throw new Error('set attr not allowed on non-element nodes');/*#else*/return;/*#/if*/
			if(value===null) elt.removeAttribute(name);
			else elt.setAttribute(name,value);
		},
		rmAttr:function(elt){
			elt.removeAttribute(attrName);
		},
		setClass:function(elt,$class){
			Elt.setAttr(elt,'class',$class);
		},
		addClass:function(elt,$class){
			Elt.setAttr(elt,'class',Elt.getAttr(e,'class')+' '+$class);
		},
		hasClass:function(elt,$class){
			if( elt.nodeType === NodeTypes.ELEMENT && (" " + elt.className + " ").replace(rclass, " ").indexOf( className ) >= 0 )
				return true;
		},
		is:function(elt,selectors){
			var matchesSelector=elt.webkitMatchesSelector || elt.mozMatchesSelector || elt.oMatchesSelector || elt.matchesSelector;
			if (matchesSelector) return matchesSelector.call(elt, selectors);
			// fall back to performing a selector:
			return $(selector,elt.parentNode).indexOf(elt)
		},
		
		
		remove:function(e){
			if(e.parentNode != null)
				e.parentNode.removeChild(e);
		},
		
		/* content */
		doc:function(elt){ return elt && elt.ownerDocument || document; },
		
		text:function(e,content){ Elt.empty(e); Elt.aText(e,content); },
		html:function(e,content){ Elt.empty(e); e.innerHTML=content; },
		aText:function(e,content){ Elt.append(e,Elt.doc(e).createTextNode(content)); },
		prependText:function(e,content){ Elt.prepend(e,Elt.doc(e).createTextNode(content)); },
		aHtml:function(e,content){ },
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
			e.appendChild(child.nodeType ? child : child.a);
		},
		prepend:function(e,child){
			/*#if DEV*/
			if(!UArray.has([NodeTypes.ELEMENT,NodeTypes.DOCUMENT_FRAGMENT,NodeTypes.DOCUMENT],e.nodeType))
				throw new Error('append not allowed on non-element|document nodes');
			/*#/if*/
			e.insertBefore(child.nodeType ? child : child.a,e.firstChild);
		},
		
		appendTo:function(e,parent){
			Elt.append(parent.nodeType ? parent : parent.a,e);
		}
	});
	Elt.setAttrs=Elt.attrs;
	
	/*#/if*/
	Elt.prototype={
		/*#if NODE*/
		attrs:function(attrs){ UObj.extend(this._attributes,attrs); return this; },
		setAttrs:function(attrs){ this._attributes=attrs; return this; },
		attr:function(attrName,value){ this._attributes[attrName]=value; return this; },
		id:function(id){ this._attributes.id=id; return this; },
		setClass:function($class){ this._attributes['class']=$class; return this; },
		addClass:function($class){ this._attributes['class']+=' '.$class; return this; },
		style:function(style){ this._attributes.style=style; return this; },
		onClick:function(onClick){ this._attributes.onclick=onClick; return this; },
		delAttr:function(attrName){ delete this._attributes[attrName]; return this; },
		getAttr:function(attrName){ return this._attributes[attrName]; },
		hasAttr:function(attrName){ return this._attributes[attrName] !== undefined; },
		/*#else*/
		attr:function(attrName,value){
			if(value===undefined)
				return Elt.getAttr(this.a,attrName);
			Elt.setAttr(this.a,attrName,value);
			return this;
		},
		/*#/if*/
		
	};
	
	/*#if NODE*/
	Elt.WithContent=S.extClass(Elt,{
		text:function(content){ this.content=S.escape(content); return this; },
		html:function(content){ this.content=content; return this; },
		aText:function(content){ this.content+=S.escape(content); return this; },
		prependText:function(content){ this.content=this.content+S.escape(content); return this; },
		aHtml:function(content){ this.content+=content; return this; },
		toString:function(){ return _toString(this.tagName,this._attributes,this.content); }
	});
	
	Elt.Basic=S.extClass(Elt.WithContent,{
		ctor:function(tagName){ this.tagName=tagName; this._attributes={}; },
		toString:function(){ return Elt.Basic.super_.toString.call(this); }
	});
	/*#else*/
	Elt.Array=function(){ this.length=0; };
	Elt.Array.prototype={
		forEach:Array.prototype.forEach,
		reduce:Array.prototype.reduce,
		/* some executes the callback function once for each element present in the array until it finds one where callback returns a true value.
		 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Some */
		some:Array.prototype.reduce,
		_push:Array.prototype.push,
		sort:Array.prototype.sort,
		indexOf:Array.prototype.indexOf,
		concat:Array.prototype.concat,
		//map:Array.prototype.map,
		//slice:Array.prototype.slice,
		
		attr:function(attrName,value){
			/*#if DEV*/if(value===undefined) throw new Error('Cannot get value from an list of elements');/*#/if*/
			this.forEach(function(e){ Elt.setAttr(e,attrName,value); });
			return this;
		},
	};
	
	'remove,empty'.split(',').forEach(function(mName){
		Elt.prototype[mName]=function(){ Elt[mName].call(null,this.a); return this; };
		Elt.Array.prototype[mName]=function(){ this.forEach(function(e){ Elt[mName].call(null,e) }); return this; };
		//Elt.Array.prototype[mName]=new Function('var args=arguments; this.forEach(function(e){ e.'+mName+'.apply(e,args) }); };');
	});
	'attrs,setAttrs,rmAttr,setClass,addClass,text,html,aText,prependText,aHtml,append,prepend,appendTo'.split(',').forEach(function(mName){
		Elt.prototype[mName]=function(arg1){ Elt[mName].call(null,this.a,arg1); return this; };
		Elt.Array.prototype[mName]=function(){ this.forEach(function(e){ Elt[mName].call(null,e,arg1) }); return this; };
	});
	'is,hasClass'.split(',').forEach(function(mName){
		Elt.prototype[mName]=function(arg1){ return Elt[mName].call(null,this.a,arg1); };
		Elt.Array.prototype[mName]=function(){ return this.some(function(e){ return Elt[mName].call(null,e,arg1) }); };
	});
	
	/*#/if*/
	
	Elt.create=function(tag){
		/*#if NODE*/
		return new Elt.Basic(tag);
		/*#else*/
		return new Elt(document.createElement(tag));
		/*#/if*/
	};
	'div,ul,li'.split(',').forEach(function(v){
		Elt[v]=function(){ return Elt.create(v); };
	});
	
	return Elt;
	
	
	/* DOM */
	//test if elt is DOMElement : elt.nodeType
	Elt.createDom=function(html){
		
	}
	
})();