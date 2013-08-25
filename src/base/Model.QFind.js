/*#ifelse BROWSER*/(var QFind||module.exports)/*#/if*/=S.newClass({
	ctor:function(model,H){ this.model=model; this.H=H; this.options={}; },
	
	/*toModel:Object.prototype.__proto__ !== null ? function(model,result){
		if(!result) return null;
		result.__proto__=model.prototype;
		return result;
	} : function(results){
		var result=new model();
		Array.forEach(results,function(r){
			ret[ret.length++]=r;
		});
		return ret;
	},*/
	toModel:function(result){
		return this.model.store.toModel(result);
	},
	
	fields:function(fields){ this.options.fields=fields; return this; },
	field:function(field){ this.options.fields=[field]; return this; },
	query:function(query){ this._query=query; return this; },
	
	cursor:function(callback){
		return this.model.store.cursor(callback,this._query,this.options);
	},
	
	
	/*#if BROWSER*/
	only:function(value){
		/*#if DEV*/if(this.options.range) throw new Error('this.options.range is already defined !');/*#/if*/
		/*#if NODE */this._query={_id:value};
		/*#else*/this.options.range=IDBKeyRange.only(value);
		/*#/if*/
		return this;
	},
	gte:function(value){
		/*#if DEV*/if(this.options.range) throw new Error('this.options.range is already defined !');/*#/if*/
		/*#if NODE */this._query={_id:{$gte:value}};
		/*#else*/this.options.range=IDBKeyRange.lowerBound(value);
		/*#/if*/
		return this;
	},
	gt:function(value){
		/*#if DEV*/if(this.options.range) throw new Error('this.options.range is already defined !');/*#/if*/
		/*#if NODE */this._query={_id:{$gt:value}};
		/*#else*/this.options.range=IDBKeyRange.lowerBound(value,true);
		/*#/if*/
		return this;
	},
	lte:function(value){
		/*#if DEV*/if(this.options.range) throw new Error('this.options.range is already defined !');/*#/if*/
		/*#if NODE */this._query={_id:{$lte:value}};
		/*#else*/this.options.range=IDBKeyRange.upperBound(value);
		/*#/if*/
		return this;
	},
	lt:function(value){
		/*#if DEV*/if(this.options.range) throw new Error('this.options.range is already defined !');/*#/if*/
		/*#if NODE */this._query={_id:{$lt:value}};
		/*#else*/this.options.range=IDBKeyRange.upperBound(value,true);
		/*#/if*/
		return this;
	},
	
	between:function(value1,value2,value1Included,value2Included){
		/*#if DEV*/if(this.options.range) throw new Error('this.options.range is already defined !');/*#/if*/
		this.options.range=IDBKeyRange.bound(value1,value2,value1Included,value2Included);
	}
	/*#/if*/
});
