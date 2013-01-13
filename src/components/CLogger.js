S.CLogger=function(){};
S.CLogger.prototype={
	extend:S.extThis;
	
	log:function(message,color){ this.write(color ? this._colored(message,color) : message); return this; }
	logLn:function(message,color){ return this.log(message,color).nl(); }
	nl:function(){ this.write("\n"); return this; }
};

/*return '\033[90m' + req.method
    + ' ' + req.originalUrl + ' '
    + '\033[' + color + 'm' + res.statusCode
    + ' \033[90m'
    + (new Date - req._startTime)
    + 'ms' + len
    + '\033[0m';*/
S.CLogger.Html=S.CLogger.extend({
	colors:{
		gray:'gray',grayLight:'silver',white:'white',
		red:'red',orange:'orange',
		green:'green',greenLight:'lime'
	},
	
	_colored:function(message,color){ return '<span style="color:'++'">'+message+'</span>'; },
	write:function(html){ this.html+=html; },
	nl:function(){ this.html+='<br/>'; return this;}
});
S.CLogger.Console=S.CLogger.extend({
	/* http://www.pixelbeat.org/docs/terminal_colours/ */
	colors:{
		gray:'1;30',grayLight:'37',white:'1;37',
		red:'31',orange:'1;31',
		green:'32',greenLight:'1;32'
	},
	
	_colored:function(str,color){ return "\033["+this.colors[color]+"m"+str+"\033[0m"; },
	
});
