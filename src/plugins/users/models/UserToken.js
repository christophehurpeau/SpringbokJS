App.Model('UserToken',{
	static:{
		//parent:'Searchable', behaviours:['Child'],
		
		Fields:{
			_id:[String, { required:true }],
		},
		
		create:function(connected,userAgent){
			var ut=new this({
				user_id: connected,
				token: UGenerator.randomCode(22,'azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN1234567890_-+'),
				userAgent: USecure.sha1WithSalt(userAgent)
			});
			return ut.insert();
		}
	}
});
