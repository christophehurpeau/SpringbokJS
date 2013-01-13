includeCore('elements/');

S.extProto(S.Helpers,{
	FormPost:function(){ return new S.Form(this,'post'); },
	FormGet:function(){ return new S.Form(this,'get'); },
	FormForModel:function(modelName,name,value){ return (new S.Form(this,'post')).setModelName(modelName,name,value); }
});

S.Form=S.extClass(S.Elt.WithContent,{
	ctor:function(H,method){ this.H=H; this._attributes={method:method}; this.content=''; },
	
	action:function(url,entry,full){ this.attr('action',this.H.url(url,entry,full)); return this; },
	setModelName:function(modelName,name,value){
		if(!name && modelName!=null) name=S.sLcFirst(modelName);
		this._modelName=modelName; this._name=name; this._value=value;
		return this;
	},
	autoField:function(name){ return this.input(name); },
	
	input:function(name,largeSize){ return new S.Form.Input(this,name,largeSize||1); },
	textarea:function(name){ return new S.Form.Textarea(this,name); },
	hidden:function(name,value){ return new S.Form.InputHidden(this,name,value); },
	submit:function(title){ return new S.Form.InputSubmit(this,title); },
	reset:function(title){ return new S.Form.InputReset(this,title); },
	checkbox:function(name){ return new S.Form.InputCheckbox(this,name); },
	select:function(name,list,selected){ return S.Form.Select(this,name,list,selected); },
	
	
	fieldsetStart:function(legend){
		this._fieldsetStarted=1;
		this.aHtml('<fieldset>');
		if(legend) this.aHtml('<legend>'+S.escape(legend)+'</legend>');
		return this;
	},
	fieldsetStop:function(){
		this.elt=this._formElt.append(this.elt);
		return this;
	},
	
	end:function(submitLabel){
		if(submitLabel!=null) this.submit(submitLabel).end();
		if(this._fieldsetStarted) this.fieldsetStop();
		return this.toString();
	},
	
	toString:function(){ return S.Form.super_.toString.call(this,'form'); },
	
	_getValue:function(name){ return this._value && this._value[name]; }
});

S.Form.Container=S.extClass(S.Elt.WithContent,{
	ctor:function(contained,defaultClass){
		S.Elt.WithContent.call(this);
		this._form=contained._form;
		defaultClass && this.attrClass(defaultClass);
		this.html(contained.toString());
	},
	
	//tagContainer:function(tag){ this.elt=$('<'+tag+'/>').attr(this.attr()) return this; }
	before:function(content){ this.content=content+this.content; return this; },
	after:function(content){ this.content+=content; return this; },
	//error:function($message){ $this._error=message; return this; },
	//noError:function(){ $this->error=false; return this; },
	
	end:function(){ return this._form.aHtml(S.Form.Container.super_.toString.call(this,this._form._tagContainer||'div')); }
});

S.Form.Containable=S.extClass(S.Elt,{
	ctor:function(form,name){
		S.Elt.call(this);
		this._form=form; this._name=name;
	},
	
	placeholder:function(value){ this.attr('placeholder',value); return this; },
	
	label:function(value){ this._label=S.escape(value); return this; },
	htmlLabel:function(value){ this._label=value; return this; },
	noLabel:function(){ this._label=false; return this; },
	noName:function(){ this.rmAttr('name'); return this; },
	
	between:function(content){ this._between=content; return this; },
	noContainer:function(){ return this._form.aHtml(this.toString()); },
	end:function(){ return this.container().end(); },
	
	container:function(){ return new S.Form.Container(this,this._getDefaultContainerClass ? this._getDefaultContainerClass() : this.tagName); },
	
	_setAttrValue:function(){
		var value=this._form._getValue(this._name);
		if(value != null) this.val(value);
	},
	_setAttrId:function(){
		this.id(this._form._modelName != null ? this._form._modelName+S.sUcFirst(this._name) : this._name);
	},
	_setAttrName:function(){
		this.attr('name',this._attrName());
	},
	_attrName:function(){
		return this._form._modelName != null ? this._form._name+'['+this._name+']' : this._name;
	},
	
	toString:function(){
		return (this._label===false?'':this._label)+(this._between||' ')
			+S.Elt.toString(this.tagName,this._attributes,null);
	}
});

includeCore('elements/FormInput');
includeCore('elements/InputSubmit');