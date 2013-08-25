includeJsCore('browser/ui/InputFollow');

S.ui.InputBox=S.ui.InputFollow.extend({
	ctor: function($input,propName){
		S.ui.InputFollow.call(this,$input);
		this.init();
		if($input.prop('focus')){
			this.showDiv();
			this.$div.$currentFocus = $input;
		}
		$input[propName||'sInputBox'] = this;
		$input
			.on('dispose',function(){ this.dispose(); }.bind(this))
			.on('focus',function(){
				this.$div.$currentFocus = $input;
				this.hasFocus=true;
				if(!this.$div.is(':empty'/*,:visible'*/)) this.showDiv();
			}.bind(this))
			.on('blur',function(){
				if(this.$div.$currentFocus === $input){
					delete this.$div.$currentFocus;
					setTimeout(function(){
						if(!this.hasFocus && this.$div /* t.div can be deleted before the timeout */ && !this.$div.$currentFocus) this.hideDiv();
					},200);
				}
				this.hasFocus=false;
			}.bind(this));
		;
	},
	init: function(){
		this.initDiv();
	},
	initDiv: function(){
		this.$div=this.createDiv().appendTo($('#container'));
	},
	createDiv: function(){
		return $.div().attr('class','widget widgetBox hidden');
	},
	showDiv: function(){
		this.active=true;
		//var offsetParent=this.input/*.offsetParent()*/.closest('.col,.context,#page,body'),offsetParentPosition=offsetParent.position(),divPosition;
		var divOffset;
		return this.$div.style('min-width',this.$input.prop('offsetWidth')+'px').show()
			//.position({ my: "left top", at: "left bottom", of: this.$input, collision: "none", within: $('#container') })
			.style({ position: 'absolute', top: '10px', right: '10px' })
			.style({
				'max-width':(/*offsetParentPosition.left+*/document.width-this.$div.prop('offsetLeft')-10)+'px',
				'max-height':(/*offsetParentPosition.top+*//*offsetParent*/document.height-this.$div.prop('offsetTop')-10)+'px'
			});
	},
	hideDiv: function(){
		this.active=false;
		return this.$div.hide();
	},
	dispose: function(){
		this.$div && this.$div.remove();
		S.ui.InputBox.super_.dispose.call(this);
	}
});