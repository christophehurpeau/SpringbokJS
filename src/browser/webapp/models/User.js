db.add('User',{
	//parent:'Searchable', behaviours:['Child'],
	
	Fields:{
		_id:[String,{label:'Username', required:true}],
		firstName:[String,{label:'First name', required:true}],
		lastName:[String,{label:'Last name', required:true}],
		pwd:[String,{label:'Password', required:true}]
	},
	
	create:function(name,callback){
		var todo=new this;
		todo.set('name',name);
		callback(todo,todo.insert());
	}
},{
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