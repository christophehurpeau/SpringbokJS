#!/usr/bin/node
var argumentum=require('argumentum');

var rootPath=process.cwd()+'/';

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
			callback:function(){return require('./commands/build').app(rootPath,false)},
		},
		'watch':{
			abbr:'w',
			help:'Watch springbokjs project and rebuild if something changed',
			callback:function(){return require('./commands/build').app(rootPath,true)},
		},
		'tests':{
			abbr:'t',
			help:'Run tests',
			callback:function(){return require('nodeunit').reporters.default.run(rootPath+'dev/tests/')}
		}
	}
}).parse();
