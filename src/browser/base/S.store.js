S.store=(function(){
	var storage=(function(){
		try{
			if(window.localStorage){
				window.localStorage.setItem('_tmptest', 'tmpval');
				window.localStorage.removeItem('_tmptest');
				return window.localStorage;
			}
		}catch(err){ }
		try{
			/* firefox 2 => 3.5 */
			if(window.globalStorage)
				return window.globalStorage[window.location.hostname];
		}catch(err){ }
		
		return false;
	})(),
		serialize=JSON.stringify,
		deserialize=function(value){ return value && JSON.parse(value); };
	if(!storage) return false;
	else{
		return Object.freeze({
			get:function(key){ deserialize(storage[key]); },
			set:function(key,val){ storage[key]=serialize(val); },
			remove:function(key){ storage.removeItem(key); },
			clear:function(){ storage.clear(); }
		})
	}
})();
if(!S.store) S_loadSyncScript('compat/store');
