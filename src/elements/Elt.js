/*#if BROWSER*/
includeCore('browser/base/');
includeCore('enums/NodeTypes');
/*#/if*/

S.Elt=(function(){
	function Elt(elt){
		/*#if NODE*/
		this._attributes={};
		/*#else*/
		this[0]=elt;
		/*#/if*/
	}
	Elt.extend=S.extThis;
	
	/*#if NODE*/
	var _attrs=function(attrs){
		var res='';
		UObj.forEach(attrs,function(k,v){
			res+=' '+k;
			if(v!==null) res+='="'+S.escape(v)+'"';
		});
		return res;
	},
	_toHtml=function(tagName,attrs,content){
		//console.log('Elt.toString',tag,attrs,content);
		return '<'+tagName+(attrs?_attrs(attrs):'')+(content===null?'/>':('>'+content+'</'+tagName+'>'));
	};
	/*#else*/
	includeCore('elements/Elt.dom');
	
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
		val:function(value){
			if(arguments.length===0)
				return Elt.getVal(this[0]);
			Elt.setVal(this[0],value);
			return this;
		},
		
		on:function(eventName,callback){
			this[0].addEventListener(eventName,callback,true);
			return this;
		},
		off:function(eventName,callback){
			this[0].removeEventListener(eventName,callback,true);
			return this;
		},
		
		/* TRAVERSING */
		parent:function(){
			return new Elt(this[0].parentNode);
		},
		children:function(){
			return $._toEltArray(this[0].children);
		},
		find:function(selectors){
			return $(selectors,this[0]);
		},
		first:function(selectors){
			return $.first(selectors,this[0]);
		}
		
		
		/*#/if*/
		
	};
	
	/*#if NODE*/
	Elt.WithContent=Elt.extend({
		text:function(content){ this.content=S.escape(content); return this; },
		html:function(content){ this.content=content; return this; },
		aText:function(content){ this.content+=S.escape(content); return this; },
		prependText:function(content){ this.content=this.content+S.escape(content); return this; },
		aHtml:function(content){ this.content+=content; return this; },
		toHtml:function(){ return _toHtml(this.tagName,this._attributes,this.content); },
		toString:function(){ return this.toHtml(); }
	});
	
	Elt.Basic=Elt.WithContent.extend({
		ctor:function(tagName){ this.tagName=tagName; this._attributes={}; },
		toHtml:function(){ return Elt.Basic.super_.toString.call(this); }
	});
	/*#else*/
	Elt.Basic=Elt.WithContent=Elt.extend({
		ctor:function(){
			Elt.call(this,document.createElement(this.tagName));
		}
	});
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
		
		val:function(attrName,value){
			this.forEach(function(e){ Elt.setVal(e,attrName,value); });
			return this;
		},
	};
	
	'attr prop'.split(' ').forEach(function(mName){
		var mEltName=UString.ucFirst(mName);
		Elt.prototype[mName]=function(name,value){
			if(arguments.length===1)
				return Elt['get'+mEltName].call(null,this[0],name);
			Elt['set'+mEltName].call(null,this[0],name,value);
			return this;
		};
		Elt.Array.prototype[mName]=function(name,value){
			/*#if DEV*/if(value===undefined) throw new Error('Cannot get '+mName+' from an list of elements');/*#/if*/
			this.forEach(function(e){ Elt['set'+mEltName].call(null,e,name,value) });
			return this;
		};
	});
	
	'remove empty'.split(' ').forEach(function(mName){
		Elt.prototype[mName]=function(){ Elt[mName].call(null,this[0]); return this; };
		Elt.Array.prototype[mName]=function(){ this.forEach(function(e){ Elt[mName].call(null,e) }); return this; };
		//Elt.Array.prototype[mName]=new Function('var args=arguments; this.forEach(function(e){ e.'+mName+'.apply(e,args) }); };');
	});
	'attrs setAttrs rmAttr id setClass addClass text html aText prependText aHtml append prepend appendTo'.split(' ').forEach(function(mName){
		Elt.prototype[mName]=function(arg1){ Elt[mName].call(null,this[0],arg1); return this; };
		Elt.Array.prototype[mName]=function(){ this.forEach(function(e){ Elt[mName].call(null,e,arg1) }); return this; };
	});
	'is hasClass'.split(' ').forEach(function(mName){
		Elt.prototype[mName]=function(arg1){ return Elt[mName].call(null,this[0],arg1); };
		Elt.Array.prototype[mName]=function(){ return this.some(function(e){ return Elt[mName].call(null,e,arg1) }); };
	});
	
	/*'click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave keydown keypress keyup'
		.split(' ').forEach(function(mName){
			Elt.prototype[mName]=function(arg1){ this[0].addEventListener(mName,arg1,true); return this; };
			Elt.Array.prototype[mName]=function(){ this.forEach(function(e){ e.addEventListener(mName,arg1,true); }); return this; };
	});*/
	'click select focus'.split(' ').forEach(function(mName){
		Elt.prototype[mName]=function(){ this[0][mName](); return this; };
		Elt.Array.prototype[mName]=function(){ this.forEach(function(e){ e[mName](); }); return this; };
	});
	
	/*#/if*/
	
	Elt.create=function(tag){
		/*#if DEV*/if(!tag) new FatalError('tag=',tag);/*#/if*/
		/*#if NODE*/
		return new Elt.Basic(tag);
		/*#else*/
		return new Elt(document.createElement(tag));
		/*#/if*/
	};
	'div ul li span'.split(' ').forEach(function(v){
		Elt[v]=function(){ return Elt.create(v); };
	});
	
	return Elt;
})();