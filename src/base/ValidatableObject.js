S.ValidatableObject = S.newClass({
	
	validate: function(){
		var errors = [];
		
		UObj.forEach(this.self.Fields,function(fieldName,params){
			//TODO use a Validator class ?  like CValidator in SpringbokPHP
			if(this[fieldName] === undefined){
				if(params.required) errors.push([fieldName,'required']);
				return;
			}
			
			
		}.bind(this));
	}
});
