db.add('Todo',{
	//parent:'Searchable', behaviours:['Child'],
	
	Fields:{
		name:[String],
		done:[Boolean]
	},
},{
	done:function(){
		this.data.done=true;
		this.updateWait(function(){
			
		});
	}
});