S.Form.Input=S.Form.Containable.extend({
	tagName:'input',
	
	ctor:function(form,name,largeSize){
		S.Form.Containable.call(this,form,name);
		this.attr('type','text');
		
		if(form._modelName){
			var model=M[form._modelName],fModel=model.Fields[name],v,e;
			if(fModel){
				switch(fModel[0]){
					case 'i': this.attr('type','number'); break;
					case 's':
						if(name==='pwd' || name==='password') this.attr('type','password').attr('value','');
						else if(name==='email' || name==='mail') this.attr('type','email');
						else if(name==='url' || name==='website') this.attr('type','url');
						break; 
				}
				
				if(fModel[1].minL || fModel[1].req) this.attr('required',true);
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
		if(this.attr('type')!=='password') this._setAttrValue();
		this._setAttrId(); this._setAttrName();
		
	},
	
	val:function(val){ this.attr('value',val); return this; },
	wp100:function(){ this.addClass('wp100'); return this; },
	
	_getDefaultContainerClass:function(){
		return 'input '+(this.getAttr('type')!='text'?'text ':'')+this.getAttr('type');
	}
});