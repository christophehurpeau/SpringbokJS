includeCore('elements/Elt');

/*#if NODE*/
global.$={
	div:S.Elt.div,
	create:S.Elt.create
}
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
			return new S.Elt(selector);
		}
	};
	
	$._toEltArray=Object.prototype.__proto__ !== null ? function(results){
		if(!results) return new S.Elt.Array;
		results.__proto__=S.Elt.Array.prototype;
		return results;
	} : function(results){
		var ret=new S.Elt.Array;
		Array.forEach(results,function(r){
			ret[ret.length++]=r;
		});
		return ret;
	};
	
	$.byId=function(id){
		var elem = document.getElementById(id);
		
		// Check parentNode to catch when Blackberry 4.6 returns
		// nodes that are no longer in the document #6963
		if ( elem && elem.parentNode ) {
			// Handle the case where IE and Opera return items
			// by name instead of ID ===> SEE es5-compat

			return new S.Elt(elem);
		}
	};
		
	$.first=function(selectors,context){
		return new S.Elt((context||document).querySelector(selectors));
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
	$.disposeElements.event=new CustomEvent('dispose');
}else{
	//TODO : jquery compat
}
'div ul li span create'.split(' ').forEach(function(v){
	$[v]=S.Elt[v];
});
/*#/if*/
