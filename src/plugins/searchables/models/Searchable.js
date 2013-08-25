App.Model('Searchable',{
	behaviours:['Normalize','Slug'],
	
	types:{ },
	
	Fields:{
		name:[String],
		visible:[Boolean]
	},
},{
});