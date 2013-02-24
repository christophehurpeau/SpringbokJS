var DEFAULT = { controller: 'Site', action: 'Index' };

var Route=function(attrs){
	UObj.extend(this,attrs);
};
Route.prototype={
	
};


var Router=module.exports=function(r,rl){
	var t=this;
	t.routes = {}; t.routesLangs = {};
	/* NODE */
	if(r===undefined){
		r=App.config('routes'),
		rl=App.config('routesLangs');
	}
	/* /NODE */
	
	console.log(r);
	if(!r.main) r={main:r};
	for(var entry in r){
		var entryRoutes=r[entry];
		t.routes[entry]={};
		
		if(entryRoutes.includesFromEntry){
			if(S.isStr(entryRoutes.includesFromEntry)) entryRoutes.includesFromEntry=[entryRoutes.includesFromEntry];
			for(var iife=0,life=entryRoutes.includesFromEntry.length; iife <life; iife++){
				var ife=entryRoutes.includesFromEntry[iife];
				if(S.isStr(ife)) UObj.union(entryRoutes,routes[ife]);
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
				
				if(specialEnd=routeLang.endsWith('/*')) routeLangPreg=routeLang.substr(0,-2);
				else if(specialEnd2=routeLang.endsWith('/*)?')) routeLangPreg=routeLang.slice(0,-4)+routeLang.slice(-2);
				else routeLangPreg=routeLang;
				
				routeLangPreg=routeLangPreg.replace('/','\/').replace('-','\-').replace('*','(.*)').replace('(','(?:');
				if(specialEnd) routeLangPreg+='(?:\/(.*))?';
				else if(specialEnd2) routeLangPreg=routeLangPreg.slice(0,-2)+'(?:\/(.*))?'+routeLangPreg.slice(-2);
				
				finalRoute[lang]=[new RegExp("^"+routeLangPreg.replace(/(\(\?)?\:([a-zA-Z_]+)/g,function(str,p1,p2){
					if(p1) return str;
					paramsNames.push(p2);
					if(paramsDef && paramsDef[p2]){
						var paramDefVal=S.isArray(paramsDef[p2]) ? paramsDef[p2][lang] : paramsDef[p2];
						return paramDefVal==='id' ? '([0-9]+)' : '('+paramDefVal+')';
					}
					if(UArray.has(['id'],p2)) return '([0-9]+)';
					return '([^\/]+)';
				}) + (ext ? (ext==='html' ? '(?:\.html)?':'\.'+ext) : '')+"$"),
					routeLang.replace(/(\:[a-zA-Z_]+)/g,'%s').replace(/[\?\(\)]/g,'').replace('/*','%s').trimRight()];
				if(finalRoute[lang][1]!=='/') finalRoute[lang][1]=UString.trimRight(finalRoute[lang][1],'/')
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
};
Router.prototype={
	find:function(all,lang,entry){
		var t = this,route = false,m,r,routes=t.routes[entry];
		all=t.all='/'+UString.trim(all,'/');
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
								c_a[k]=UString.ucFirst(t.untranslate(lang,params[v]));
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
	getLink:function(lang,entry,url){
		return S.isStr(url) ? this.getStringLink(lang,entry,url) : this.getArrayLink(lang,entry,url);
	},
	getArrayLink:function(lang,entry,params){},
	getStringLink:function(lang,entry,params){
		S.log([lang,entry,params,UString.split(UString.trim(params,'/'),'/',3)]);
		var route = UString.split(UString.trim(params,'/'),'/',3),
			controller = route[0],
			action = route[1] || DEFAULT.action,
			params = route[2] || '';
		S.log([route,controller,action,params]);
		route = this.routes[entry]['/:controller(/:action/*)?'];
		S.log(route);
		var froute = action === DEFAULT.action ? '/' + this.translate(lang,controller) : UString.format((route[lang]||route._)[1], this.translate(lang,controller), this.translate(lang,action), params ? '/' + params : '');
		return froute + (route.ext && !froute.endsWith('.' + route.ext) ? '.' + route.ext : '');
	},
	translate:function(lang,string){
		return this.routesLangs['->' + lang][string] || string;
	},
	untranslate:function(lang,string){
		/* DEV */
		if(!this.routesLangs[lang + '->']) throw new Error('Missing lang "'+lang+'"');
		if(!this.routesLangs[lang + '->'][string]) throw new Error('Missing translation for string "'+string+'"');
		/* /DEV */
		return this.routesLangs[lang + '->'][string] || string;
	}
};
