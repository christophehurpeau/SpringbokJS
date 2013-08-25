/*#if NODE*/var QFind=/*#/if*/
includeCore('base/Model.QFind');

/*#ifelse BROWSER*/(var QFindAll||module.exports)/*#/if*/=QFind.extend({
	exec:function(callback){ this.cursor(callback); },
	forEach:function(callback){
		this.cursor(function(cursor){
			cursor.forEach(callback);
		});
	},
	fetch:function(callback){
		return this.cursor(function(cursor){
			cursor.toArray(callback);
		});
	}
});