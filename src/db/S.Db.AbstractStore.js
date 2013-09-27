S.Db.AbstractStore=S.newClass({
	toModel: function(result){
		return result && new this.model(result,'unchanged');
	},
	
	updateByKey:function(key,options,r){
		if(!options.data[this.model.keyPath]) throw new Error;
		options.criteria = {};
		options.criteria[this.model.keyPath] = options.data[this.model.keyPath];
		options.data = UObj.clone(options.data);
		delete options.data[this.model.keyPath];
		this.update(options,r);
	}
});