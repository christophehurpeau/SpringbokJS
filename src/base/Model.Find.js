/*#if NODE*/var QFindAll=/*#/if*/
includeCore('base/Model.QFindAll');

/*#if NODE*/var QFindOne=/*#/if*/
includeCore('base/Model.QFindOne');


/*#ifelse BROWSER*/(var Find||module.exports)/*#/if*/=S.newClass({
	ctor:function(model){ this.model=model; },
	
	//get one(){ return new QFindOne(this.model,this.H) },
	one:function(H){ return new QFindOne(this.model,H) },
	all:function(H){ return new QFindAll(this.model,H) }
	
	//byId:function(id,callback){ return this.one.byId(id).fetch(callback); },
	//byIdNotNull:function(id,callback){ return this.one.byId(id).notNull(callback); }
	//	return this.model.collection.findOne.apply(this.model.collection,arguments); }
});