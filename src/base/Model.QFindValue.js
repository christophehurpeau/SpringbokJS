/*#if NODE*/var QFindOne=/*#/if*/
includeCore('base/Model.QFindOne');

/*#ifelse BROWSER*/(var QFindValue||module.exports)/*#/if*/=QFindOne.extend({
	fetch:function(callback){
		return QFindOne.fetch(function(result){
			callback(result ? result[this._fields[0]] : undefined);
		}.bind(this))
	}
});