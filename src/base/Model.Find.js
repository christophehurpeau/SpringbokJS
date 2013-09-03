/*#if NODE*/var QFindAll=/*#/if*/
includeCore('base/Model.QFindAll');

/*#if NODE*/var QFindOne=/*#/if*/
includeCore('base/Model.QFindOne');

/*#if NODE*/var QFindValue=/*#/if*/
includeCore('base/Model.QFindValue');


/*#ifelse BROWSER*/(var Find||module.exports)/*#/if*/=S.newClass({
	ctor:function(model){ this.model=model; },
	
	//get one(){ return new QFindOne(this.model,this.H) },
	one:function(H){ return new QFindOne(this.model,H); },
	all:function(H){ return new QFindAll(this.model,H); },
	value:function(field,H){
		if(!S.isString(field)){
			H = field;
			field = undefined;
		}
		var qfv = new QFindValue(this.model,H);
		field && qfv.field(field);
		return qfv;
	}
	
	//byId:function(id,callback){ return this.one.byId(id).fetch(callback); },
	//byIdNotNull:function(id,callback){ return this.one.byId(id).notNull(callback); }
	//	return this.model.collection.findOne.apply(this.model.collection,arguments); }
});