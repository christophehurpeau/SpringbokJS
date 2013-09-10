
require('springbokjs-utils');

require('springbokjs-utils/es6/Map');
require('springbokjs-utils/es6/Set');

require('springbokjs-utils/UObj');
require('springbokjs-utils/UArray');
require('springbokjs-utils/UString/UString');
require('springbokjs-utils/UFiles');
require('springbokjs-utils/UDebug');
require('springbokjs-utils/USecure');
require('springbokjs-utils/UGenerator');


require('springbokjs-utils/Listenable');

require('springbokjs-logger/console');

S.log=console.log;//todo use logger



/* http://www.senchalabs.org/connect/vhost.html */


// https://github.com/glesperance/node-rocket/blob/master/lib/loader.js 
// https://github.com/jaredhanson/locomotive/blob/master/bin/lcm.js
// https://github.com/MaxaGfeller/mongee/blob/master/app.js
process.on('uncaughtException',function(err){
	console.error(err.stack);
});


var http = require('http');
var logger = new S.LoggerConsole;
logger._prefix = '[app] ';

global.App={
	logger: logger,
	info: logger.info.bind(logger),
	warn: logger.warn.bind(logger),
	error: logger.error.bind(logger),
	fatal: logger.fatal.bind(logger),
	debug: logger.debug.bind(logger),
	
	behaviours:[],
	init:function(dir){
		dir += '/';
		App.env = global.SPRINGBOK_ENV;
		App.appDir = dir+='dev/';
		global.Config=this.config('_' + App.env);
		App.router=new App.Router();
		
		['controllers','PControllers','views','models','PModels'].forEach(function(v){ App[v]={}; });
		global.M=App.models;
		
		App.entries={};
		App.entriesList=Object.freeze(Object.keys(Config.entries));
		App.entriesList.forEach(function(entry){
			App.entries[entry]=entry==='main' ? {prefix:'',suffix:''} : {prefix:entry+'.',suffix:'.'+entry};
			App.entries[entry].host=Config.entries[entry];
			['controllers','PControllers','views'].forEach(function(v){ App[v][entry]={}; });
		});
		Object.freeze(App.entries);
		
		App.views.layouts={};
		
		Config.helpers && Config.helpers.forEach(function(helperName){
				require('./helpers/'+helperName); });
	},
	config:function(path){
		return UFiles.readYamlSync(this.appDir+'config/'+path+'.yml');
	},
	
	require:function(path){
		return require('./'+path);
	},
	loadComponent:function(component){
		S.extPrototype(http.IncomingMessage,component.requestMethods);
	},
	
	_init:function(){
		
	}
};

global.USecure.sha1WithSalt=function(string){
	return this.sha1(string+Config.secure.salt);
};
global.USecure.sha512WithSalt=function(string){
	return this.sha512(string+Config.secure.salt);
};
global.USecure.getSalt=function(){
	return Config.secure.salt;
};
