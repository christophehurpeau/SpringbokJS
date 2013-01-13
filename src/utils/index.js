module.exports=global.U={
	/* DEV */
	stack:function(){
		try{throw new Error();}catch(err){ console.log(err.stack); }
	},
	
	/* /DEV */
	
	Files:require('./UFiles'),
};
