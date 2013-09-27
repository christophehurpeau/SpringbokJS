var loadConfig=function(configName){
	return Object.freeze(UObj.extend({
			modelName:'User',login:'_id',password:'pwd',auth:'',authConditions:{}
		},App.config(configName)));
};
var queryAuth = function(headers){
	if(!headers['x-sauth']) return false;
	return M.UserToken.find.value('user_id').query({
		token: headers['x-sauth'],
		userAgent: USecure.sha1WithSalt(headers['user-agent'])
	});
};

var login = function(headers, user, callback){
	if(!headers['user-agent']) return callback(false, false);
	var query = {}, config = this.config;
	
	query[config.login] = user.get(config.login);
	query[config.password] = this.hashPassword(user.get(config.password));
	
	user.self.find.value().field('_id').query(query).fetch(function(res){
		if(!res) return callback(false, false);
		M.UserToken.create( query[config.login], headers['user-agent'])
			.success(function(item){
				var token=this.model.get('token');
				callback(query[config.login],token);
			});
	});
};

var CSecureRest=S.newClass({
	ctor:function(req){
		this.req=req;
	},
	
	checkAuth:function(callback){
		if(this.connected !== undefined) return callback(!! this.connected);
		
		queryAuth(this.req.headers)
			.fetch(function(connected){
				this.connected = connected || false;
				callback(!!connected);
			}.bind(this),function(){
				callback(false);
			});
	},
	
	connect:function(user, callback){
		this.self.login(this.req.headers, user, function(connected, token){
			this.connected = connected;
			return callback(token);
		}.bind(this));
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
	
	login: login,
	checkAuth: function(headers, callback){
		queryAuth(headers)
			.fetch(function(connected){
				callback(null, connected);
			},function(){
				callback('DB error');
			});
	},
	
	hashPassword:function(password){
		return USecure.sha512WithSalt(password);
	}
});

module.exports=CSecureRest;