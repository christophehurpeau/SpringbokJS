includeCore('browser/base/');
includeCore('browser/base/S.loading');

if(!window.FormData || !XMLHttpRequest.prototype.sendAsBinary)
	S_loadSyncScript('compat/xhr2');

/* https://github.com/ForbesLindesay/ajax/blob/master/index.js */
S.Ajax=(function(){
	var eventAjaxRequest=new Event('s.AjaxRequest');
	
	var registerLoadEvent = function(ajaxRequest){
		ajaxRequest.xhr.addEventListener('load',function(){
			console.log('xhr finished',this.xhr);
			//callback( ! this.xhr.responseType || this.xhr.responseType === 'text' ? this.xhr.responseText : this.xhr.response );
			//this.responseHeaders = this.xhr.getAllResponseHeaders();
			
			// normalize IE bug (http://bugs.jquery.com/ticket/1450)
			var status = this.xhr.status == 1223 ? 204 : this.xhr.status;
			
			var responseType = this.xhr.responseType, response;
			
			if(!responseType){
				var contentType = this.xhr.getResponseHeader("Content-Type");
				responseType = SAjax.responseTypes[contentType];
			}
			
			if(responseType){
				var responseField = SAjax.responseFields[responseType];
				response = (responseField && this.xhr[responseField]);
				if(!response){
					response = this.xhr.responseText;
					var converter;
					if(converter = SAjax.converters[responseType]) response = converter(response);
				}
			}else response = this.xhr.responseText;
			
			this.successCallbacks.forEach(function(callback){ callback.call(null,response) });
		}.bind(ajaxRequest));
	};
	
	var SAjax=S.newClass({
		ctor:function(url,method){
			if(method) this.method=method;
			this.url=url+'?'+Date.now();
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
			if(this.successCallbacks) this.successCallbacks.push(callback);
			else{
				this.successCallbacks = [ callback ];
				registerLoadEvent(this);
			}
			return this;
		},
		error:function(callback){
			return this.on('error',callback);
		},
		
		on:function(events,callback){
			events.split(' ').forEach(function(eventName){
				this.xhr.addEventListener(eventName,callback,false);
			}.bind(this));
			return this;
		},
		
		header:function(key,value){
			if(!this.headers) this.headers={};
			this.headers[key]=value;
			return this;
		},
		
		withCredentials:function(){
			this.withCredentials=true;
			return this;
		},
		
		send:function(success){
			success && this.success(success);
			this.xhr.open(this.method,this.url,!this.sync);
			this.headers = this.headers ? UObj.union(this.headers,SAjax.headers) : SAjax.headers;
			UObj.forEach(this.headers,function(key,value){
				value && this.xhr.setRequestHeader(key,value);
			}.bind(this));
			$document.fire(eventAjaxRequest);
			this.xhr.withCredentials=!!this.withCredentials;
			this.xhr.send(this.data);
			return this;
		},
		
		abort:function(){
			this.xhr.abort();
			return this;
		}
	},{
		responseTypes: {
			'text/plain': 'text',
			'text/html': 'html',
			'application/json': 'json',
		},
		
		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},
		
		converters: {
			json: JSON.parse
		},
		
		headers: {
			'Accept': 'application/json, text/plain, */*',
			'X-Requested-With': 'XMLHttpRequest'
		}
	});
	
	
	var AjaxGet=SAjax.extend({
		method:'GET',
	});
	
	var AjaxPost=SAjax.extend({
		method:'POST',
		
		form:function(form){
			this.data = new FormData(form.nodeType ? form : form[0]);
			return this;
		}
	});
	
	S.get=function(url){ return new AjaxGet(url); };
	S.post=function(url){ return new AjaxPost(url); };
	
	return SAjax;
})();

/* 
 * http://stackoverflow.com/questions/7718935/load-scripts-asynchronously
 * http://css-tricks.com/thinking-async/
 */
S.loadScript = function(src,options,callback,to){
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
};