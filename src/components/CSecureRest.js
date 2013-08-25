var loadConfig=function(configName){
	return Object.freeze(UObj.extend({
			modelName:'User',login:'_id',password:'pwd',auth:'',authConditions:{}
		},App.config(configName)));
};
var checkAuth = function(headers){
	if(!headers['x-sauth']) return false;
	return M.UserToken.find.value('user_id').query({
		token: headers['x-sauth'],
		userAgent: USecure.sha1WithSalt(headers['user-agent'])
	});
};

var CSecureRest=S.newClass({
	ctor:function(req){
		this.req=req;
	},
	
	checkAuth:function(callback){
		if(this.connected !== undefined) return callback(!! this.connected);
		
		checkAuth(this.req.headers)
			.fetch(function(connected){
				this.connected = connected || false;
				callback(!!connected);
			}.bind(this),function(){
				callback(false);
			});
	},
	
	connect:function(user,callback){
		if(!this.req.headers['user-agent']) callback(false);
		var query = {}, config = this.self.config;
		
		query[config.login] = user.get(config.login);
		query[config.password] = this.hashPassword(user.get(config.password));
		
		user.self.find.value().field('_id').query(query).fetch(function(res){
			S.log('result=',res);
			if(!res) return callback(false);
			S.log('Create a new Token !');
			M.UserToken.create( this.connected = query[config.login], this.req.headers['user-agent'])
				.success(function(item){
					var token=this.model.get('token');
					S.log('UserToken.create: '+token);
					callback(token);
				});
		}.bind(this));
	},
	
	hashPassword:function(password){
		return USecure.sha512WithSalt(password);
	}
	
},{
	requestMethods:{
		secureRest:function(){
			var rs=new CSecureRest(this);
			this.secureRest=function(){ return rs; };
			return rs;
		}
	},
	loadConfig: loadConfig,
	config: loadConfig('secure'),
	checkAuth: checkAuth
});

module.exports=CSecureRest;