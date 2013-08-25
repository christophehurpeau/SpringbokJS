/*#if NODE*/var QFindOne=/*#/if*/
includeCore('base/Model.QFindOne');

/*#ifelse BROWSER*/(var QFindValue||module.exports)/*#/if*/=QFindOne.extend({
	fetch:function(callback,callbackFailed){
		return this._fetch(function(result){
			callback(result ? result[this.options.fields[0]] : undefined);
		}.bind(this),callbackFailed);
	}
});