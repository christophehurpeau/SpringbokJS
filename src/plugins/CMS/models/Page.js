module.exports=App.Model('Page',{},{
	title:{type:String, index:true, set:function(v){ this.slug=U.Strings.slugify(v); return v;}},
	slug:{type:String, index:{unique:true}},
	content:{type:String}
},{
	
})
