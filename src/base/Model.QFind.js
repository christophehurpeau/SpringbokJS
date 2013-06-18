/*#ifelse BROWSER*/(var QFind||module.exports)/*#/if*/=S.newClass({
	ctor:function(model,H){ this.model=model; this.H=H; },
	
	/*#if BROWSER*/
	writable:{ _range:null, _direction:'next' },
	/*#/if*/

	fields:function(fields){ this._fields=fields; return this; },
	
	cursor:/*#ifelse NODE*/(
		function(callback){ callback(this._fields ? this.model.collection.find(this._query,this._fields)
												: this.model.collection.find(this._query)); }
		||
		function(callback){ this.model.cursor(callback,this._range,this._direction); }
	)/*#/if*/,
	
	
	/*#if BROWSER*/
	only:function(value){
		/*#if DEV*/if(this._range) throw new Error('this._range is already defined !');/*#/if*/
		/*#if NODE */this._query={_id:value};
		/*#else*/this._range=IDBKeyRange.only(value);
		/*#/if*/
		return this;
	},
	gte:function(value){
		/*#if DEV*/if(this._range) throw new Error('this._range is already defined !');/*#/if*/
		/*#if NODE */this._query={_id:{$gte:value}};
		/*#else*/this._range=IDBKeyRange.lowerBound(value);
		/*#/if*/
		return this;
	},
	gt:function(value){
		/*#if DEV*/if(this._range) throw new Error('this._range is already defined !');/*#/if*/
		/*#if NODE */this._query={_id:{$gt:value}};
		/*#else*/this._range=IDBKeyRange.lowerBound(value,true);
		/*#/if*/
		return this;
	},
	lte:function(value){
		/*#if DEV*/if(this._range) throw new Error('this._range is already defined !');/*#/if*/
		/*#if NODE */this._query={_id:{$lte:value}};
		/*#else*/this._range=IDBKeyRange.upperBound(value);
		/*#/if*/
		return this;
	},
	lt:function(value){
		/*#if DEV*/if(this._range) throw new Error('this._range is already defined !');/*#/if*/
		/*#if NODE */this._query={_id:{$lt:value}};
		/*#else*/this._range=IDBKeyRange.upperBound(value,true);
		/*#/if*/
		return this;
	},
	
	between:function(value1,value2,value1Included,value2Included){
		/*#if DEV*/if(this._range) throw new Error('this._range is already defined !');/*#/if*/
		this._range=IDBKeyRange.bound(value1,value2,value1Included,value2Included);
	}
	/*#/if*/
});
