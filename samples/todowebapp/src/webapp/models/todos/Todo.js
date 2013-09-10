db.add('Todo',{
	static:{
		//parent:'Searchable', behaviours:['Child'],
		
		Fields:{
			_id:[String],
			name:[String,{required:true}],
			done:[Boolean]
		},
		
		create:function(name,callback){
			var todo=new this;
			todo.set('name',name);
			callback(todo,todo.insert());
		}
	},
	
	done:function(){
		this.set('done',true);
		this.updateWait(function(){
			//this.
		}.bind(this));
	},
	_render:function(wrapper){
		S.log('render model',this);
		var state=$.span().setClass('state');
		if(this.state==='new'||this.state==='pending') state.append('<img src="/web/sync-14.gif"/>');
		wrapper.id('todo_'+this.id()).text(this.name()).append(state);
	}
});