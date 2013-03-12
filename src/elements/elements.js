S.Elt=(function(){
	function Elt(){ this._attributes={}; }

	Elt._attrs=function(attrs){
		var res='';
		UObj.forEach(attrs,function(k,v){
			res+=' '+k;
			if(v!==null) res+='="'+S.escape(v)+'"';
		});
		return res;
	};
	Elt.toString=function(tagName,attrs,content){
		//console.log('Elt.toString',tag,attrs,content);
		return '<'+tagName+(attrs?Elt._attrs(attrs):'')
				+(content===null?'/>':('>'+content+'</'+tagName+'>'));
	};
	Elt.prototype={
		attrs:function(attrs){ UObj.extend(this._attributes,attrs); return this; },
		setAttrs:function(attrs){ this._attributes=attrs; return this; },
		attr:function(attrName,value){ this._attributes[attrName]=value; return this; },
		id:function(id){ this._attributes.id=id; return this; },
		attrClass:function($class){ this._attributes['class']=$class; return this; },
		addClass:function($class){ this._attributes['class']+=' '.$class; return this; },
		style:function(style){ this._attributes.style=style; return this; },
		onClick:function(onClick){ this._attributes.onclick=onClick; return this; },
		delAttr:function(attrName){ delete this._attributes[attrName]; return this; },
		getAttr:function(attrName){ return this._attributes[attrName]; },
		hasAttr:function(attrName){ return this._attributes[attrName] !== undefined; },
		
		_attrs:function(){ return Elt._attrs(this._attributes); }
		
	};
	
	Elt.WithContent=S.extClass(Elt,{
		text:function(content){ this.content=S.escape(content); return this; },
		html:function(content){ this.content=content; return this; },
		aText:function(content){ this.content+=S.escape(content); return this; },
		aHtml:function(content){ this.content+=content; return this; },
		toString:function(){ return Elt.toString(this.tagName,this._attributes,this.content); }
	});
	
	
	Elt.Basic=S.extClass(Elt.WithContent,{
		ctor:function(tagName){ this.tagName=tagName; this._attributes={}; },
		toString:function(){ return Elt.Basic.super_.toString.call(this,this.tagName); }
	});
	
	S.createElt=function(tag){ return new Elt.Basic(tag); };
	Elt.div=function(){ return S.createElt('div'); };
	
	return Elt;
	
	
	/* DOM */
	//test if elt is DOMElement : elt.nodeType
	Elt.createDom=function(html){
		
	}
	
	
})();
