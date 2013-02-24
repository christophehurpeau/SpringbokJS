module.exports=function(_options){
	if(!_options) _options={};
	var dictionnaries={};
	
	
	var langs={},sync=function(){
		
	};
	
	for(var i=0,l=_options.langs;i<l;i++){
		var lang=_options.langs[i];
		langs[lang]={
			translate:function(string){
				return dictionnaries[lang]['t'][string]||string;
			},
			translateFormat:function(string){
				return this.translateVFormat(UArray.slice1(arguments));
			},
			translateVFormat:function(string,args){
				return UString.vformat(this.translate(string),args);
			},
			
			count:function(string,count){
				return dictionnaries[lang][this.isPlural(count)?'p':'s'][string]||string;
			},
			countFormat:function(string,count){
				return this.countVFormat(string,count,UArray.slice.call(arguments,2));
			},
			countVFormat:function(string,count,args){
				return UString.vformat(this.count(string,count),args).replace(/%d/,count);
			}
			/* DEV */,sync:sync/* /DEV */
		};
	}
	
	sync();
	return langs;
};
