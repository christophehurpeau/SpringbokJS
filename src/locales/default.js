var defaults={
	formatDatetimeNice:function(date){
		return this.formatDateNice(date)+' '+this.date.date_time_sep+' '+this.formatTimeSimple(date);
	},
	formatDatetimeShort:function(date){
		return this.formatDateShort(date)+' '+this.date.date_time_sep+' '+this.formatTimeSimple(date);
	},
	formatDatetimeSimple:function(date){
		return this.formatDateSimple(date)+' '+this.date.date_time_sep+' '+this.formatTimeSimple(date);
	},
	formatDatetimeCompact:function(date){
		return this.formatDateCompact(date)+' '+this.date.date_time_sep+' '+this.formatTimeSimple(date);
	},
	formatDatetimeComplete:function(date){
		return this.formatDateComplete(date)+' '+this.date.date_time_sep+' '+this.formatTimeComplete(date);
	},
	
	formatMonthAndYearSimple:function(date){
		var now=new Date() ,month=date.getMonth(), str=this.date.monthNames.full[month];
		if(date.getFullYear() != now.getFullYear() || month === 1 || month === 12) str+=' '+date.getFullYear();
		return str;
	},
	
	
	formatTimeSimple:function(date){
		return this.formatTimeSimple(date);
	},
	formatTimeComplete:function(date){
		var hours = date.getHours(), minutes = date.getMinutes();
		return ((hours < 10)?"0":"") + hours +((minutes < 10)?":0":":") + minutes + ' '+(hours < 12 ? 'am' : 'pm');
	},
};
module.exports=function(obj){
	return UObj.union(obj,defaults);
};
