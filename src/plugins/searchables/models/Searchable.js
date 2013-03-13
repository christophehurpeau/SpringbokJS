module.exports=App.Model('Searchable',{
	behaviours:['Normalize','Slug'],
	
	types:{Page:2},
	
	Fields:{
		name:[String],
		visible:[Boolean]
	},
},{
});