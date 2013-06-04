includeCore('elements/');
S.extProto(S.Helpers,{
	menuTop:function(options,links){
		return this.createMenu(options,links,'top');
	},
	menuAjaxTop:function(options,links){
		return this.createMenu(options,links,'top ajax');
	},
	menuLeft:function(options,links){
		return this.createMenu(options,links,'left');
	},
	menuUl:function(options,links){
		options.tagName='ul';
		return this.createMenu(options,links,'');
	},
		
	createMenu:function(options,links,type){
		if(S.isArray(options)){
			links=options;
			options={};
		}
		options=UObj.extend({
				menuAttributes:{'class':type},lioptions:{},linkoptions:{},startsWith:false,
				tagName:'nav',separator:'-'
			},options);
		var t=this,ul=$.create('ul').html('');
		links.forEach(function(item){
			if(!item[0]){ ul.aHtml($.create('li',{'class':'separator'},this.separator,1)); return; }
			var linkOptions=UObj.extend(options.linkoptions,item[2]);
			
			if(linkOptions.visible===false) return;
			delete linkOptions.visible;
			ul.aHtml(t.linkMenu(item[0],item[1],linkOptions,{startsWith:options.startsWith},options.lioptions));
		});
		return options.tagName==='ul' ? ul : $.create(options.tagName).attrs(options.menuAttributes).html(ul);
		/*return $('<div/>').html(res).html(); //TODO à revoir*/
	},
	
	linkMenu:function(title,url,linkoptions,options,lioptions){
		linkoptions=linkoptions||{};
		if(linkoptions.current!==undefined){
			if(linkoptions.current) linkoptions.current=1;
		}else{
			linkoptions.current=linkoptions.startsWith!==undefined ? linkoptions.startsWith : options.startsWith;
			delete linkoptions.startsWith;
		}
		var res=this.link(title,url,linkoptions);
		if(linkoptions!=null) res=$.create('li').setAttrs(lioptions).html(res);
		return res;
	}
});