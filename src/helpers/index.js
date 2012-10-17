module.exports=function(req,res){this.req=req;this.res=res;};
S.extObjs(module.exports.prototype,{
	escape:function(html){
		return String(html)
			.replace(/&(?!\w+;)/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	},
	escapeUrl:function(html){
		return html.replace('&','&amp;');
	},
	
	/* https://github.com/jed/locale/blob/master/src/index.coffee */
	locale:function(){
		var locale,accept=this.req.headers['accept-language'];
		if(accept && (accept=accept.split(','))){
			for(var i,l=accept.length,a;i<l;i++){
				
			}
		}
		
		//locale = Locale.default
		
		for(var l in App.Locales){
			
		}
		
		locale=App.Locales[locale];
		this.locale=function(){return locale;}
		return locale;
	}
},
	require('./Url'),
	require('./Html')
);
/*global.H=S.extObjs({},require('./Html'));*/
