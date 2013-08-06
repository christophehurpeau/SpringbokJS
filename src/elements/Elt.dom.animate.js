/* 
 * https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_animations
 * https://hacks.mozilla.org/2011/09/detecting-and-generating-css-animations-in-javascript/
 * https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties
 * http://css3.bradshawenterprises.com/transitions/
 * http://ricostacruz.com/jquery.transit/jquery.transit.js
 * 
 * http://jsfiddle.net/codepo8/ATS2S/8/
 * 
 * http://caniuse.com/css-transitions
 * http://caniuse.com/css-animation
 * 
 */

(function(){
	//should move into browser/compat when more widely supported
	var domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
		eventAnimationEndNames={
			'animation':       'animationend',
			'MozAnimation':    'animationend',
			'WebkitAnimation': 'webkitAnimationEnd',
			'OAnimation':      'oanimationend',
			'msAnimation':     'MSAnimationEnd'
		},
		eventTransitionEndNames={
			'transition':       'transitionend',
			'MozTransition':    'transitionend',
			'WebkitTransition': 'webkitTransitionEnd',
			'OTransition':      'otransitionend',
			'msTransition':     'MSTransitionnEnd'
		},
		cssprefix = '', pfx  = '',
		
		animation = false, transformation = false, transition = false,
		animationstring = 'animation', transformationstring = 'transform', transitionstring = 'transition';
		
		;
	if( document.body.style.animationName !== undefined ) animation = true;
	if( document.body.style.transform !== undefined ) transformation = true;
	if( document.body.style.transition !== undefined ) transition = true;
	
	if( animation === false ) {
		domPrefixes.some(function(domPrefix){
			if( document.body.style[ domPrefix + 'AnimationName' ] !== undefined ){
				pfx = domPrefix;
				animationstring = pfx + 'Animation';
				cssprefix = '-' + pfx.toLowerCase() + '-';
				animation = true;
				return true;
			}
		});
	}
	
	if( transformation === false ) {
		domPrefixes.some(function(domPrefix){
			if( document.body.style[ domPrefix + 'Transform' ] !== undefined ){
				pfx = domPrefix;
				transformationstring = pfx + 'Transform';
				cssprefix = '-' + pfx.toLowerCase() + '-';
				transformation = true;
				return true;
			}
		});
	}
	
	if( transition === false ) {
		domPrefixes.some(function(domPrefix){
			if( document.body.style[ domPrefix + 'Transition' ] !== undefined ){
				pfx = domPrefix;
				transitionstring = pfx + 'Transition';
				cssprefix = '-' + pfx.toLowerCase() + '-';
				transition = true;
				return true;
			}
		});
	}
	// Init END.
	
	// Common functions
	/*
	var insertRule=(function(){
		if( document.styleSheets && document.styleSheets.length ) {
			var styleSheet=document.styleSheets[0];
			return function(keyframes){ styleSheet.insertRule( keyframes, 0 ); }
		}else{
			var s = document.createElement( 'style' );
			document.head.appendChild( s );
			return function(keyframes){ s.innerHTML = s.innerHTML + keyframes };
		}
	})();
	*/
	var parseDuration=function(duration){
		if(duration===0) throw new Error('Duration must not be === 0');
		if(!S.isString(duration)) return duration;
		return duration.contains('ms') ? parseInt(duration, 10) : parseInt(duration, 10) * 1000; 
	};
	
	var timeoutCallback=function(e,eventName,duration,callback){
		var done = false,_callback=function(event){
			if(done || (event && event.target!==e)) return; //could be a transition on a child
			/*#if DEV*/ if(!event) console.warn('timeout callback : ',eventName,' ',e,callback); /*#/if*/
			done = true;
			e.removeEventListener(eventName,_callback);
			callback.call(e);
		};
		e.addEventListener(eventName,_callback,false);
		setTimeout(_callback,duration+90);
	}
	
	// End common functions
	// TODO : compat if not animations (transitions then pure javascript)
	
	var animations={
		shake: [ ],
		wiggle: [ ],
		hinge: [ ],
	},transitions={
		fadeIn: [ { opactiy: 0 }, { opacity:1 } ],
		fadeOut: { opacity:0 },
		slideDown: [ { opactiy: 0 }, { opacity:1, height:'auto' } ],
		slideUp: { opacity: 0, height: 0 }
	};
	
	if( animation ){
		// CSS3 simple animations
		var animationEndEventName=eventAnimationEndNames[animationstring];
		
		Elt.anim=function(e,animName,duration,callback){
			if(S.isFunc(duration)){ callback = duration; duration = undefined; }
			duration=parseDuration(duration) || 700;
			Elt.setStyle(e,animationstring,animName+' '+duration+'ms');
			
			/*#if DEV*/if(!animations[animName]) throw new Error;/*#/if*/
			
			callback && timeoutCallback(e,animationEndEventName,duration,callback);
		};
	}
	
	/* TRANSITIONS
	 * Elt.transition($.first('form')[0],{opacity: 0});
	 * 
	 */
	if( transition ){
		// CSS3 simple transitions
		var transitionEndEventName=eventTransitionEndNames[transitionstring];
		
		//var _css_value = /^([0-9]+|auto)([a-z]+)?$/;
		Elt.transition = function(e,properties,duration,callback){
			if(S.isFunc(duration)){ callback = duration; duration = undefined; }
			if(S.isString(properties)){
				properties = transitions[properties];
				/*#if DEV*/if(!properties) throw new Error;/*#/if*/
			}
			duration=parseDuration(duration) || 700;
			var addedOverflow, currentOverflow;
			
			var from,to;
			if(S.isArray(properties)){
				from=properties[0]; to=properties[1];
			}else{
				to=properties;
			}
			
			if(to.height || to.width){
				currentOverflow=Elt.getStyle(e,'overflow');
				if(currentOverflow !== 'hidden'){
					Elt.setStyle(e,'overflow','hidden');
					addedOverflow = true;
				}
			}
			
			/*var modifiedProps={};
			for(var property in properties){
				modifiedProps[property] = S.isString(properties[property]) ? _css_value.exec(properties[property])
										 : [ properties[property], properties[property]];
				// TODO : only with some props : doesn't work with colors for instance ! See https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties
				if(modifiedProps[property][1] !== 0 && property==='opacity' && Elt.getStyle(e,'opacity')==1) Elt.setStyle(e,property,0);
			}*/
			
			from && UObj.forEach(from,function(property,value){
				Elt.setStyle(e,property,value);
			});
			
			Elt.setStyle(e,transitionstring,'all '+duration+'ms');
			//console.log('transition',e,UObj.map(modifiedProps,function(prop){ return prop[0]}));
			
			UObj.forEach(to,function(property,value){
				Elt.setStyle(e,property,value==='auto' ? null : value);
			});
			
			timeoutCallback(e,transitionEndEventName,duration,function(){
				addedOverflow && Elt.setStyle(e,'overflow',currentOverflow);
				callback && callback.call(this);
			});
		};
	}else{
		// old javascript animations & transitions
		
		// really quick implementation
		Elt.transition = function(e,properties,duration,callback){
			if(S.isFunc(duration)){ callback = duration; duration = undefined; }
			if(S.isString(properties)){
				properties = transitions[properties];
				/*#if DEV*/if(!properties) throw new Error;/*#/if*/
			}
			
			for(var property in properties){
				properties[property] = S.isString(properties[property]) ? _css_value.exec(properties[property])
										 : [ properties[property], properties[property]];
				if(properties[property][1] !== 0) Elt.setStyle(e,property,0);
			}
			// hop ! done ^^
			for(var property in properties)
				Elt.setStyle(e,property,properties[property][0]);
			
			callback && setTimeout(callback.bind(e),duration);
		};
	}
	
	if(!Elt.anim) Elt.anim=function(elt,animName,duration,callback){
		var properties=animations[animName];
		/*#if DEV*/if(!properties) throw new Error;/*#/if*/
		Elt.transition(elt,properties,duraction,callback);
	};
	Elt.transition.create=function(properties){
		return function(elt,duration,callback){
			return Elt.transition(elt,properties,duration,callback);
		}
	};
	
	Elt.stop=function(e){
		//TODO : $e._animationTimeouts
		animation && Elt.setStyle(e,animationstring,'none');
		transition && Elt.setStyle(e,transitionstring,'none');
	};
	
	// S.Elt.transition.chain('fadeOut','fadeIn')($.first('form')[0])
	'anim transition'.split(' ').forEach(function(methodName){
		Elt[methodName].chain=function(){
			var animationsOrTransitions=arguments;
			return function(elt,duration,callback){
				var it=UArray.iterator(animationsOrTransitions);
				if(it.hasNext()){
					var callbackInternal=function(){
						if(it.hasNext()){
							var i=it.next(), a=animationsOrTransitions[i];
							S.isArray(a) ? Elt[methodName](elt,a[0],a[1],callbackInternal) : Elt[methodName](elt,a,undefined,callbackInternal);
						}else callback && callback();
					};
					callbackInternal();
				}
			}
		}
	})
	
/*
Elt.fadeIn=Elt.anim.create({ opacity:1 });
Elt.fadeOut=anim.create({ opacity:0 });
Elt.slideDown=anim.create({ opacity:1, width:1 });
Elt.slideUp=anim.create({ opacity:0, width:0 });
*/

'fadeIn fadeOut slideDown slideUp'.split(' ').forEach(function(transitionName){
	Elt[transitionName]=function(e,duration,callback){ Elt.transition(e,transitionName,duration,callback); };
});
Elt.fadeTo = function(e, opacity, duration, callback){
	Elt.transition(e,{ opacity: opacity }, duration, callback);
};

	/*Elt.fadeIn=Elt.transition.create({ opacity:1 });
	Elt.fadeOut=Elt.transition.create({ opacity:0 });
	Elt.slideDown=Elt.transition.create({ opacity:1, height:'auto' });
	Elt.slideUp=Elt.transition.create({ opacity:0, height:0 });*/
})();
