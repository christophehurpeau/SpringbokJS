var DEFAULT = { controller: 'Site', action: 'Index' };

App.Route=function(attrs){
	UObj.extend(this,attrs);
};
App.Route.prototype={
	
};

App.Router=function(r,rl){
	var t=this;
	t.routes = new Map; t.routesLangs = new Map;
	/*#if NODE*/
	if(r===undefined){
		r=App.config('routes'),
		rl=App.config('routesLangs');
	}
	/*#/if*/
	
	
	//Langs
	//console.log(rl);
	UObj.forEach(rl,function(s,tr){
		if(!tr.en) tr.en=s;
		UObj.forEach(tr,function(lang,s2){
			if (!t.routesLangs.has('->' + lang)) {
				t.routesLangs.set('->' + lang,new Map);
				t.routesLangs.set(lang + '->',new Map);
			}
			
			t.routesLangs.get('->' + lang).set(s.toLowerCase(),s2);
			t.routesLangs.get(lang + '->').set(s2.toLowerCase(),s);
		});
	});
	
	// Routes
	if(!r.main) r={main:r};
	
	UObj.forEach(r,function(entry,entryRoutes){
		t.routes.set(entry,new Map);
		
		if(entryRoutes.includesFromEntry){
			if(S.isString(entryRoutes.includesFromEntry)) entryRoutes.includesFromEntry=[entryRoutes.includesFromEntry];
			entryRoutes.includesFromEntry.forEach(function(ife){
				console.log("ife=",ife,S.isString(ife));
				throw new Error('Todo: map addAll');
				if(S.isString(ife)) UObj.union(entryRoutes,routes[ife]);
				else{
					ife.forEach(function(includeRouteFromEntry){
						entryRoutes[includeRouteFromEntry]=routes[ife][includeRouteFromEntry];
					});
				}
			});
			delete entryRoutes.includesFromEntry;
		}
		
		UObj.forEach(entryRoutes,function(url,route){
			var finalRoute={ 0: route[0] }, paramsDef=route[1]||null, ext;
			//langs=route[2] || null
			if (route.ext) ext = finalRoute.ext = route.ext;
			route = {};
			if(route[2]){
				route=route[2];
				Config.allLangs.forEach(function(lang){
					if(!route[lang]){
						/*#if DEV*/if(lang==='en') /*#/if*/route.en=url;
						/*#if DEV*/else throw new Error('Missing lang "'+lang+'" for route "'+url+'"');/*#/if*/
					}
				});
			}else if(!url.match(/\/[a-z]/)) Config.allLangs.forEach(function(lang){ route[lang]=url; });
			else Config.allLangs.forEach(function(lang){
				route[lang]=url.replace(/\/([a-z\-]+)/g,function(str,p1){
					if(!t.routesLangs.get('->' + lang).get(p1)) throw new Error('Missing traduction "'+p1+'" for lang "'+lang+'"');
					return '/'+t.routesLangs.get('->' + lang).get(p1).toLowerCase();
				});
			});
			
			UObj.forEach(route,function(lang,routeLang){
				var paramsNames=[],specialEnd,specialEnd2,routeLangPreg;
				
				if(specialEnd=routeLang.endsWith('/*')) routeLangPreg=routeLang.substr(0,-2);
				else if(specialEnd2=routeLang.endsWith('/*)?')) routeLangPreg=routeLang.slice(0,-4)+routeLang.slice(-2);
				else routeLangPreg=routeLang;
				
				routeLangPreg=routeLangPreg.replace(/\//g,'\\/').replace(/\-/g,'\-').replace(/\*/g,'(.*)').replace(/\(/g,'(?:');
				if(specialEnd) routeLangPreg+='(?:\/(.*))?';
				else if(specialEnd2) routeLangPreg=routeLangPreg.slice(0,-2)+'(?:\/(.*))?'+routeLangPreg.slice(-2);
				
				finalRoute[lang]=[new RegExp("^"+routeLangPreg.replace(/(\(\?)?\:([a-zA-Z_]+)/g,function(str,p1,p2){
					if(p1) return str;
					paramsNames.push(p2);
					if(paramsDef && paramsDef[p2]){
						var paramDefVal;
						if(S.isArray(paramsDef[p2])) paramDefVal=paramsDef[p2][lang];
						else{
							paramDefVal=paramsDef[p2];
							if(paramDefVal.match(/^[a-z\|\-]+$/i))
								paramDefVal.split('|').map(function(s){ return t.routesLangs['->' + lang][s].toLowerCase(); }).join('|');
						}
						return paramDefVal==='id' ? '([0-9]+)' : '('+paramDefVal+')';
					}
					if(UArray.has(['id'],p2)) return '([0-9]+)';
					return '([^\/]+)';
				}) + (ext ? (ext==='html' ? '(?:\.html)?':'\.'+ext) : '')+"$"),
					routeLang.replace(/(\:[a-zA-Z_]+)/g,'%s').replace(/[\?\(\)]/g,'').replace('/*','%s').trimRight()];
				if(finalRoute[lang][1]!=='/') finalRoute[lang][1]=UString.trimRight(finalRoute[lang][1],'/');
				if(paramsNames) finalRoute[':']=paramsNames;
			});
			finalRoute.paramsCount=finalRoute[Config.allLangs[0]][1].split('%s').length-1;
			t.routes.get(entry).set(url,finalRoute);
		});
	});
};
App.Router.routeStripper=/^\/+|\/+$/g;
App.Router.prototype={
	find:function(all/*#if NODE*/,lang,entry/*#/if*/){
		var t = this,route = false,m,r,routes=t.routes.get(/*#ifelse NODE*/entry||'main'/*#/if*/)/*#if BROWSER*/,lang=App.lang/*#/if*/;
		all=t.all='/'+all.replace(App.Router.routeStripper,'');
		S.log('router: find: "'+all+'"');
		//S.log(routes);
		UObj.forEach(routes,function(i,r){
			//S.log('route: ',r);
			//S.log('try: ', r[lang][0], r[lang][0].exec(all));
			if(m=r[lang][0].exec(all)){
				//console.log('match : ',m,r);
				var c_a=r[0].split('.'),params={};
				
				if(r[':']){
					m.shift(); // remove m[0];
					var countMatches=m.length;
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
				
				route=new App.Route({
					all:all,
					controller:c_a[0],
					action:c_a[1],
					nParams:params,//named
					sParams:m,//simple
					ext:false
				});
				return false;
			}
		});
		//S.log('route=',route);
		return route;
	},
	getLink:function(lang,/*#if NODE*/entry,/*#/if*/url){
		return S.isString(url) ? this.getStringLink(lang,/*#if NODE*/entry,/*#/if*/url) : this.getArrayLink(lang,/*#if NODE*/entry,/*#/if*/url);
	},
	/* Exemples :
	* (['/:id-:slug',post.id,post.slug])
	* (['/:id-:slug',post.id,post.slug,{'target':'_blank','?':'page=2'}])
	*/
	getArrayLink:function(lang,/*#if NODE*/entry,/*#/if*/params){
		var plus = '', route = params.shift();
		if(route !== true){
			route = this.routes.get(/*#ifelse NODE*/entry||'main'/*#/if*/).get(route);
			/*#if DEV */
			if(!route){
				//if(Springbok::$inError) return 'javascript:alert(\'No route found\')';
				throw new Error("Router getLink: This route does not exists: "+route);
			}
			/*#/if*/
		}
		var options = S.isObj(UArray.last(params)) ? params.pop() : {};
		if(params.ext) plus += '.'+params.ext;
		else if(route[2] && route[2].ext) plus += '.'+route[2].ext;
		if(params['?'] != null) plus += '?'+params['?'];
		if(params['#'] != null) plus += '.'+params['#'];
		
		lang = params.lang || lang;
		
		if(!params.length) return (route[lang] || route._)[1]+ plus;
		var url = (route === true ? this.getStringLink(lang,/*#if NODE*/entry,/*#/if*/ params) : UString.format((route[lang]||route._)[1], params.map(this.translate.bind(this,lang))));
		return (url==='/'?'/':UString.trimRight(url,'\/')) + plus;
	},
	getStringLink:function(lang,/*#if NODE*/entry,/*#/if*/params){
		S.log([lang,/*#if NODE*/entry,/*#/if*/params,UString.explode(UString.trim(params,'/'),'/',3)]);
		var route = UString.explode(UString.trim(params,'/'),'/',3),
			controller = route[0],
			action = route[1] || DEFAULT.action,
			params = route[2] || '';
		S.log([route,controller,action,params]);
		route = this.routes.get(/*#ifelse NODE*/entry||'main'/*#/if*/).get('/:controller(/:action/*)?');
		S.log(route);
		var froute = action === DEFAULT.action ? '/' + this.translate(lang,controller) : UString.format((route[lang]||route._)[1], this.translate(lang,controller), this.translate(lang,action), params ? '/' + params : '');
		return froute + (route.ext && !froute.endsWith('.' + route.ext) ? '.' + route.ext : '');
	},
	translate:function(lang,string){
		return this.routesLangs.get('->' + lang).get(string.toLowerCase()) || string;
	},
	untranslate:function(lang,string){
		/*#if DEV*/
		if(!this.routesLangs.has(lang + '->')) throw new Error('Missing lang "'+lang+'"');
		if(!this.routesLangs.get(lang + '->').has(string.toLowerCase())) throw new Error('Missing translation for string "'+string+'"');
		/*#/if*/
		return this.routesLangs.get(lang + '->').get(string.toLowerCase()) || string;
	}
};
