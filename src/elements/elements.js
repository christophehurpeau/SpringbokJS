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

/**
 * Enum for node type codes. https://developer.mozilla.org/en-US/docs/Web/API/Node.nodeType
 * @enum {number}
 */
var NodeTypes={
	ELEMENT: 1,
	ATTRIBUTE: 2, //Deprecated
	TEXT: 3,
	CDATA_SECTION: 4, //Deprecated
	ENTITY_REFERENCE: 5, //Deprecated
	ENTITY: 6, //Deprecated
	PROCESSING_INSTRUCTION: 7,
	COMMENT: 8,
	DOCUMENT: 9,
	DOCUMENT_TYPE: 10,
	DOCUMENT_FRAGMENT: 11,
	NOTATION: 12 //Deprecated
};

if(!global.$){
	global.$=function(selector){
		// HANDLE: $(""), $(null), $(undefined), $(false)
		if( !selector ){
			return '?';
		}
		
		if( S.isString(selector) ){
			if(selector.charAt(0)==='#') return $.byId(selector.substr(1));
			var m = selector.match(/^(\.)?(\W)$/);
			if(m) return $[m[1]?'byClassName':'byTagName'](m[2]);
			return $.find(selector);
		}else if(selector.nodeType){
			//DOM element
			return new S.Elt(selector);
		}
	};
	$.div=S.Elt.div;
	$.create=S.Elt.create;
	
	var results=Object.prototype.__proto__ !== null ? function(results){
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
		
	$.findFirst=function(selectors){
		return new S.Elt(document.querySelector(selectors));
	};
	$.find=function(selectors){
		return results(document.querySelectorAll(selectors));
	};
	
	$.byClassName=function(names){
		/* https://developer.mozilla.org/en-US/docs/Web/API/document.getElementsByClassName */
		return results(document.getElementsByClassName(names));
	};
	
	$.byTagName=function(names){
		/* https://developer.mozilla.org/en-US/docs/Web/API/document.getElementsByTagName */
		return results(document.getElementsByTagName(names));
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
	$.div=S.Elt.div;
	$.create=S.Elt.create;
}
/*#/if*/
