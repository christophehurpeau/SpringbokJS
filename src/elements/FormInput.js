S.Form.Input=S.Form.Containable.extend({
	tagName:'input',
	
	ctor:function(form,name,largeSize){
		S.Form.Containable.call(this,form,name);
		
		if(form._modelName){
			var model=M[form._modelName],fModel=model.Fields[name],v,e;
			if(fModel){
				if(fModel[0] === Number)
					this.attr('type','number');
				else if(fModel[0] === String){
					if(name==='pwd' || name==='password') this.attr('type','password').val('');
					else if(name==='email' || name==='mail') this.attr('type','email');
					else if(name==='url' || name==='website') this.attr('type','url');
				}
				
				if(fModel[1]){
					v=fModel[1].label && this.label(fModel[1].label);
					if(fModel[1].minL || fModel[1].required) this.prop('required',true);
					if(v=fModel[1].min) this.attr('min',v);
					if(v=fModel[1].max) this.attr('max',v);
					if(v=fModel[1].maxL){
						this.attr('maxlength',v);
						var size=70;
						if(v < 10) size=11;
						else if(v <= 30) size=25;
						else if(v < 80) size=30;
						else if(v < 120) size=40;
						else if(v < 160) size=50;
						else if(v < 200) size=60;
						
						this.attr('size',size*largeSize);
					}
				}
			}
		}
		//if(!this.prop('type')) this.attr('type','text');
		if(this.attr('type')!=='password') this._setAttrValue();
		this._setAttrId(); this._setAttrName();
		
	},
	
	//override (browser)
	val:function(val){
		/*#if NODE*/
			this.attr('value',val);
		/*#else*/
			if(arguments.length===0) return this.prop('value');
			this.prop('value',val);
		/*#/if*/
		return this;
	},
	
	placeholder:function(placeholder){
		/*#if NODE*/
			this.attr('placeholder',placeholder);
		/*#else*/
			var cleanPlaceholder=function(){ if(this.hasClass('placeholder') || this.val()===placeholder) this.removeClass('placeholder').val('') }.bind(this);
			this._form.on('form.beforeSubmit',cleanPlaceholder);
			this.attr('title',placeholder)
				.on('dispose',function(){ this._form.off('form.beforeSubmit',cleanPlaceholder); }.bind(this))
				.on('focus',cleanPlaceholder)
				.on('blur',function(){ if(!this.hasClass('placeholder') && !this.val()) this.addClass('placeholder').val(placeholder); }.bind(this))
				.on('change',function(){
					if(this.hasClass('placeholder')){
						if(!this.val()) this.removeClass('placeholder');
						else this.val(placeholder);
					}else if(!this.val()){
						this.addClass('placeholder').val(placeholder);
					}
				}.bind(this));
			if(!this.val()) this.addClass('placeholder').val(placeholder);
		/*#/if*/
		return this;
	},

	wp100:function(){ this.addClass('wp100'); return this; },
	
	_getDefaultContainerClass:function(){
		return 'input '+(this.getAttr('type')!='text'?'text ':'')+this.getAttr('type');
	}
});