App.Model('User',{
	static:{
		//parent:'Searchable', behaviours:['Child'],
		
		Fields:{
			_id:[String, {label:'Username', required:true}],
			email:[String, {label:'Email', required:true}],
			firstName:[String, {label:'First name', required:true}],
			lastName:[String, {label:'Last name', required:true}],
			pwd:[String, {label:'Password', required:true}]
		},
	}
});
