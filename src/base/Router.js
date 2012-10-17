var fs = require('fs'),
	DEFAULT = { controller: 'Site', action: 'Index' };

var Route=function(attrs){
	S.extObj(this,attrs);
};
Route.prototype={
	
};

global.Router={
	init:function(r,rl){
		var t=this;
		t.routes = {}; t.routesLangs = {};
		if(r===undefined){
			r=JSON.parse(fs.readFileSync(App.appDir + 'config/routes.json')),
			rl=JSON.parse(fs.readFileSync(App.appDir + 'config/routesLangs.json'));
		}
		
		//console.log(this.routes);
		if(!r.index) r={index:r};
		for(var entry in r){
			var entryRoutes=r[entry];
			t.routes[entry]={};
			
			if(entryRoutes.includesFromEntry){
				if(S.isStr(entryRoutes.includesFromEntry)) entryRoutes.includesFromEntry=[entryRoutes.includesFromEntry];
				for(var iife=0,life=entryRoutes.includesFromEntry.length; iife <life; iife++){
					var ife=entryRoutes.includesFromEntry[iife];
					if(S.isStr(ife)) S.oUnion(entryRoutes,routes[ife]);
					else{
						for(var iirfe=0,lirfe=ife.length;iirfe<lirfe;iirfe++){
							var includeRouteFromEntry=ife[iirfe];
							entryRoutes[includeRouteFromEntry]=routes[ife][includeRouteFromEntry];
						}
					}
				}
				delete entryRoutes.includesFromEntry;
			}
			
			for (var url in entryRoutes){
				var route=entryRoutes[url], finalRoute=t.routes[entry][url]={ 0: route[0] };
				var paramsDef = route[1] || null,ext;
				//langs=route[2] || null
				if (route.ext) ext = finalRoute.ext = route.ext;
				route = route[2] || {};
				route._ = url;
			
				for(var lang in route){
					var routeLang=route[lang],paramsNames=[],specialEnd,specialEnd2,routeLangPreg;
					
					if(specialEnd=S.sEndsWith(routeLang,'/*')) routeLangPreg=routeLang.substr(0,-2);
					else if(specialEnd2=S.sEndsWith(routeLang,'/*)?')) routeLangPreg=routeLang.slice(0,-4)+routeLang.substr(routeLang.length-2);
					else routeLangPreg=routeLang;
					
					routeLangPreg=routeLangPreg.replace('/','\/').replace('-','\-').replace('*','(.*)').replace('(','(?:');
					if(specialEnd) routeLangPreg+='(?:\/(.*))?';
					else if(specialEnd2) routeLangPreg=routeLangPreg.slice(0,-2)+'(?:\/(.*))?'+routeLangPreg.substr(routeLangPreg.length-2);
					
					finalRoute[lang]=[new RegExp("^"+routeLangPreg.replace(/(\(\?)?\:([a-zA-Z_]+)/g,function(str,p1,p2){
						if(p1) return str;
						paramsNames.push(p2);
						if(paramsDef && paramsDef[p2]){
							var paramDefVal=S.isArray(paramsDef[p2]) ? paramsDef[p2][lang] : paramsDef[p2];
							return paramDefVal==='id' ? '([0-9]+)' : '('+paramDefVal+')';
						}
						if(S.aHas(['id'],p2)) return '([0-9]+)';
						return '([^\/]+)';
					}) + (ext ? (ext==='html' ? '(?:\.html)?':'\.'+ext) : '')+"$"),
						S.sRtrim(routeLang.replace(/(\:[a-zA-Z_]+)/g,'%s').replace(/[\?\(\)]/g,'').replace('/*','%s'))];
					if(finalRoute[lang][1]!=='/') finalRoute[lang][1]=S.sRtrim(finalRoute[lang][1],'/')
					if(paramsNames) finalRoute[':']=paramsNames;
				}
				finalRoute.paramsCount=finalRoute._[1].split('%s').length-1;
			}
		}
		//console.log(this.routes);
		
		//Langs
		//console.log(rl);
		var s,tr,lang,s2;
		for (s in rl) {
			tr = rl[s];
			for (lang in tr) {
				s2 = tr[lang];
				if (!t.routesLangs['->' + lang]) {
					t.routesLangs['->' + lang] = {};
					t.routesLangs[lang + '->'] = {};
				}
				t.routesLangs['->' + lang][s] = s2;
				t.routesLangs[lang + '->'][s2] = s;
			}
		}
	},
	
	find:function(all,lang,entry){
		var t = this,route = false,m,r,routes=t.routes[entry||'index'];
		all=t.all='/'+S.sTrim(all, '/');
		console.log('router: find: "'+all+'"');
		for (var i in routes){
			r = routes[i];
			console.log('try: ', (r[lang] || r._)[0], (r[lang] || r._)[0].exec(all));
			if(m=(r[lang]||r._)[0].exec(all)){
				//console.log('match : ',m,r);
				var c_a=r[0].split('.'),params={};
				
				if(r[':']){
					m.shift(); // remove m[0];
					var nbNamedParameters=r[':'].length,countMatches=m.length;
					if(countMatches !== 0){
						for(var k in r[':']) params[r[':'][k]]=m.shift();
					}
					var cAndA=['controller','action'];
					for (var k in cAndA){
						var v=cAndA[k];
						if(c_a[k]==='!'){
							if(params[v]){
								c_a[k]=S.sUcFirst(t.untranslate(params[v],lang));
								delete params[v];
							}else c_a[k]=DEFAULT[v];
						}
					}
				}
				
				route=new Route({
					all:all,
					controller:c_a[0],
					action:c_a[1],
					nParams:params,//named
					sParams:m,//simple
					ext:false
				});
				break
			}
		}
		return route;
	},
	getLink:function(url){
		return S.isStr(url) ? this.getStringLink(url) : this.getArrayLink(url);
	},
	getArrayLink:function(params){},
	getStringLink:function(params){
		var route = S.sTrim(params, '\/').split('/', 3),
			controller = route[0],
			action = route[1] || DEFAULT.action,
			params = route[2];
		route = this.routes['/:controller(/:action/*)?'];
		var froute = action === DEFAULT.action ? '/' + this.translate(controller) : S.sFormat(route.en[1], this.translate(controller), this.translate(action), params ? '/' + params : '');
		return froute + (route.ext && !S.sEndsWith(froute, '.' + route.ext) ? '.' + route.ext : '');
	},
	translate:function(string,lang){
		return this.routesLangs['->' + lang][string] || string;
	},
	untranslate:function(string,lang){
		return this.routesLangs[lang + '->'][string] || string;
	}
};
