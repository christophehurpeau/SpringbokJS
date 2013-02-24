var fs=require('fs'), sysPath=require('path'), diveSync=require('diveSync'), async=require('async'), util=require('util'),
	connect=require('connect'), httpSendFile=require('send'),
	ejs=require('springbokejs'), ejsUtils=require('springbokejs/lib/utils');

require('springboktools');
require('springboktools/UObj');
require('springboktools/UArray');
require('springboktools/UString/UString');

require('./base/async');
S.log=console.log;//todo use CLogger
require('./utils');
require('./helpers');
require('./db/');

require.extensions['.ejs']=require.extensions['.js'];

// ; mongoose=require 'mongoose'

/* http://www.senchalabs.org/connect/vhost.html */


// https://github.com/glesperance/node-rocket/blob/master/lib/loader.js 
// https://github.com/jaredhanson/locomotive/blob/master/bin/lcm.js
// https://github.com/MaxaGfeller/mongee/blob/master/app.js
process.on('uncaughtException',function(err){
	console.error(err.stack);
});


require('./base/HttpRequest'); require('./base/HttpResponse');
require('./base/HttpException.js')
var Router=require('./base/Router');

global.App={
	behaviours:[],
	init:function(dir){
		dir += '/';
		App.env = fs.readFileSync(dir + 'env');
		App.appDir = dir+='dev/';
		global.Config=this.config('_' + App.env);
		App.router=new Router();
		
		['controllers','PControllers','views','models','PModels'].forEach(function(v){ App[v]={}; });
		global.M=App.models;
		
		App.entries={};
		App.entriesList=Object.keys(Config.entries);
		App.entriesList.forEach(function(entry){
			App.entries[entry]=entry==='main' ? {prefix:'',suffix:''} : {prefix:entry+'.',suffix:'.'+entry};
			App.entries[entry].host=Config.entries[entry];
			['controllers','PControllers','views'].forEach(function(v){ App[v][entry]={}; });
		});
		App.views.layouts={};
		
		Config.helpers && Config.helpers.forEach(function(helperName){
				require('./helpers/'+helperName); })
	},
	config:function(path){
		return U.Files.getJsonSync(this.appDir+'config/'+path+'.json');
	}
};
global.WEB_URL='/web/';
global.WEB_FOLDER='./';

App.BasicController=App.Controller=require('./base/Controller');
require('./base/Model');
App.Model=S.Model;
//App.View=require('./base/View');
App.CValidator=require('./components/CValidator');

require('./base/i18n');


App.start=function(port){
	var t=this,dir=t.appDir;
	t.Controller=require(dir+'AppController')/*(App.Controller)*/;
	
	App.entriesList.forEach(function(entry){
		if(entry!=='main'){
			var ucFirstEntry=UString.ucFirst(entry);
			t[ucFirstEntry+'Controller']=require(dir+'App'+ucFirstEntry+'Controller');
		}
	});
	
	
	var controllers={_:dir+'controllers'},models={_:dir+'models'},views={_:dir+'views'},viewsLayouts={_:dir+'viewsLayouts'};
	
	Config.plugins||(Config.plugins={})
	Config.pluginsPaths||(Config.pluginsPaths={});
	Config.pluginsPaths.Springbok=__dirname+'/plugins/';
	Config.plugins.SpringbokBase=['Springbok','base'];
	
	for(var keys=Object.keys(Config.plugins),i=0;i<keys.length;i++){
		var v=Config.plugins[keys[i]],pluginPath=Config.pluginsPaths[v[0]]+v[1];
		try{
			var dependencies=U.Files.getJsonSync(pluginPath+'/config/dependencies.json');
			dependencies && UObj.forEach(dependencies,function(k,v){ if(!Config.plugins[k]){ Config.plugins[k]=v; keys.push(k); } });
		}catch(err){}
	}
		
	UObj.forEach(Config.plugins,function(k,v){
		var pluginPath=Config.pluginsPaths[v[0]]+v[1];
		controllers[k]=pluginPath+'/controllers';
		models[k]=pluginPath+'/models';
		views[k]=pluginPath+'/views';
		viewsLayouts[k]=pluginPath+'/viewsLayouts';
	});
	
	
	var forEachDir=function(o,ext,onEnd,callback,entries){
		ext=ext||'js';
		test=new RegExp('\.'+ext+'$');
		async.forEachSeries(Object.keys(o),function(pluginName,onEnd){
			var dir_=o[pluginName];
			UObj.forEach(entries||App.entries,function(entryName,entry){
				var dir=dir_+entry.suffix;
				if(fs.existsSync(dir)) diveSync(dir,function(err,path){
					if(err) console.error(err.stack);
					else if(test.test(path)){
						callback(dir,path,entryName);
					}
				});
			});
			onEnd();
		},onEnd);
	};
	
	async.series([
		function(onEnd){
			console.log('Loading controllers...');
			forEachDir(controllers,null,onEnd,function(dir,path,entryName){
				var name = path.slice(dir.length+1,-3), c = require(path);
				//if(S.isFunc(c)) c=c(t);
				if(t.controllers[entryName][name]===undefined) t.controllers[entryName][name]=c;
				else t.PControllers[entryName][name]=c;
			})
		},
		function(onEnd){
			S.log('Loading views...');
			forEachDir(views,'ejs',onEnd,function(dir,path,entryName){
				var name=name = path.slice(dir.length+1,-4);
				if(t.views[entryName][name]===undefined){
					var fn=require(path);
					t.views[entryName][name]=function(H,locals){ return fn(H,locals,ejs.filters,ejsUtils.escape); }
				}
			});
		},
		function(onEnd){
			S.log('Loading layouts...');
			forEachDir(viewsLayouts,'ejs',onEnd,function(dir,path,entryName){
				var name=name=path.slice(dir.length+1,-4);
				S.log('Loading layout: '+name);
				if(t.views['layouts'][name]===undefined){
					var fn=require(path);
					t.views['layouts'][name]=function(H,locals){ return fn(H,locals,ejs.filters,ejsUtils.escape); }
				}
			},{layouts:{prefix:'',suffix:''}});
		},
		function(onEnd){
			S.log('Creating db connections...');
			S.Db.init(onEnd);
		},
		function(onEnd){
			S.log('Loading models...');
			forEachDir(models,null,onEnd,function(dir,path){
				var name = sysPath.basename(path).slice(0,-3), c = require(path);
				S.log('Loading model: '+name);
				//if(S.isFunc(c)) c=c(t);
				if(t.models[name]===undefined) t.models[name]=c;
				else t.PModels[name]=c;
			});
		},
		function(onEnd){
			S.log('Initializing models...');
			S.asyncObjForEach(t.models,function(modelName,model,onEnd){
				S.log('Initialize model: '+modelName);
				model.init(onEnd);
			},function(){
				S.log('Models initialized');
				onEnd();
			});
		},
		
		function(onEnd){
			console.log(views,t.views);
			console.log(t.controllers);
			controllers=views=models=undefined;
			
			
			var webDir=t.appDir+'web';
		
			app = connect()
				/* DEV */.use(connect.errorHandler())/* /DEV */
				.use(connect.compress())
				.use(connect.favicon('web/favicon.ico'))
				/* DEV */.use(connect.logger('dev'))/* /DEV */
				/* PROD */.use(connect.logger())/* /PROD */
				.use(function(req,res,next){
					if('GET' != req.method && 'HEAD' != req.method) return next();
					var path=req._parsedUrl.pathname;
					if(path.substr(0,5)!=='/web/') return next();
					httpSendFile(req,path.substr(5))
						.maxage(86400000)
						.root(webDir)
						.on('error',function(err){
							res.statusCode=404;
							res.end("Not Found");
						})
						.on('directory',function directory(){
							res.statusCode=404;
							res.end("Not Found");
						})
						.pipe(res);
						
					//connect['static'](t.appDir+'web',{/*redirect:false,*/maxAge:86400000}
				})
				.use(connect.query())
				.use(function(req,res){
					try{
						var pathname=req._parsedUrl.pathname, host=req.headers.host.split(':')[0];
					
						/* DEV */
						if(host==='localhost'){
							if(pathname && pathname.charAt(1)==='~'){ //0:'/',1:'~'
								var e_p=UString.splitLeft(pathname.substr(1),'/');
								if(e_p){
									pathname='/'+e_p[1];
									req.entry=e_p[0].substr(1);
								}else req.entry='main';
							}else req.entry='main';
						}else{
						
						/* /DEV */
						req.entry=Config.reversedEntries[host];
						/* DEV */
						}
						
						if(!Config.entries[req.entry]) throw new Error('This entry doesn\'t exists : "'+req.entry+'"');
						/* /DEV */
						
						var route=req.route=t.router.find(pathname,'en',req.entry);
						req.currentUrl=pathname;//window.location.pathname
						
						var controller=t.controllers[req.entry][route.controller];
						if(!controller)
							/* DEV */res.exception(HttpException.newInternalServerError('Controller Not Found: '+route.controller));/* /DEV */
							/* PROD */res.notFound();/* /PROD */
						else{
							controller=new controller(t,req,res);
							if(controller.beforeDispatch(req,res)!==false)
								controller[route.action](req,res);
						}
					}catch(err){
						res.exception(err);
					}
					//res.send('Hello' + JSON.stringify(t.controllers) + JSON.stringify(Config));
				}).listen(port=(port||3000));
			console.log("Listening on port "+port);
			onEnd();
		}
	]/*,function(err){ if(err){ console.err(err); throw err; } }*/);
	/* http://www.sitepen.com/blog/2010/07/14/multi-node-concurrent-nodejs-http-server/ */
	/* better : http://nodejs.org/api/cluster.html  + graceful restart : http://stackoverflow.com/questions/8933982/how-to-gracefully-restart-a-nodejs-server */
};
/*

exports.createServer: ->
	app=express()
	app.get '/', (req, res) ->
		res.send "Hello World"
		return
	app.listen 3000
	console.log "Listening on port 3000"

#app=express()
#db=mongoose.connect 'mongodb://localhost/test'

# parse request bodies (req.body)
#app.use(express.bodyParser());

# support _method (PUT in forms etc)
# app.use(express.methodOverride());

# sload controllers
require('./lib/boot')(app, { verbose: !module.parent });
*/

