includeCore('browser/base/');
includeCore('browser/base/S.loading');

if(!window.FormData || !XMLHttpRequest.prototype.sendAsBinary)
	S_loadSyncScript('compat/xhr2');

/* https://github.com/ForbesLindesay/ajax/blob/master/index.js */
S.Ajax=(function(){
	var eventAjaxRequest=new Event('sAjaxRequest');
	return S.newClass({
		ctor:function(url,method){
			if(method) this.method=method;
			if(url) this.url=url;
			this.xhr=new XMLHttpRequest(); 
		},
		sync:function(){
			this.sync=true;
		},/*
		responseJSON:function(){
			this.xhr.responseType='json';
			return this;
		},*/
		success:function(callback){
			this.xhr.load=function(){
				//callback( ! this.xhr.responseType || this.xhr.responseType === 'text' ? this.xhr.responseText : this.xhr.response );
				callback( this.xhr.responseText );
			}.bind(this);
			return this;
		},
		error:function(callback){
			this.on('error',callback);
			return this;
		},
		
		on:function(events,callback){
			events.split(' ').forEach(function(eventName){
				this.xhr.addEventListener(eventName,callback,false);
			}.bind(this));
			return this;
		},
		
		header:function(key,value){
			this.xhr.setRequestHeader(key,value);
			return this;
		},
		
		send:function(success){
			success && this.success(success);
			this.xhr.open(this.method,this.url,!this.sync);
			$window.fire(eventAjaxRequest);
			this.xhr.send(this.data);
			return this;
		},
		
		abort:function(){
			this.xhr.abort();
			return this;
		}
	});
})();

/* 
 * http://stackoverflow.com/questions/7718935/load-scripts-asynchronously
 * http://css-tricks.com/thinking-async/
 */
UObj.extend(S,{
	loadScript:function(src,options,callback,to){
		if(S.isFunc(options) || (!options && !callback)){ callback=options; options={async:true}; }
		var s=document.createElement('script'),r=false;
		s.type = 'text/javascript';
		s.src = src;
		options && UObj.forEach(options,function(k,v){ s[k]=v; });
		s.onload = s.onreadystatechange = function(){
			if(r || (this.readyState && this.readyState != 'complete' && this.readyState != 'loaded')) return;
			r = true;
			s.onload = s.onreadystatechange = null;
			s = undefined;
			callback();
		};
		(to||document.body).appendChild(s);
	},
	
	get:S.Ajax.extend({
		method:'GET',
	}),
	post:S.Ajax.extend({
		method:'POST',
		
		form:function(form){
			this.data=new FormData(form.nodeType ? form : form[0]);
		}
	})
});