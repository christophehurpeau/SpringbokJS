includeJsCore('browser/ui/InputBox');

S.ready(function(){
	/*#if DEV*/
		if($.ht5ifv) alert('Please do not use ht5ifv !');
	/*#/if*/
	$('form:not([novalidate])').forEach(function($form){
		S.FormValidator.getValidator($form);
	});
});
(function(){
	var checkTimeFormat=function(val){
		//http://www.w3.org/TR/html5/common-microsyntaxes.html#valid-time-string
		return /^([01][0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9](\.\d{1,3})?)?$/.test(val);
	},checkDateFormat=function(val){
		//TODO use local to be able to know the format
		if(!val.match(/^(\d{4})-(\d{2})-(\d{2})$/)) return false;
		var y=parseInt(RegExp.$1,10),m=parseInt(RegExp.$2,10),d=parseInt(RegExp.$3,10),date;
		return m < 13 && d < 32 && m > 0 && d > 0 && (date=new Date(y,m,d))
					&& d.getFullYear() === y && d.getMonth() === m && d.getDate() === d
					&& d;
	},checkMinAndMax=function($node,val,callback){
		var min=$node.attr('min'),max=$node.attr('max');
		if(min && (callback?callback(min):min) > val) return ['min',min];
		return (max && val > (callback?callback(max):max)) ? ['max',max] : false;
	};
	var restrictions={
		input:{
			type:{
				//http://www.w3.org/TR/html5/common-microsyntaxes.html#rules-for-serializing-simple-color-values
				color:function($node,val){ return /^#[0-9A-F]{6}$/i.test(val); },
				date:function($node,val){ return !(val=checkDateFormat(val)) || checkMinAndMax($node,val,Date.parse); },
				//http://www.w3.org/TR/html5/common-microsyntaxes.html#valid-global-date-and-time-string
				datetime:function($node,val){
					return !val.match(/^(\d{4}-\d{2}-\d{2})T(.+)(Z|(\+|-)([01][0-9]|2[0-3]):([0-5][0-9]))$/)
						|| !checkDateFormat(RegExp.$1) || !checkTimeFormat(RegExp.$2)
						|| checkMinAndMax($node,Date.parse(val),Date.parse); //should avoid parse date...
				},
				//http://www.w3.org/TR/html5/states-of-the-type-attribute.html#local-date-and-time-state
				'datetime-local':function($node,val){
					return !val.match(/^(\d{4}-\d{2}-\d{2})T(.+)$/)
						|| !checkDateFormat(RegExp.$1) || !checkTimeFormat(RegExp.$2)
						|| checkMinAndMax($node,Date.parse(val),Date.parse); //should avoid parse date...
				},
				time:function($node,val){
					return !checkTimeFormat(val)
						|| checkMinAndMax($node,Date.parse('2000-01-01T'+val),function(v){ return Date.parse('2000-01-01T'+v);});
							//should avoid parse date...
				},
				email:function($node,val){
					//the $node.get(0).getAttribute('multiple') is a workaround for IE9
					var values = $node.attr('multiple') || $node.get(0).getAttribute('multiple') ? val.split(/\s*,\s*/) : [val];
					function validate(){
						var val = values.pop();
						return !val || val &&
							val.match(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i) 
							&& validate();
					}
					return !validate();
				},
				//http://www.w3.org/TR/html5/the-input-element.html#attr-input-type
				month:(function(){
					var RE = /^(\d{4})-(0[1-9]|1[0-2])$/;
					return function($node,val){
						return !RE.test(val) || checkMinAndMax($node,parseInt(RegExp.$1+RegExp.$2,10),
									function(v){ return parseInt(v.substr(0,4)+v.substr(5),10) });
					};
				})(),
				
				//http://www.w3.org/TR/html5/common-microsyntaxes.html#valid-week-string
				/*week:(function(){
					
				})(),*/
				
				//http://www.w3.org/TR/html5/common-microsyntaxes.html#real-numbers
				number:function($node,val){
					var valAsNumber = $node.prop('valueAsNumber');
					return !( (valAsNumber && (val=valAsNumber)) || ( /^-?[0-9]+(\.[0-9]*)?(E(-|\+)?[0-9]+)?$/i.test(val) && ((val=parseInt(val,10))!==NaN)))
						|| checkMinAndMax($node,val,function(v){ return parseInt(v,10); });
				},
				range:function($node,val){ return restrictions.input.type.number.text($node,val); },
				
				//http://www.w3.org/TR/html5/states-of-the-type-attribute.html#text-state-and-search-state
				text:function($node,val){ return false; },
				password:function($node,val){ return restrictions.input.type.text($node,val); },
				search:function($node,val){ return restrictions.input.type.text($node,val); },
				tel:function($node,val){ return restrictions.input.type.text($node,val); },
				
				url:function($node,val){
					if(val.indexOf('www.') === 0) $node.val(val='http://'+val);
					return !/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(val);
				},
				
				file:function($node,val){
					/*#if DEV*/ alert('TODO'); /*#/if*/
					return false;
				},
				
				//ip:function($node,val){ },
				price:function($node,val){ return !/^\d+(\.\d{2})?$/.test(val) || checkMinAndMax($node,val,Number); }
				//latlng pattern : /^\-?\d{1,3}\.\d+$/
			},
			
			restrictions:['pattern','minlength','maxlength','data-same'],
			pattern:function(pattern,val,$node){ return !(new RegExp('^'+pattern+'$')).test(val); },
			minlength:function(maxlength,val,$node){ return val.length < maxlength; },
			maxlength:function(minlength,val,$node){ return val.length > minlength; },
			'data-same':function(dataSame,val,$node){ return val != $.first(dataSame).val(); }
		},
		checkbox:function($node){ return !(!$node[0].required || $node[0].checked); },
		select:function($node){ return $node.val() == null; },
		textarea:function($node){ return false; },
		radio:function($radioGroup,$node){ return $radioGroup.filter(':checked').length > 0; }
	};
	
	var //selectorAllElements='input:not([type="reset"],[type="submit"],[type="image"],[type="button"]) textarea select',
	selectorAllElements='input:not([type="reset"]):not([type="submit"]):not([type="image"]):not([type="button"]), textarea, select',
		validationBox=S.ui.InputBox.extend({
			ctor:function(input){
				S.ui.InputBox.call(this,input,'sValidationMessage');
			},
			createDiv:function(){ return $.div().attr('class','divInputBox hidden boxError'); }//TODO : add an arrow, remove css validation-error
		});
	S.FormValidator=function($form,eventsName){
		this.$form=$form.attr('novalidate','novalidate');
		$form.sValidator=this;
		var t=this;
		//form.on('sValidation.clear',selectorAllElements,this.check);
		$form.on(this.eventsName=((eventsName||S.FormValidator.eventsName)+' validation.check'),
			selectorAllElements,this.listenFormF=function(event){ t.checkElement($(event.target)) })
				.on('submit',this.listenSubmitF = this.check.bind(this))
				.on('dispose',this.listenDispose = function(){ t.dispose(true); });
	};
	S.FormValidator.eventsName='blur focus change keyup';
	S.FormValidator.addRestriction=function(name,f){
		/*#if DEV*/ if(restrictions.input[name]) S.error('restriction '+name+' already exists'); /*#/if*/
		restrictions.input.restrictions.push(name);
		restrictions.input[name]=f;
	};
	S.FormValidator.prototype={
		dispose:function(removedForm){
			if(this.$form){
				if(!removedForm){
					this.$form.off(this.eventsName,selectorAllElements,this.listenFormF)
						.off('submit',this.listenSubmitF)
						.off('dispose',this.listenDispose);
				}
				delete this.$form;
			}
		},
		/*updateElements:function(){
			this.elements=form.find()
				.unbind('sValidation.clear',this.clear).bind('sValidation.clear',this.clear);
			this.inputs=this.elements.filter('input').not('[type="checkbox"],[type="radio"]');
			this.radios=this.elements.filter('input[type="radio"]');
			this.textareas=this.elements.filter('textarea');
			this.selects=this.elements.filter('select');
		},*/
		check:function(){
			var radioNames=[],error;
			this.$form.find(selectorAllElements).forEach(function($elt){
				if($elt.is('input[type="radio"]')){
					var name=$elt.attr('name');
					if(UArray.has(radioNames,name)) return;
					radioNames.push(name);
				}
				if(!this.checkElement($elt,error==undefined)) error=true;
			}.bind(this));
			return !error;
		},
		checkElement:function($elt,checkAllAndFirstError){
			if($elt.prop('disabled')){
				this.cleanElement($elt);
				return true;
			}
			
			var tagName=$elt.nodeName(),isInput=tagName==='input',type=isInput ? $elt.attr('type')||'text' : undefined,error;
			if(isInput && type==='radio'){
				
			}else if(isInput && type==='checkbox'){
				error=restrictions.checkbox(elt);
				if(error!==false) return this.checkFailed($elt,'checkbox',checkAllAndFirstError);
			}else{
				var val=$elt.val();
				if(val==''){
					if($elt.prop('required')) return this.checkFailed($elt,'required',checkAllAndFirstError);
				}else if(type!=='hidden'){
					/*#if DEV*/
					if(isInput && !restrictions.input.type[type]) S.error('Unknown input type: '+type);
					if(isInput && !S.isFunc(restrictions.input.type[type])) S.error('input type: '+type+' is not a function');
					/*#/if*/
					error=isInput ? restrictions.input.type[type]($elt,val)
							: restrictions[tagName]($elt,val);
					if(error!==false) return this.checkFailed($elt,error===true?type||'required':error,checkAllAndFirstError);
					if(isInput){
						restrictions.input.restrictions.forEach(function(r){
							var attr=$elt.attr(r);
							if(attr!=null){
								error = restrictions.input[r](attr,val,$elt);
								if(error!==false) return this.checkFailed($elt,error===true?[r,attr]:error,checkAllAndFirstError);//probleme : must not be in function => use for
							}
						});
					}
				}
			}
			this.checkPassed($elt);
			return true;
		},
		checkFailed:function($elt,error,checkAllAndFirstError){
			$elt.removeClass('validation-valid').addClass('validation-invalid');
			var attrs;
			if(S.isArray(error)) error= S.tC('validation.'+error[0],UArray.slice1(error));
			else if(error!=null){
				/*#if DEV*/ if(!i18n.coreTranslations['validation.'+error]) S.error('Unknown validation translation error: '+error); /*#/if*/
				error=S.tC('validation.'+error);
			}
			if(error){
				!$elt.sValidationMessage && ($elt.sValidationMessage=new validationBox($elt));
				$elt.sValidationMessage.$div.empty().append($.div().attr('class','content').text(error));
				if($elt.is(':focus')) $elt.sValidationMessage.showDiv();
				else if(checkAllAndFirstError) $elt.focus().sValidationMessage.showDiv();
			}
		},
		checkPassed:function($elt){
			this.cleanElement($elt);
			$elt.addClass('validation-valid');
		},
		cleanElement:function($elt){
			$elt.removeClass('validation-invalid');
			var ib=$elt.sValidationMessage;
			if(ib){ ib.$div.empty(); ib.hideDiv(); }
		}
	};
	//TODO trigger events to be able to be used by inputListHandler
	var checkEvent = new Event('validation.check');
	
	S.FormValidator.getValidator=function($form){
		var validator=$form.sValidator;
		!validator && (validator=new S.FormValidator($form));
		return validator;
	};
	S.FormValidator.checkForm=function($form){
		return S.FormValidator.getValidator($form).check();
	};
	
	$document.on('focus','form:not([novalidate])',function(e){
		var v=new S.FormValidator(this),target;
		if(e.target){
			target=$(e.target);
			if(target.is(selectorAllElements)) target.fire(checkEvent);
		}
	});
	$document.on('submit','form:not([novalidate])',function(){
		return S.FormValidator.checkForm(this);
	});
})();
