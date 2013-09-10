App.Model('PageSlugRedirect',{
	static:{
		Fields:{
			model:[String],
			from:[String],
			to:[String],
			direct:[Boolean]
		},
		
		create:function(modelName,oldSlug,newSlug){
			this.collection.insert({model:modelName,from:oldSlug,to:newSlug,direct:true});
			throw new Error;
			//this.collection.find
			//if(self::QUpdateOneField('direct',false)->byNew_slug($oldSlug))
			//	self::QInsertSelect()->query(self::QAll()->setFields(array('old_slug','('.UPhp::exportString($newSlug).')','("")','NOW()'))->byNew_slug($oldSlug));
		}
	}
});