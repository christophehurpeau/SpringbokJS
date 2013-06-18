/*#if NODE*/var QFind=/*#/if*/
includeCore('base/Model.QFind');

/*#ifelse BROWSER*/(var QFindList||module.exports)/*#/if*/=QFind.extend({
	cursor:/*#ifelse NODE*/(
		function(callback){ callback(this._fields ? this.model.collection.find(this._query,this._fields)
												: this.model.collection.find(this._query)); }
		||
		function(callback){
			this._keyCursor ? objectStore.index(this._keyCursor).openKeyCursor(this._boundKeyCursor,this._direction).onsuccess = function(event) {
				callback(event.target.result);
				
			} : '';
			
		}
	)/*#/if*/,
	
	
});