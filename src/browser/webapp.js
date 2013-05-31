includeCore('browser/jquery-latest');
includeCore('browser/base/');

global.FatalError=function(error){
	alert(error);
	$('#jsAppLoadingMessage').addClass('message error').text(error);
};


global.App={
	jsapp:function(name,version){this.name=name;this.version=version;},
};
