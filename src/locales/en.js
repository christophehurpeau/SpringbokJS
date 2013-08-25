module.exports={
	decimalFormat:{decimalSep:'.',thousandsSep:','},
	percentFormat:'%s %%',
	scientificFormat:'#E0',
	currencyFormat:'¤#,##0.00',
	
	pluralCat:function(number){
		if(number !== 1) return 'plural';
		return 'one';
	},
	
	date:{
		format:'M/d/yyyy',
		today:{full:'Today',shortened:'Today'},
		yesterday:{full:'Yesterday',shortened:'Y.day'},
		monthNames:{
			full:'January February March April May June July August September October November December'.split(' '),
			shortened: 'janv feb mar apr may jun jul aug sep oct nov dec'.split(' '),
			compact:'J F M A M J J A S O N D'.split(' ')
		},
		weekDayNames:{
			full:'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' '),
			shortened:'sun mon tue wed thu fri sat'.split(' '),
			compact:'S M T W T F S'.split(' ')
		},
		periodNames:{
			full:['Before Christ','Anno Domini'],
			shortened:['BC','AD'],
			compact:['BC','AD']
		},
		date_time_sep:'at',
	},
	
	formatDateNice:function(date){
		var now=new Date(), sameYear = date.getFullYear() != now.getFullYear();
		if(sameYear && date.getMonth() == now.getMonth()){
			if(now.getDate() == date.getDate()) return this.date.today.full;
			if(now.getDate()-1 == date.getDate()) return this.date.yesterday.full;
		}
		var str = this.date.weekDayNames.full[date.getDay()] + ', '+ this.date.monthNames.full[date.getMonth()]+' '+ date.getDate();
		if(sameYear) str+=', '+date.getFullYear();
		return str;
	},
	formatDateShort:function(date){
		var now=new Date(), month = date.getMonth();
		if(date.getFullYear() == now.getFullYear() && month == now.getMonth()){
			if(now.getDate() == date.getDate()) return this.date.today.shortened;
			else if(now.getDate()-1 == date.getDate()) return this.date.yesterday.shortened;
		}
		var str = this.date.weekDayNames.shortened[date.getDay()] + ', ' + this.date.monthNames.shortened[date.getMonth()]+' '+ date.getDate();
		if(sameYear || month === 1 || month === 12) str+=', '+date.getFullYear();
		return str;
	},
	formatDateSimple:function(date){
		var now = new Date(), month = date.getMonth();
		var str = this.date.monthNames.full[month] + ' ' + date.getDate();
		if(date.getFullYear() != now.getFullYear() || month === 1 || month === 12) str+=', '+date.getFullYear();
		return str;
	},
	formatDateCompact:function(date){
		var now=new Date(),day=date.getDate(),month=date.getMonth(),
			str=(month<9?'0':'')+(month+1) +'/'+ (day<10?'0':'')+day;
		if(date.getFullYear() != now.getFullYear() || month === 1 || month === 12) str+='/'+date.getFullYear();
		return str;
	},
	formatDateComplete:function(date){
		var now=new Date(),day=date.getDate(),month=date.getMonth();
		return (month<9?'0':'')+(month+1)+'/'+(day<10?'0':'')+day+'/'+date.getFullYear();
	},
	
};