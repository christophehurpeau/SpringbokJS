var argumentum=require('argumentum');

argumentum.load({
	script:'sJsCore',
	commandRequired:true,
	commands:{
		'build':{
			abbr:'b',
			help:'Build springbokjs project',
			callback:function(){return require('./commands/build').core(false)},
		},
		'watch':{
			abbr:'w',
			help:'Watch springbokjs project and rebuild if something changed',
			callback:function(){return require('./commands/build').core(true)},
		}
	}
}).parse();
