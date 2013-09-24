includeCore('browser/db/S.Db');

S.Db.AbstractStore=S.newClass({
	toModel: function(result){
		return result && new this.model(result,'unchanged');
	}
});