module.exports={
	type:'stylesheet',
	extension:'scss',
	pattern:/\.s[ac]ss$/,
	priority:0,
	
	_dependencyRegExp: /^ *@import ['"](.*)['"]/,
	_bin:process.platform==='win32'?'sass.bat':'sass',
	
	init:function(config){
		
	}
};