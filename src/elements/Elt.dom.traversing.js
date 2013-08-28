UObj.extend(Elt,(function(){
	var call_prop=function( propName ){
		return function(elt){ return Elt.getProp(elt,propName); };
	};
	return {
		parent: function(elt){
			return elt.parentNode;
		},
		child: function(elt,number){
			return Elt.children(elt)[number||0];
		},
		next: call_prop('nextElementSibling'),
		prev: call_prop('previousSibling'),
		children: call_prop('children'),
		siblings:function(){throw new Error;
			
		},
		
		closest: function(elt, selector){
			while(elt.parentNode && elt.parentNode !== document){
				elt = elt.parentNode;
				if(elt.nodeType === NodeTypes.ELEMENT && Elt.is(elt,selector)) return elt;
			}
		}
	};
})());

/* no args, return Elt */
'parent next prev child'.split(' ').forEach(function(mName){
	Element.prototype[mName]=function(){ var result = Elt[mName].call(null,this[0]); return result && Elt(result); };
});
/* one args, return Elt */
'closest'.split(' ').forEach(function(mName){
	Element.prototype[mName]=function(arg){ var result = Elt[mName].call(null,this[0],arg); return result && Elt(result); };
});

/* no args, return Elt array */
'children siblings'.split(' ').forEach(function(mName){
	Element.prototype[mName]=function(){ return $._toEltArray(Elt[mName].call(null,this[0])); };
});


Elt.Array.prototype.parents=function(){
	var ret=new S.Elt.Array;
	this._each(function(elt){
		ret._push(elt.parentNode);
	});
	return ret;
};
Elt.Array.prototype.closest=function(selector){
	var ret=new S.Elt.Array;
	this._each(function(elt){
		var result = Elt.closest(elt,selector);
		result && ret._push(result);
	});
	return ret;
};

Element.prototype.find = function(selectors){
	return $(selectors,this[0]);
};
Element.prototype.first = function(selectors){
	return $.first(selectors,this[0]);
};

Elt.Array.prototype.find = function(selectors){
	var ret=new S.Elt.Array;
	this._each(function(elt){
		ret._push.apply(ret,elt.querySelectorAll(selectors));
	});
	return ret;
};
