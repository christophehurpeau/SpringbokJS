module.exports=global.U={
	/* DEV */
	stack:function(){
		try{throw new Error();}catch(err){ console.log(err.stack); }
	},
	
	/* /DEV */
	
	Strings:require('./UStrings'),
	Files:require('./UFiles'),
};
