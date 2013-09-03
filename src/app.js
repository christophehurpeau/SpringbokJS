/*#if DEV*/
console.log('App: DEV');
/*#else*/
console.log('App: PROD');
/*#/if*/
var fs=require('fs'), sysPath=require('path'), diveSync=require('diveSync'), async=require('async'), util=require('util'),
	connect=require('connect'), httpSendFile=require('send'),
	ejs=require('springbokejs'), ejsUtils=require('springbokejs/lib/utils');


require('./Springbok');

require('./helpers/helpers');
require('./db/');

require.extensions['.ejs']=require.extensions['.js'];

require('./base/HttpRequest'); require('./base/HttpResponse');
require('./base/HttpException');
require('./base/Router');

global.WEB_URL='/web/';
global.WEB_FOLDER='./';

App.BasicController=App.Controller=require('./base/Controller');
require('./base/Model');
//App.View=require('./base/View');
App.loadComponent(require('./components/CValidator'));

require('./base/i18n');

App.start=function(port){
	port || (port = Config.port);
	if(port) App._start(port);
	else{
		var portscanner=require('portscanner');
		portscanner.findAPortNotInUse(3000,4000,'localhost',function(err,port){
			if(err) return console.error('Error, ',err);
			port && App._start(port);
		});
	}
};


App._start=function(port){
	S.log('Starting app on port '+port);
	var t=this,dir=t.appDir;
	
	if(!fs.existsSync(dir + 'config/ssl-key.pem'))
		App.ssl = {};
	else
		App.ssl = {
			key: fs.readFileSync(dir + 'config/ssl-key.pem'),
			cert: fs.readFileSync(dir + 'config/ssl-cert.pem')
		};
	
	t.Controller=require(dir+'AppController')/*(App.Controller)*/;
	
	App.entriesList.forEach(function(entry){
		if(entry!=='main'){
			var ucFirstEntry=UString.ucFirst(entry);
			t[ucFirstEntry+'Controller']=require(dir+entry+'/App'+ucFirstEntry+'Controller');
		}
	});
	
	
	var paths={_:dir};
	
	Config.plugins||(Config.plugins={});
	Config.pluginsPaths||(Config.pluginsPaths={});
	Config.pluginsPaths.Springbok=__dirname+'/plugins/';
	Config.plugins.SpringbokBase=['Springbok','base'];
	
	for(var keys=Object.keys(Config.plugins),i=0;i<keys.length;i++){
		var v=Config.plugins[keys[i]],pluginPath=Config.pluginsPaths[v[0]]+v[1];
		try{
			var dependencies=UFiles.readYamlSync(pluginPath+'/config/dependencies.yml');
			dependencies && UObj.forEach(dependencies,function(k,v){ if(!Config.plugins[k]){ Config.plugins[k]=v; keys.push(k); } });
		}catch(err){}
	}
		
	UObj.forEach(Config.plugins,function(k,v){
		var pluginPath=Config.pluginsPaths[v[0]]+v[1]+'/';
		paths[k]=pluginPath;
	});
	
	
	var forEachDir=function(folderName,ext,onEnd,callback){
		var test=new RegExp('\.'+(ext||'js')+'$');
		UObj.forEachSeries(paths,function(pluginName,dir_,onEnd){
			UObj.forEach(App.entries,function(entryName,entry){
				var dir=dir_+(folderName==='models'?'':entryName+'/')+folderName;
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
			forEachDir('controllers',null,onEnd,function(dir,path,entryName){
				var name = path.slice(dir.length+1,-3), c = require(path);
				//if(S.isFunc(c)) c=c(t);
				if(t.controllers[entryName][name]===undefined) t.controllers[entryName][name]=c;
				else t.PControllers[entryName][name]=c;
			});
		},
		function(onEnd){
			S.log('Loading views...');
			forEachDir('views','ejs',onEnd,function(dir,path,entryName){
				var name=path.slice(dir.length+1,-4);
				S.log('Loading view: '+name);
				if(t.views[entryName][name]===undefined){
					var fn=require(path);
					t.views[entryName][name]=function(H,locals){ return fn(H,locals,ejs.filters,ejsUtils.escape); };
				}
			});
		},
		function(onEnd){
			S.log('Loading layouts...');
			forEachDir('viewsLayouts','ejs',onEnd,function(dir,path,entryName){
				var name= entryName+'/'+path.slice(dir.length+1,-4);
				S.log('Loading layout: '+name);
				if(t.views['layouts'][name]===undefined){
					var fn=require(path);
					t.views['layouts'][name]=function(H,locals){ return fn(H,locals,ejs.filters,ejsUtils.escape); };
				}
			});
		},
		function(onEnd){
			S.log('Creating db connections...');
			S.Db.init(onEnd);
		},
		function(onEnd){
			S.log('Loading models...');
			forEachDir('models',null,onEnd,function(dir,path){
				var name = sysPath.basename(path).slice(0,-3), c = require(path);
				S.log('Loading model: '+name);
				//if(S.isFunc(c)) c=c(t);
				if(t.models[name]===undefined) t.models[name]=c;
				else t.PModels[name]=c;
			});
		},
		function(onEnd){
			S.log('Initializing models...');
			//series because Parent/Child
			UObj.forEachSeries(t.models,function(modelName,model,onEnd){
				S.log('Initialize model: '+modelName);
				//model.init(onEnd);
				model.beforeInit && model.beforeInit();
				model.init(function(){
					S.log('Initialize model: '+modelName+' ended');
					onEnd.apply(null,arguments);
				});
			},function(){
				S.log('Models initialized');
				onEnd();
			});
		},
		
		function(onEnd){
			console.log(t.views);
			console.log(t.controllers);
			controllers=views=models=undefined;
			
			
			var webDir=t.appDir+'web';
		
			app = connect()
				/*#if DEV*/ .use(connect.errorHandler()) /*#/if*/
				.use(connect.compress())
				.use(connect.favicon('web/favicon.ico'))
				/*#if DEV*/ .use(connect.logger('dev'))
				/*#else*/ .use(connect.logger())
				/*#/if*/
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
						.on('directory',function(){
							res.statusCode=404;
							res.end("Not Found");
						})
						.pipe(res);
					
					// TODO : return pre-gzipped file, if statusCode===200
					/*if (req.method === 'HEAD' || !~accept.indexOf('gzip') ||
								!matchType.test(type) || encoding ||
								(~ua.indexOf('MSIE 6') && !~ua.indexOf('SV1')))
						return;
					*/
					//res.setHeader('Content-Encoding', 'gzip');
					//res.setHeader('Vary', 'Accept-Encoding');
					
					//connect['static'](t.appDir+'web',{/*redirect:false,*/maxAge:86400000}
				})
				.use(connect.query())
				.use(connect.urlencoded())
				.use(connect.multipart())
				.use(function(req,res){
					try{
						var pathname=req._parsedUrl.pathname, host=req.headers.host.split(':')[0];
					
						/*#if DEV*/
						if(host==='localhost'){
							if(pathname && pathname.charAt(1)==='~'){ //0:'/',1:'~'
								var e_p=UString.splitLeft(pathname.substr(1),'/');
								if(e_p){
									pathname='/'+e_p[1];
									req.entry=e_p[0].substr(1);
								}else req.entry='main';
							}else req.entry='main';
						}else{
							console.log('host= '+host,Config.hostsEntry);
						/*#/if*/
						req.entry=Config.hostsEntry[host];
						/*#if DEV*/
						}
						
						if(!req.entry) throw new Error('Entry undefined');
						if(!Config.entries[req.entry]) throw new Error('This entry doesn\'t exists : "'+req.entry+'"');
						/*#/if*/
						
						var route=req.route=t.router.find(pathname,'en',req.entry);
						req.currentUrl=pathname;//window.location.pathname
						
						var controller=t.controllers[req.entry][route.controller];
						if(!controller)
							/*#if DEV*/
							res.exception(HttpException.newInternalServerError('Controller Not Found: '+route.controller));
							/*#else*/
							res.notFound();
							/*#/if*/
						else{
							controller=new controller(t,req,res);
							if(controller.beforeDispatch(req,res)!==false)
								controller[route.action](req,res);
						}
					}catch(err){
						res.exception(err);
					}
					//res.send('Hello' + JSON.stringify(t.controllers) + JSON.stringify(Config));
				});
				
				app.listen(port,/*'localhost',*/function(){
					console.log((new Date()).toTimeString().split(' ')[0] + " Listening on port "+port);
					/*#if DEV*/
					var notify = require('notify-send');
					//notify-send "Volume" -i /usr/share/notify-osd/icons/gnome/scalable/status/notification-audio-volume-high.svg -h int:value:100 -h string:synchronous:volume
					notify.timeout(1000).notify(Config.projectName, 'Listening on port '+port);
					// run : firefox -P -no-remote "springbokjs" http://christophe.hurpeau.com:3131/ &
					/*#/if*/
					
					fs.exists(App.appDir+'app.js',function(exists){
						exists && require(App.appDir+'app.js');
					});
				});
			
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

