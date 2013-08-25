db.add('User',{
	//parent:'Searchable', behaviours:['Child'],
	
	Fields:{
		_id:[String,{label:'Username', required:true}],
		firstName:[String,{label:'First name', required:true}],
		lastName:[String,{label:'Last name', required:true}],
		pwd:[String,{label:'Password', required:true}]
	},
},{
});