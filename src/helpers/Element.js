var Elt=(/* NODE||BROWSER */module.exports||S.Elt)=function Elt(tag){
	this.attrs={};
}
Elt._attrs=function(attrs){
	var res='';
	S.oForEach(attrs,function(k,v){
		res+=' '+k;
		if(v!==null) res+='="'+S.escape(v)+'"';
	});
	return res;
};
Elt.toStr=function(tag,attrs,content){
	return '<'+tag+(attrs?Elt._attrs(attrs):'')
			+(content===null?'/>':('>'+content+'</'+tag+'>'));
};
Elt.prototype={
	attrs:function(attrs){ S.extObj(this.attrs,attrs); return this; },
	attr:function(attrName,value){ this.attrs[attrName]=value; return this; },
	id:function(id){ this.attrs.id=id; return this; },
	attrClass:function($class){ this.attrs['class']=$class; return this; },
	addClass:function($class){ this.attrs['class']+=' '.$class; return this; },
	style:function(style){ this.attrs.style=style; return this; },
	onClick:function(onClick){ this.attrs.onclick=onClick; return this; },
	delAttr:function(attrName){ delete this.attrs[attrName]; return this; },
	getAttr:function(attrName){ return this.attrs[attrName]; },
	hasAttr:function(attrName){ return this.attrs[attrName] !== undefined; },
	
	_attrs:function(){ return Elt._attrs(this.attrs); }
	
};

Elt.WithContent=S.extClass(Elt,{
	text:function(content){ this.content=S.escape(content); return this; },
	html:function(content){ this.content=content; return this; },
	aText:function(content){ this.content+=S.escape(content); return this; },
	aHtml:function(content){ this.content+=content; return this; },
	render:function(tag){ return Elt.toStr(tag,this.attrs,this.content); }
});


Elt.Basic=S.extClass(Elt.WithContent,{
	ctor:function(tag){ this.tag=tag; },
	render:function(){ return Elt.Basic.super_.render.call(this,this.tag); }
});
Elt.create=function(tag){ return new Elt.Basic(tag); }
