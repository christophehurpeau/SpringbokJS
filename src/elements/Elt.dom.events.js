/* http://cdn.craig.is/js/gator.js
 * https://github.com/nwtjs/nwt/blob/master/src/event/js/event.js
 */
UObj.extend(Elt,(function(){
	var _callback = function(event){
		var type = event.type, target = event.target, //event.srcElement for IE is not necessary because handled by base2 in es5.js
			$elt = this, handlers= $elt._events;
		console.log('Event: '+type,target,handlers);
		
		if(!handlers || !handlers.has(type)) return;
		
		if(target && target.nodeType === NodeTypes.ELEMENT)
			event.$target = S.Elt(target);
		
		// stopPropagation() fails to set cancelBubble to true in Webkit
		// @see http://code.google.com/p/chromium/issues/detail?id=162270
		event.stopPropagation = function(){ this.cancelBubble = true; };
		
		// OLD IE
		if((event.clientX || event.clientY) && !(event.pageX || event.pageY)){
			event.pageX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			event.pageY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		
		handlers = handlers.get(type);
		handlers.some(function(callbackObject){
			if(!callbackObject.selector || Elt.is(target,callbackObject.selector)){
				if(callbackObject.callback.call($elt,event)===false){
					event.preventDefault();
					event.stopPropagation();
					return true;
				}
				return !!event.cancelBubble;
			}
		});
	};
	return {
		on:function(elt,eventNames,selector,callback){
			if(S.isFunc(selector)){ callback=selector; selector=undefined; }
			var $elt = S.Elt(elt), events = ($elt._events || ($elt._events = new Map));
			
			eventNames.split(' ').forEach(function(eventName){
				if(!events.has(eventName)){
					events.set(eventName,[]);
					//use capture : blur and focus do not bubble up so we need to use event capturing
					//(google closure will remove this var :))
					var capture=eventName == 'blur' || eventName == 'focus';
					if(!elt._eventsCallback) elt._eventsCallback=_callback.bind($elt);
					elt.addEventListener(eventName,elt._eventsCallback,capture);
					//console.log('Register event: '+eventName,elt);
				}
				events.get(eventName).push({selector:selector,callback:callback});
			});
		},
		
		off:function(elt,eventNames,selector,callback){
			if(!elt) return;
			var $elt = S.Elt(elt), events=$elt._events;
			
			if(!events) return;
			if(S.isFunc(selector)){ callback=selector; selector=undefined; }
			
			eventNames.split(' ').forEach(function(eventName){
				if(!events.has(eventName)) return;
				
				var remove=false;
				if(!callback){
					if(!selector) remove=true;
					else{
						var a = events.get(eventName);
						var b = UArray.removeAllBy(a,'selector',selector);
						if(b.length) events.set(eventName,b);
						else remove=true;
					}
				}else{
					var a=events.get(eventName);
					a = UArray.removeBy(a,'callback',callback);
					if(a.length) events.set(eventName,a);
					else remove=true;
				}
				if(remove){
					events['delete'](eventName);
					elt.removeEventListener(eventName,elt._eventsCallback,eventName == 'blur' || eventName == 'focus');
				}
			});
		},
		fire:function(elt,event){
			/*#if DEV*/ if(S.isString(event)) throw new Error; /*#/if*/
			elt.dispatchEvent(event);
		}
	};
})());