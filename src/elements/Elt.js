/*#if BROWSER*/
includeCore('browser/base/');
includeCore('enums/NodeTypes');
/*#/if*/

S.Elt=(function(){
	var Element=function(elt){
		/*#if DEV*/ if(this instanceof S.Elt) throw new Error;/*#/if*/
		/*#if NODE*/
		this._attributes={};
		/*#else*/
		this[0]=elt;
		elt.$elt=this;
		elt.addEventListener('dispose',function(){
			Object.keys(this).forEach(function(key){
				delete this[key];
			}.bind(this));
		}.bind(this),false);
		/*#/if*/
	}
	Element.extend=S.extThis;
	
	var Elt=function(elt){
		/*#if NODE*/
		return new Element(elt);
		/*#else*/
		return elt.$elt || new Element(elt);
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
	_toHtml=function(tagName,attrs,content){
		//console.log('Elt.toString',tag,attrs,content);
		return '<'+tagName+(attrs?_attrs(attrs):'')+(content===null?'/>':('>'+content+'</'+tagName+'>'));
	};
	/*#else*/
	
	/*#/if*/
	Element.prototype={
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
		getAttr:function(attrName){ return Elt.getAttr(this[0],attrName); },
		val:function(value){
			if(arguments.length===0)
				return Elt.getVal(this[0]);
			Elt.setVal(this[0],value);
			return this;
		},
		
		/* TRAVERSING */
		/*use child() instead firstChild:function(){
			return Elt(this[0].firstChild);
		},*/
		
		find:function(selectors){
			return $(selectors,this[0]);
		},
		first:function(selectors){
			return $.first(selectors,this[0]);
		},
		
		
		/*#/if*/
		
	};
	
	/*#if NODE*/
	Elt.WithContent=Element.extend({
		text:function(content){ this.content=S.escape(content); return this; },
		html:function(content){ this.content=content; return this; },
		appendText:function(content){ this.content+=S.escape(content); return this; },
		prependText:function(content){ this.content=this.content+S.escape(content); return this; },
		append:function(content){ this.content+=content; return this; },
		toHtml:function(){ return _toHtml(this.tagName,this._attributes,this.content); },
		toString:function(){ return this.toHtml(); }
	});
	
	Elt.Basic=Elt.WithContent.extend({
		ctor:function(tagName){ this.tagName=tagName; this._attributes={}; },
		toHtml:function(){ return Elt.Basic.super_.toHtml.call(this); }
	});
	/*#else*/
	Elt.Basic=Elt.WithContent=Element.extend({
		ctor:function(){
			Element.call(this,document.createElement(this.tagName));
		}
	});
	Elt.Array=function(){ this.length=0; };
	Elt.Array.prototype={
		forEach:function(callback){
			this._each(function(e){
				callback.call(this,Elt(e));
			});
		},
		some:function(callback){
			var results = new Elt.Array;
			this._some(function(e){
				results.push(e);
				return callback.call(this,Elt(e));
			});
			return results;
		},
		_each:Array.prototype.forEach,
		_reduce:Array.prototype.reduce,
		/* some executes the callback function once for each element present in the array until it finds one where callback returns a true value.
		 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Some */
		_some:Array.prototype.some,
		_push:Array.prototype.push,
		_sort:Array.prototype.sort,
		_indexOf:Array.prototype.indexOf,
		//map:Array.prototype.map,
		//slice:Array.prototype.slice,
		
		val:function(value){
			this._each(function(e){ Elt.setVal(e,value); });
			return this;
		},
	};
	
	
	/*#if BROWSER*/
	includeCore('elements/Elt.dom');
	includeCore('elements/Elt.dom.events');
	includeCore('elements/Elt.dom.animate');
	includeCore('elements/Elt.dom.traversing');
	
	/*#/if*/
	
	
	'attr prop style'.split(' ').forEach(function(mName){
		var mEltName=UString.ucFirst(mName);
		Element.prototype[mName]=function(name,value){
			if(arguments.length === 1){
				if(S.isObj(name)){
					var elt=this[0], fn=Elt['set'+mEltName];
					UObj.forEach(name,function(name,value){
						fn.call(null,elt,name,value);
					});
					return this;
				}
				return Elt['get'+mEltName].call(null,this[0],name);
			}
			Elt['set'+mEltName].call(null,this[0],name,value);
			return this;
		};
		Elt.Array.prototype[mName]=function(name,value){
			/*#if DEV*/if(value===undefined) throw new Error('Cannot get '+mName+' from an list of elements');/*#/if*/
			this._each(function(e){ Elt['set'+mEltName].call(null,e,name,value) });
			return this;
		};
	});
	
	/* no args, return this */
	'remove empty show hide stop'.split(' ').forEach(function(mName){
		Element.prototype[mName]=function(){ Elt[mName].call(null,this[0]); return this; };
		Elt.Array.prototype[mName]=function(){ this._each(function(e){ Elt[mName].call(null,e) }); return this; };
		//Elt.Array.prototype[mName]=new Function('var args=arguments; this.forEach(function(e){ e.'+mName+'.apply(e,args) }); };');
	});
	/* no args, return result */
	'width height'.split(' ').forEach(function(mName){
		Element.prototype[mName]=function(){ return Elt[mName].call(null,this[0]); };
	});
	
	/* one arg, return this */
	('attrs setAttrs removeAttr id setClass addClass removeClass text html'
		+' fadeTo fadeIn fadeOut slideDown slideUp').split(' ').forEach(function(mName){
		Element.prototype[mName]=function(arg1){ Elt[mName].call(null,this[0],arg1); return this; };
		Elt.Array.prototype[mName]=function(arg1){ this._each(function(e){ Elt[mName].call(null,e,arg1) }); return this; };
	});
	
	
	var toNodeElt=function(elementOrString){
		return elementOrString.nodeType ? elementOrString : (S.isString(elementOrString) ? Elt.parse(elementOrString) : elementOrString[0]);
	};

	'append prepend appendText prependText appendTo prependTo insertBefore insertAfter'.split(' ').forEach(function(mName){
		Element.prototype[mName]=function(elementOrString){ Elt[mName].call(null,this[0],toNodeElt(elementOrString)); return this; };
		Elt.Array.prototype[mName]=function(elementOrString){
			if(this.length){
				var newElt=toNodeElt(elementOrString);
				this._each(function(e,i){ Elt[mName].call(null,e,i===0 ? newElt : newElt.clone(true)) });
			}
			return this;
		};
	});
	
	/* one arg, return result */
	'is hasClass formData nodeName'.split(' ').forEach(function(mName){
		Element.prototype[mName]=function(arg1){ return Elt[mName].call(null,this[0],arg1); };
		Elt.Array.prototype[mName]=function(arg1){ return this._some(function(e){ return Elt[mName].call(null,e,arg1) }); };
	});
	/* unlimited args */
	'on off fire anim'.split(' ').forEach(function(mName){
		Element.prototype[mName]=function(){
			var args=arguments; Array.unshift(args,this[0]);
			Elt[mName].apply(null,args);
			return this;
		};
		Elt.Array.prototype[mName]=function(){
			var args=Array.unshift(arguments,null);
			this._some(function(e){ args[0]=e; return Elt[mName].apply(null,args) }); };
			return this;
	});
	
	/*'click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave keydown keypress keyup'
		.split(' ').forEach(function(mName){
			Elt.prototype[mName]=function(arg1){ this[0].addEventListener(mName,arg1,true); return this; };
			Elt.Array.prototype[mName]=function(){ this.forEach(function(e){ e.addEventListener(mName,arg1,true); }); return this; };
	});*/
	'click select focus blur'.split(' ').forEach(function(mName){
		Element.prototype[mName]=function(){
			/*#if DEV*/if(arguments.length) throw new Error('this function doesnt take arguments');/*#/if*/
			this[0][mName]();
			return this;
		};
		Elt.Array.prototype[mName]=function(){
			/*#if DEV*/if(arguments.length) throw new Error('this function doesnt take arguments');/*#/if*/
			this.forEach(function(e){ e[mName](); });
			return this;
		};
	});
	
	/*#/if*/
	
	Elt.create=function(tag){
		/*#if DEV*/if(!tag) new FatalError('tag=',tag);/*#/if*/
		/*#if NODE*/
		return new Elt.Basic(tag);
		/*#else*/
		return Elt(document.createElement(tag));
		/*#/if*/
	};
	
	return Elt;
})();