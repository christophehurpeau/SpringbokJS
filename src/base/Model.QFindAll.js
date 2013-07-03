/*#if NODE*/var QFind=/*#/if*/
includeCore('base/Model.QFind');

/*#ifelse BROWSER*/(var QFindAll||module.exports)/*#/if*/=QFind.extend({
	exec:function(callback){ this.cursor(callback); },
	each:function(callback){
		this.cursor(function(cursor){
			/*#if NODE*/cursor.each(callback);
			/*#else*/if(cursor){
				callback(this.toModel(cursor.value),cursor.key);
				cursor['continue']();
			}/*#/if*/
		}.bind(this));
	},
	fetch:function(callback){
		return this.cursor(function(cursor){
			cursor.toArray(callback)
				.map(function(v){ return this.toModel(v); }.bind(this));
		});
	}
});