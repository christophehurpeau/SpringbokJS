module.exports=function(){
	var loading=this.H.tC('Loading...');
	this.res.end('<!DOCTYPE html><html><head>'
		+this.H.metaCharset()+this.H.metaLanguage()
		+'<title>'+Config.projectName+' - '+loading+'</title>'
		+this.H.cssLink()
		+this.H.jsInline(
			'window.onload=function(){'
				+'var s=document.createElement("script");'
				+'s.type="text/javascript";'
				+'s.src="'+this.H.staticUrl('/jsapp.js','js')/* DEV */+'?'+(new Date())/* /DEV */+'";'
				+'document.body.appendChild(s);'
			+'};'
		)
		+'</head><body>'
		+'<div id="container"><div class="startloading"><b>'+Config.projectName+'</b><div id="jsAppLoadingMessage">'+loading+'</div></div></div>'
		+'</body>'
	//HDev::springbokBar();
		+'</html>');
}
