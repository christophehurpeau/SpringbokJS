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
	
	isDone:function(){
		return this.get('done');
	},
	done:function(){
		return this.updateField('done',true);
	},
	_render:function(wrapper){
		S.log('render model',this);
		var state=$.span().setClass('state');
		if(this.state==='new'||this.state==='pending') state.append('<img src="/web/sync-14.gif"/>');
		wrapper.id('todo_'+this.id()).text(this.name()).append(state);
		var checkbox = $.create('input').attr('type','checkbox').prependTo(wrapper)
						.on('change',function(){ this.updateField('done',!this.get('done')); }.bind(this));
		if(this.get('done')) checkbox.prop('checked',true);
	}
});