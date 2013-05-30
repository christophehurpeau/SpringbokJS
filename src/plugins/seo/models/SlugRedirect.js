module.exports=App.Model('PageSlugRedirect',{
	Fields:{
		from:[String],
		to:[String],
		direct:[Boolean]
	},
	
	create:function(oldSlug,newSlug){
		this.collection.insert({from:oldSlug,to:newSlug,direct:true});
		throw new Error;
		//this.collection.find
		//if(self::QUpdateOneField('direct',false)->byNew_slug($oldSlug))
		//	self::QInsertSelect()->query(self::QAll()->setFields(array('old_slug','('.UPhp::exportString($newSlug).')','("")','NOW()'))->byNew_slug($oldSlug));
	}
},{
});