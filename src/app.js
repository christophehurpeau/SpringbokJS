var fs=require('fs'), sysPath=require('path'), diveSync=require('diveSync'), util=require('util'),
	connect=require('connect'), httpSendFile=require('send'),
	ejs=require('springbokejs'), ejsUtils=require('springbokejs/lib/utils');

require('springboktools');

require.extensions['.ejs']=require.extensions['.js'];

// ; mongoose=require 'mongoose'

/* http://www.senchalabs.org/connect/vhost.html */


// https://github.com/glesperance/node-rocket/blob/master/lib/loader.js 
// https://github.com/jaredhanson/locomotive/blob/master/bin/lcm.js
// https://github.com/MaxaGfeller/mongee/blob/master/app.js
process.on('uncaughtException', function (err){
	console.error(err.stack);
});


require('./base/HttpRequest');
var Router=require('./base/Router');
var HttpException=require('./base/HttpException.js');

global.App={
	init:function(dir){
		dir += '/';
		App.env = fs.readFileSync(dir + 'env');
		App.appDir = dir+='dev/';
		App.config = JSON.parse(fs.readFileSync(dir + 'config/_' + App.env + '.json'));
		App.router=new Router();
		App.controllers={}; App.PControllers={};
		App.views={};
	}
};
global.WEB_URL='/web/';
global.WEB_FOLDER='./';

App.Controller=require('./base/Controller');
//App.View=require('./base/View');
App.CValidator=require('./components/CValidator');

require('./base/i18n');


App.start=function(port){
	var t=this,dir=t.appDir;
	t.Controller=require(dir+'AppController')(App.Controller);
	//todo : foreach entries
	var controllers={_:dir+'controllers'},views={v:dir+'views',vl:dir+'viewsLayouts'};
	if(t.config.plugins){
		t.config.pluginsPaths||(t.config.pluginsPaths={});
		t.config.pluginsPaths.Springbok=__dirname+'/plugins/';
		S.oForEach(t.config.plugins,function(k,v){
			var pluginPath=t.config.pluginsPaths[v[0]]+v[1];
			if(fs.existsSync(pluginPath+'/controllers')) controllers[v[0]]=pluginPath+'/controllers';
			if(fs.existsSync(pluginPath+'/views')) views[v[0]+'v']=pluginPath+'/views';
			if(fs.existsSync(pluginPath+'/viewsLayouts')) views[v[0]+'vL']=pluginPath+'/viewsLayouts';
		});
	}
	
	S.oForEach(controllers,function(pluginName,dir){
		diveSync(dir,function(err,path){
			if(err) console.error(err.stack);
			else if(/\.js$/.test(path)) {
				var name = sysPath.basename(path).slice(0,-3), c = require(path);
				if(S.isFunc(c)) c=c(t);
				if(t.controllers[name]===undefined) t.controllers[name]=c;
				else t.PControllers[name]=c;
			}
		});
	});
	
	S.oForEach(views,function(pluginName,dir){
		diveSync(dir,function(err,path){
			if(err) console.error(err.stack);
			else if(/\.ejs$/.test(path)) {
				var name = path.slice(sysPath.dirname(dir).length+1,-4);
				if(t.views[name]===undefined){
					var fn=require(path);
					t.views[name]=function(H,locals){ return fn(H,locals,ejs.filters,ejsUtils.escape); }
				}
			}
		});
	});
	delete controllers;
	delete views;
	console.log(views,t.views);
	
	t.datastores = [];
	
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
			var route=req.route=t.router.find(req._parsedUrl.pathname,'en');
			try{
				var controller=t.controllers[route.controller];
				if(!controller)
					/* DEV */HttpException.internalServerError('Controller Not Found: '+route.controller);/* /DEV */
					/* PROD */HttpException.notFound();/* /PROD */
				controller=new controller(t,req,res);
				controller[route.action](req,res);
			}catch(err){
				if(err instanceof HttpException){
				}else{
					/* DEV */console.log(err.stack);/* /DEV */
					err=HttpException.newInternalServerError();
				}
				res.statusCode=err.code;
				res.end(err.details);
			}
			//res.send('Hello' + JSON.stringify(t.controllers) + JSON.stringify(t.config));
		}).listen(port=(port||3000));
	console.log("Listening on port "+port);
	
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

