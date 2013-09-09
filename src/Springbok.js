
require('springboktools');

require('springboktools/es6/Map');
require('springboktools/es6/Set');

require('springboktools/UObj');
require('springboktools/UArray');
require('springboktools/UString/UString');
require('springboktools/UFiles');
require('springboktools/UDebug');
require('springboktools/USecure');
require('springboktools/UGenerator');


require('springboktools/Listenable');

S.log=console.log;//todo use CLogger



/* http://www.senchalabs.org/connect/vhost.html */


// https://github.com/glesperance/node-rocket/blob/master/lib/loader.js 
// https://github.com/jaredhanson/locomotive/blob/master/bin/lcm.js
// https://github.com/MaxaGfeller/mongee/blob/master/app.js
process.on('uncaughtException',function(err){
	console.error(err.stack);
});


var http = require('http');

global.App={
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
				require('./helpers/'+helperName); })
	},
	config:function(path){
		return UFiles.readYamlSync(this.appDir+'config/'+path+'.yml');
	},
	
	require:function(path){
		return require('./'+path);
	},
	loadComponent:function(component){
		S.extProto(http.IncomingMessage,component.requestMethods);
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
