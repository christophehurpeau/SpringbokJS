module.exports={
	decimalFormat:{decimalSep:',',thousandsSep:' '},
	percentFormat:'%s %%',
	scientificFormat:'#E0',
	currencyFormat:'#,##0.00 ¤',
	
	pluralCat:function(number){
		if(number > 1) return 'plural';
		return 'one';
	},
	
	date:{
		format:'dd/mm/yyyy',
		today:{full:'Aujourd\'hui',shortened:'Auj.'},
		yesterday:{full:'Hier',shortened:'Hier'},
		monthNames:{
			full:'Janvier Février Mars Avril Mai Juin Juillet Août Septembre Octobre Novembre Décembre'.split(' '),
			shortened: 'janv fev mar avr mai juin juil aout sept oct nov dec'.split(' '),
			compact:'J F M A M J J A S O N D'.split(' ')
		},
		weekDayNames:{
			full:'Dimanche Lundi Mardi Mercredi Jeudi Vendredi Samedi'.split(' '),
			shortened:'dim lun mar mer jeu ven sam'.split(' '),
			compact:'D L M M J V S'.split(' ')
		},
		periodNames:{
			full:['avant Jésus-Christ','après Jésus-Christ'],
			shortened:['av. J.-C.','ap. J.-C.'],
			compact:['av JC.','ap JC.']
		},
		date_time_sep:'à',
	},
	formatDateNice:function(date){
		var now=new Date(), sameYear = date.getFullYear() != now.getFullYear();
		if(sameYear && date.getMonth() == now.getMonth()){
			if(now.getDate() == date.getDate()) return this.date.today.full;
			if(now.getDate()-1 == date.getDate()) return this.date.yesterday.full;
		}
		var str = this.date.weekDayNames.full[date.getDay()] + ' ' + date.getDate()+' '+ this.date.monthNames.full[date.getMonth()];
		if(sameYear) str+=' '+date.getFullYear();
		return str;
	},
	formatDateShort:function(date){
		var now=new Date(), month = date.getMonth();
		if(date.getFullYear() == now.getFullYear() && month == now.getMonth()){
			if(now.getDate() == date.getDate()) return this.date.today.shortened;
			else if(now.getDate()-1 == date.getDate()) return this.date.yesterday.shortened;
		}
		var str = this.date.weekDayNames.shortened[date.getDay()] + ' ' + date.getDate()+'/'+(month<9?'0':'')+(month+1);
		if(sameYear || month === 1 || month === 12) str+=' '+date.getFullYear();
		return str;
	},
	formatDateSimple:function(date){
		var now = new Date(), month = date.getMonth();
		var str = date.getDate()+' '+ this.date.monthNames.full[month];
		if(date.getFullYear() != now.getFullYear() || month === 1 || month === 12) str+=' '+date.getFullYear();
		return str;
	},
	formatDateCompact:function(date){
		var now=new Date(),day=date.getDate(),month=date.getMonth(),
			str=(day<10?'0':'')+day+'/'+ (month<9?'0':'')+(month+1);
		if(date.getFullYear() != now.getFullYear() || month === 1 || month === 12) str+='/'+date.getFullYear();
		return str;
	},
	formatDateComplete:function(date){
		var now=new Date(),day=date.getDate(),month=date.getMonth();
		return (day<10?'0':'')+day+'/'+ (month<9?'0':'')+(month+1)+'/'+date.getFullYear();
	},
	
	formatTimeSimple:function(date){
		var hours = date.getHours(), minutes = date.getMinutes();
		return ((hours < 10)?"0":"") + hours +((minutes < 10)?"h0":"h") + minutes;
	},
	formatTimeComplete:function(date){
		var hours = date.getHours(), minutes = date.getMinutes();
		return ((hours < 10)?"0":"") + hours +((minutes < 10)?":0":":") + minutes;
	},
};
