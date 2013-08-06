(function(){
	
	
	var call_prop=function( propName ){
		return function(elt){ return Elt.getProp(elt,propName); }
	}
	
	UObj.extend(Elt,{
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
	});
	/* no args, return Elt */
	'parent next prev child'.split(' ').forEach(function(mName){
		Element.prototype[mName]=function(){ return Elt(Elt[mName].call(null,this[0])); };
	});
	
	Elt.Array.prototype.parents=function(){
		var ret=new S.Elt.Array;
		this._each(function(elt){
			ret._push(elt.parentNode);
		});
		return ret;
	}
		
	/* no args, return Elt array */
	'children siblings'.split(' ').forEach(function(mName){
		Element.prototype[mName]=function(){ return $._toEltArray(Elt[mName].call(null,this[0])); };
	});
})();
