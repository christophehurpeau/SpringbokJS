includeCore('elements/Elt');

/*#if NODE*/
global.$={}
/*#else*/

/*
 * https://github.com/ded/qwery/blob/master/qwery.js
 * https://github.com/julienw/dollardom
 * https://github.com/jquery/sizzle
 * https://github.com/honza/140medley
 */

includeCore('enums/NodeTypes');

if(!global.$){
	global.$=function(selector,context){
		// HANDLE: $(""), $(null), $(undefined), $(false)
		if( !selector ){
			return '?';
		}
		
		if( S.isString(selector) ){
			if(selector.charAt(0)==='#') return $.byId(selector.substr(1));
			// TODO : is it an optimization ? Shouldn't this be done by the browser, in the native function querySelectorAll ?
			var m = selector.match(/^(\.)?(\w+)$/);
			if(m) return $[m[1]?'byClassName':'byTagName'](m[2],context);
			return $.find(selector,context);
		}else if(selector.nodeType){
			//DOM element
			return S.Elt(selector);
		}
	};
	
	$._toEltArray=Object.prototype.__proto__ !== null ? function(results){
		if(!results) return new S.Elt.Array;
		results.__proto__=S.Elt.Array.prototype;
		return results;
	} : function(results){
		var ret=new S.Elt.Array;
		/*Array.forEach(results,function(r){
			ret[ret.length++]=r;
		});*/
		Array.prototype.push.apply(ret,results);
		return ret;
	};
	
	$.byId=function(id){
		var elem = document.getElementById(id);
		
		// Check parentNode to catch when Blackberry 4.6 returns
		// nodes that are no longer in the document #6963
		if ( elem && elem.parentNode ) {
			// Handle the case where IE and Opera return items
			// by name instead of ID ===> SEE es5-compat

			return S.Elt(elem);
		}
	};
		
	$.first=function(selectors,context){
		return S.Elt((context||document).querySelector(selectors));
	};
	$.find=function(selectors,context){
		return $._toEltArray((context||document).querySelectorAll(selectors));
	};
	
	$.byClassName=function(names,context){
		/* https://developer.mozilla.org/en-US/docs/Web/API/document.getElementsByClassName */
		return $._toEltArray((context||document).getElementsByClassName(names));
	};
	
	$.byTagName=function(names,context){
		/* https://developer.mozilla.org/en-US/docs/Web/API/document.getElementsByTagName */
		return $._toEltArray((context||document).getElementsByTagName(names));
	}
	
	
	
	$.getAll=function(context,tag){
		return context.getElementsByTagName( tag || "*" )
	};
	
	$.disposeElements=function(elements){
		Array.forEach(elements,function(elt){
			elt.dispatchEvent($.disposeElements.event);
		});
	};
	//https://developer.mozilla.org/en-US/docs/Web/Guide/DOM/Events/Creating_and_triggering_events
	$.disposeElements.event=new Event('dispose');
}else{
	//TODO : jquery compat
}
window.$document=$(document);
window.$head=$(document.head);
window.$body=$(document.body);

/*#/if*/
$.create=S.Elt.create;
'div p ul li span'.split(' ').forEach(function(v){
	//Elt[v]=function(){ return Elt.create(v); };
	$[v]=S.Elt.create.bind(null,v);
});