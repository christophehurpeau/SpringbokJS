var argumentum=require('argumentum');

argumentum.load({
	script:'sJs',
	commandRequired:true,
	commands:{
		'new':{
			abbr:'n',
			help:'Create new springbokjs project',
			callback:function(){return require('./commands/create')},
		},
		'build':{
			abbr:'b',
			help:'Build springbokjs project',
			callback:function(){return require('./commands/build').project(false)},
		},
		'watch':{
			abbr:'w',
			help:'Watch springbokjs project and rebuild if something changed',
			callback:function(){return require('./commands/build').project(true)},
		}
	}
}).parse();
