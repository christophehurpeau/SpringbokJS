includeCore('elements/');
includeCore('helpers/');

S.Form=S.Elt.WithContent.extend({
	tagName:'form', _tagContainer:'div',
	_eventBeforeSubmit:new Event('form.beforeSubmit'),
	_eventAfterSubmit:new Event('form.afterSubmit'),
	
	/*#if NODE*/ctor:function(H,method){ this.H=H; this._attributes={method:method}; this.content=''; },
	/*#else*/ctor:function(H,method){
		this.H=H;
		S.Elt.WithContent.call(this);
		this.attr('method',method);
		S.FormValidator && S.FormValidator.getValidator(this);
	},
	/*#/if*/
	
	action:function(url,entry,full){ this.attr('action',this.H.url(url,entry,full)); return this; },
	setModelName:function(modelName,name,value){
		if(!name && modelName!=null) name=UString.lcFirst(modelName);
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
		if(this._fieldsetStarted) throw new Error;
		this._fieldsetStarted=1;
		/*#if NODE*/
		this.append('<fieldset>');
		if(legend) this.append('<legend>').appendText(legend).append('</legend>');
		/*#else*/
		this._formElt=this[0];
		this[0]=$.create('fieldset');
		if(legend) this[0].append($.create('legend').text(legend));
		this[0]=this[0][0];
		/*#/if*/
		return this;
	},
	fieldsetStop:function(){
		/*#if NODE*/
		this.append('</fieldset>');
		/*#else*/
		var fieldset=this[0];
		this[0]=this._formElt;
		this.append(fieldset);
		delete this._fieldsetStarted;
		delete this._formElt;
		/*#/if*/
		return this;
	},
	
	end:function(submitLabel){
		if(submitLabel!=false) this.submit(submitLabel).end();
		if(this._fieldsetStarted) this.fieldsetStop();
		return /*#ifelse NODE*/(this.toString()||this)/*#/if*/;
	},
	
	_getValue:function(name){ return this._value && this._value[name]; },
	
	
	/*#if BROWSER*/
	onSubmit: function(options){
		var $form=this,submit;
		if(!S.isObj(options)) options = { success: options };
		this.on('submit',function(evt){
			evt.preventDefault();
			evt.stopPropagation();
			submit=this.find('[type="submit"]');
			this.fadeTo(0.4, 180);
			this.fire(this._eventBeforeSubmit);
			if(options.beforeSubmit && options.beforeSubmit()===false)
				this.stop().style('opacity',1) && hasPlaceholders && this.resetPlaceholders();
			else{
				submit.hide().forEach(function($e){ $e.insertAfter($.imgLoading()); });
				options.success(this,function(){
					submit.show().blur(); this.find('.imgLoading').remove(); this.fadeTo(1, 150);
					this.fire(this._eventAfterSubmit);
				}.bind(this));
			}
			return false;
		});
		return this;
	},
	ajax: function(options){
		var success;
		if(S.isObj(options)) success=options.success;
		else{
			success=options;
			options={};
		}
		options.success=function(){
			//TODO ajax request
		};
		this.onSubmit(options);
	}
	/*#/if*/
});

S.extPrototype(S.Helpers,{
	FormPost:function(){ return new S.Form(this,'post'); },
	FormGet:function(){ return new S.Form(this,'get'); },
	FormForModel:function(modelName,name,value){ return (new S.Form(this,'post')).setModelName(modelName,name,value); }
});

S.Form.Container=S.Elt.WithContent.extend({
	ctor:function(contained,defaultClass){
		this.tagName=contained._form._tagContainer;
		S.Elt.WithContent.call(this);
		this._form=contained._form;
		defaultClass && this.setClass(defaultClass);
		/*#if NODE*/
		this.html(contained.html());
		/*#else*/
		this.append(contained._container);//fragment
		/*#/if*/
	},
	
	//tagContainer:function(tag){ this.elt=$('<'+tag+'/>').attr(this.attr()) return this; }
	//error:function($message){ $this._error=message; return this; },
	//noError:function(){ $this->error=false; return this; },
	
	end:function(){ return this._form.append(/*#ifelse NODE*/(this.toHtml()||this[0])/*#/if*/); }
});

S.Form.Containable=S.Elt.Basic.extend({
	ctor:function(form,name){
		/*#if DEV*/
		if(!name && !(this instanceof S.Form.InputSubmit)){
			console.error('name is undefined or empty',this);
			throw new Error('name is undefined or empty');
		}
		/*#/if*/
		S.Elt.Basic.call(this);
		this._form=form; this._name=name;
		/*#if BROWSER*/
		this._container=document.createDocumentFragment();
		this._container.appendChild(this[0]);
		/*#/if*/
	},
	
	//.text and .html is after for gzip
	label:function(value){
		/*#if BROWSER*/ if(this._label) this._label.text(value); else /*#/if*/
		this._label=$.create('label').attr('for',this.getAttr('id'))/*#if BROWSER*/.prependTo(this._container)/*#/if*/.text(value);
		return this;
	},
	htmlLabel:function(value){
		/*#if BROWSER*/ if(this._label) this._label.html(value); else /*#/if*/
		this._label=$.create('label').attr('for',this.getAttr('id'))/*#if BROWSER*/.prependTo(this._container)/*#/if*/.html(value);
		return this;
	},
	noLabel:function(){
		/*#if BROWSER*/this._label && this._container.removeChild(this._label);/*#/if*/
		this._label=false;
		return this;
	},
	noName:function(){ this.removeAttr('name'); return this; },
	
	between:function(content){
		/*#if NODE*/
			this._between=content;
		/*#else*/
			content && S.Elt.insertBefore(this[0],content);
		/*#/if*/
		return this;
	},
	after:function(content){
		/*#if NODE*/
			this._after=content;
		/*#else*/
			content && S.Elt.append(this._container,content);
		/*#/if*/
	},
	noContainer:function(){
		/*#if NODE*/
		return this._form.append(this.toHtml());
		/*#else*/
		return this._form.append(this[0]);
		/*#/if*/
	},
	end:function(){ return this.container().end(); },
	
	container:function(){ return new S.Form.Container(this,this._getDefaultContainerClass ? this._getDefaultContainerClass() : this.tagName); },
	
	_setAttrValue:function(){
		var value=this._form._getValue(this._name);
		if(value != null) this.val(value);
	},
	_setAttrId:function(){
		if(this._name) this.id(this._form._modelName != null ? this._form._modelName+UString.ucFirst(this._name) : this._name);
	},
	_setAttrName:function(){
		this.attr('name',this._attrName());
	},
	_attrName:function(){
		return this._form._modelName != null ? this._form._name+'['+this._name+']' : this._name;
	},
	/*#if NODE*/
	toHtml:function(){
		return (this._label===false?'':this._label)+(this._between||' ')
			+S.Elt.toString(this.tagName,this._attributes,null);
	},
	/*#/if*/
});

includeCore('elements/FormInput');
includeCore('elements/InputSubmit');