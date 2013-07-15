S.Form.InputSubmit=S.extClass(S.Form.Containable,{
	tagName:'input',
	_getDefaultContainerClass:function(){ return 'input submit'; },
	
	ctor:function(form,title){
		S.Form.Containable.call(this,form);
		this._label=false;
		this.attr('value',title).attr('type','submit').attr('class','submit');
	}
});
