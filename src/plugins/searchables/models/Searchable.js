App.Model('Searchable',{
	static:{
		behaviours:['Normalize','Slug'],
		
		types:{ },
		
		Fields:{
			name:[String],
			visible:[Boolean]
		},
	}
});