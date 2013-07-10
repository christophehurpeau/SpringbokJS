/* loaded by :
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 *  => Firefox < 11, Chrome < 15, IE, Opera < 11.6, Safari
 * 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Array_generic_methods
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/contains
 *  => Almost all except Firefox > 19
 * 
 * -
 * http://kangax.github.com/es5-compat-table/es6/
 */
(function(){
	includeCoreUtils('es6/String');
	includeCoreUtils('es6/Array');
	includeCoreUtils('es6/Map');
	
	// document.head (HTML5)
	document.head = document.head || document.getElementsByTagName('head')[0];
	window.StopIteration=window.StopIteration || {};

	/* DOM-shim */

	var shim=function(name,shim){
		var constructor = window[name];
		if (!constructor)
			constructor = window[name] = shim.interface;
		delete shim.interface;
		var proto = constructor.prototype;
		if (shim.prototype) {
			proto = constructor.prototype = shim.prototype;
			delete shim.prototype;
		}
		
		console&&console.log("adding interface ", name);
		
		if (shim.hasOwnProperty("constructor")) {
			window[name] = constructor = shim.constructor;
			shim.constructor.prototype = proto;
			delete shim.constructor;
		}
	};
	
	shim('CustomEvent',{
		interface: window.Event,
		constructor: function(type, dict){
			var e = document.createEvent("CustomEvent");
			dict = dict || {};
			dict.detail = dict.detail || null;
			dict.bubbles = dict.bubbles || false;
			dict.catchable = dict.catchable || false;
			if (e.initCustomEvent) {
				e.initCustomEvent(type, dict.bubbles, dict.catchable, dict.detail);
			} else {
				e.initEvent(type, dict.bubbles, dict.catchable);
				e.detail = dict.detail;
			}
			return e;
		}
	});
})();


