var loadConfig=function(configName){
	return Object.freeze(UObj.extend({
			modelName:'User',login:'_id',password:'pwd',auth:'',authConditions:{}
		},App.config(configName)));
}
var CSecureRest=S.newClass({
	ctor:function(req){
		this.req=req;
	},
	
	checkAuth:function(){
		if(this.connected===undefined)
			if(this.req.headers.sauth){
				this.connected=M.UserToken.find.value('user_id').query({
					token: this.req.headers.sauth,
					userAgent: USecure.sha1(this.req.headers['user-agent']) + Config.secure.salt
				});
			}
		return !!this.connected;
	}
	
},{
	requestMethods:{
		restSecure:function(){
			var rs=new CSecureRest(this);
			this.restSecure=function(){ return rs; };
		}
	},
	loadConfig: loadConfig,
	config: loadConfig('secure'),
	
});

module.exports=CSecureRest;