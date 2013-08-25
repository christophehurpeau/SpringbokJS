/* http://www.html5rocks.com/en/tutorials/file/xhr2/ */
/* http://caniuse.com/xhr2
 * http://dev.opera.com/articles/view/xhr2/
 * https://developer.mozilla.org/en-US/docs/Web/API/FormData?redirectlocale=en-US&redirectslug=Web%2FAPI%2FXMLHttpRequest%2FFormData
 * */


window.FormData || (function(){
	var encode=function(name,value){
		return encodeURIComponent(name)+'='
			+encodeURIComponent(value.replace(/(\r)?\n/,'\r\n')).replace('%20','+');
	}
	window.FormData=function(form){
		if(form){
			if(!form.elements) throw new Error;
			var res='';
			Array.forEach(form.elements,function(e){
				if(!e.name || e.disabled || e.type == 'file' || e.type == 'submit') return;
				var value=S.Elt.hasClass(e,'placeholder') ? '' : S.Elt.getVal(e);
				if(value != null)
					res+='&'+encode(e.name,value);
			});
			this.data= res && res.substr(1);
		}
	};
	window.FormData.prototype={
		append:function(name,value){
			this.data=this.data ? this.data+'&' : '';
			this.data += encode(name,value);
		},
		toString:function(){
			return this.data;
		}
	}
	
	oldSendMethod=window.XMLHttpRequest.prototype.send;
	window.XMLHttpRequest.prototype.send=function(){
		var args=arguments;
		if(args[0] && args[0] instanceof window.FormData)
			args[0]=args[0].toString();
		oldSendMethod.apply(this,args);
	}
})();

//TODO !!!!

/* https://github.com/gsroberts/xhr2/blob/master/xhr2.js */
/**
* xhr2.js Copyright (C) 2013 G.S. Roberts (https://github.com/gsroberts/xhr2)
*
* This work is free software; you can redistribute it and/or modify
* it under the terms of the GNU Lesser General Public License as published by
* the Free Software Foundation; either version 2.1 of the License, or
* (at your option) any later version.
*
* This work is distributed in the hope that it will be useful,
* but without any warranty; without even the implied warranty of
* merchantability or fitness for a particular purpose. See the
* GNU Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public License
* along with this library; if not, write to the Free Software Foundation, Inc.,
* 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
*/
if(!window.XMLHttpRequest.prototype.overrideMimeType || !window.XMLHttpRequest.prototype.addEventListener
	|| !window.XMLHttpRequest.prototype.DONE)
(function () {
	console&&console.log('polyfill xhr2');
	var currentXhr2 = window.XMLHttpRequest;

	// 
	var isGecko  = !!window.controllers;
	var isIE    = !!window.document.namespaces;

	// Enables "xhr2()" call next to "new xhr2()"
	function fXMLHttpRequest() {
		this._object  = new currentXhr2;
		this._listeners = [];
	}

	// Constructor
	function xhr2() {
		return new fXMLHttpRequest();
	}
	
	xhr2.prototype = fXMLHttpRequest.prototype;

	// BUGFIX: Firefox with Firebug installed would break pages if not executed
	if (currentXhr2.wrapped) xhr2.wrapped = currentXhr2.wrapped;

	//Specification defined enums
	var xhr2States = {
		UNSENT: 0,
		OPENED: 1,
		HEADERS_RECEIVED: 2,
		LOADING: 3,
		DONE: 4
	};

	var xhr2RequestResponseType = {
		NONE: 0,
		ARRAYBUFFER: 1,
		BLOB: 2,
		DOCUMENT: 3,
		JSON: 4,
		TEXT: 5
	};
	
	//Define the event target interface required by the specification
	var xhr2EventTarget = function(){ };
	xhr2EventTarget.prototype.onloadstart = null;
	xhr2EventTarget.prototype.onprogress = null;
	xhr2EventTarget.prototype.onabort = null;
	xhr2EventTarget.prototype.onerror = null;
	xhr2EventTarget.prototype.onload = null;
	xhr2EventTarget.prototype.ontimeout = null;
	xhr2EventTarget.prototype.onloadend = null;
	
	//Define request upload object as required by the spec
	var xhr2RequestUpload = function(){};
	xhr2RequestUpload.prototype = xhr2EventTarget.prototype;

	// Interface level constants
	xhr2.prototype.UNSENT            = xhr2States.UNSENT;
	xhr2.prototype.OPENED            = xhr2States.OPENED;
	xhr2.prototype.HEADERS_RECEIVED  = xhr2States.HEADERS_RECEIVED;
	xhr2.prototype.LOADING           = xhr2States.LOADING;
	xhr2.prototype.DONE              = xhr2States.DONE;

	// Public Properties
	xhr2.prototype.readyState    	= xhr2States.UNSENT;
	xhr2.prototype.response		 	= null;
	xhr2.prototype.responseType		= null;
	xhr2.prototype.responseText  	= '';
	xhr2.prototype.responseXML   	= null;
	xhr2.prototype.status        	= 0;
	xhr2.prototype.statusText    	= '';
	
	xhr2.prototype.upload		 	= null;
	xhr2.prototype.timeout		 	= null;
	xhr2.prototype.withCredentials 	= null;
	xhr2.prototype.synchronous		= null;
	xhr2.prototype.method			= null;
	xhr2.prototype.URL				= null;
	xhr2.prototype.username			= null;
	xhr2.prototype.password			= null;
	xhr2.prototype.uploadComplete	= null;
	xhr2.prototype.uploadEvents		= null;

	// Priority proposal
	xhr2.prototype.priority    = "NORMAL";

	// Instance-level Events Handlers
	xhr2.prototype.onreadystatechange  = null;

	// Class-level Events Handlers
	xhr2.onreadystatechange  = null;
	xhr2.onopen              = null;
	xhr2.onsend              = null;
	xhr2.onabort             = null;

	// Public Methods
	xhr2.prototype.overrideMimeType = function(mimeType){
	
	};
	
	xhr2.prototype.open  = function(sMethod, sUrl, bAsync, sUser, sPassword) {
		// http://www.w3.org/TR/XMLHttpRequest/#the-open-method
		var sLowerCaseMethod = sMethod.toLowerCase();
		if (sLowerCaseMethod == "connect" || sLowerCaseMethod == "trace" || sLowerCaseMethod == "track") {
			// Using a generic error and an int - not too sure all browsers support correctly
			// http://dvcs.w3.org/hg/domcore/raw-file/tip/Overview.html#securityerror, so, this is safer
			// XXX should do better than that, but this is OT to XHR.
			throw new Error(18);
		}

		// Delete headers, required when object is reused
		delete this._headers;

		// When bAsync parameter value is omitted, use true as default
		if (arguments.length < 3) {
			bAsync  = true;
		}

		// Save async parameter for fixing isGecko bug with missing readystatechange in synchronous requests
		this._async   = bAsync;

		// Set the onreadystatechange handler
		var oRequest  = this;
		var nState    = this.readyState;
		var fOnUnload = null;

		// BUGFIX: isIE- memory leak on page unload (inter-page leak)
		if (isIE&& bAsync) {
			fOnUnload = function() {
				if (nState != xhr2.DONE) {
					fCleanTransport(oRequest);
					// Safe to abort here since onreadystatechange handler removed
					oRequest.abort();
				}
			};
			window.attachEvent("onunload", fOnUnload);
		}

		// Add method sniffer
		if (xhr2.onopen) {
			xhr2.onopen.apply(this, arguments);
		}

		if (arguments.length > 4) {
			this._object.open(sMethod, sUrl, bAsync, sUser, sPassword);
		} else if (arguments.length > 3) {
			this._object.open(sMethod, sUrl, bAsync, sUser);
		} else {
			this._object.open(sMethod, sUrl, bAsync);
		}

		this.readyState = xhr2.OPENED;
		fReadyStateChange(this);

		this._object.onreadystatechange = function() {
			console.log('onreadystatechange',arguments,oRequest._object.readyState);
			// Synchronize state
			oRequest.readyState   = oRequest._object.readyState;
			fSynchronizeValues(oRequest);

			// BUGFIX: Firefox fires unnecessary DONE when aborting
			if (oRequest._aborted) {
				// Reset readyState to UNSENT
				oRequest.readyState = xhr2.UNSENT;

				// Return now
				return;
			}

			if (oRequest.readyState == xhr2.DONE) {
				// Free up queue
				delete oRequest._data;

				fCleanTransport(oRequest);

				// BUGFIX: isIE- memory leak in interrupted
				if (isIE&& bAsync) {
					window.detachEvent("onunload", fOnUnload);
				}

				// BUGFIX: Some browsers (Internet Explorer, isGecko) fire OPEN readystate twice
				if (nState != oRequest.readyState) {
					fReadyStateChange(oRequest);
				}

				nState  = oRequest.readyState;
			}
		};
	};

	xhr2.prototype.send = function(vData) {
		// Add method sniffer
		if (xhr2.onsend) {
			xhr2.onsend.apply(this, arguments);
		}

		if (!arguments.length) {
			vData = null;
		}

		// BUGFIX: Safari - fails sending documents created/modified dynamically, so an explicit serialization required
		// BUGFIX: isIE- rewrites any custom mime-type to "text/xml" in case an XMLNode is sent
		// BUGFIX: isGecko - fails sending Element (this is up to the implementation either to standard)
		if (vData && vData.nodeType) {
			vData = window.XMLSerializer ? new window.XMLSerializer().serializeToString(vData) : vData.xml;
			if (!this._headers["Content-Type"]) {
				this._object.setRequestHeader("Content-Type", "application/xml");
			}
		}

		this._data = vData;

		fXMLHttpRequest_send(this);
	};

	xhr2.prototype.abort = function() {
		// Add method sniffer
		if (xhr2.onabort) {
			xhr2.onabort.apply(this, arguments);
		}

		// BUGFIX: isGecko - unnecessary DONE when aborting
		if (this.readyState > xhr2.UNSENT) {
			this._aborted = true;
		}

		this._object.abort();

		// BUGFIX: isIE- memory leak
		fCleanTransport(this);

		this.readyState = xhr2.UNSENT;

		delete this._data;
	};

	xhr2.prototype.getAllResponseHeaders = function() {
		return this._object.getAllResponseHeaders();
	};

	xhr2.prototype.getResponseHeader = function(sName) {
		return this._object.getResponseHeader(sName);
	};

	xhr2.prototype.setRequestHeader  = function(sName, sValue) {
		// BUGFIX: isIE- cache issue
		if (!this._headers) {
			this._headers = {};
		}

		this._headers[sName]  = sValue;

		return this._object.setRequestHeader(sName, sValue);
	};

	// EventTarget interface implementation
	xhr2.prototype.addEventListener  = function(sName, fHandler, bUseCapture) {
		for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++) {
			if (oListener[0] == sName && oListener[1] == fHandler && oListener[2] == bUseCapture) {
				return;
			}
		}

		// Add listener
		this._listeners.push([sName, fHandler, bUseCapture]);
	};

	xhr2.prototype.removeEventListener = function(sName, fHandler, bUseCapture) {
		for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++) {
			if (oListener[0] == sName && oListener[1] == fHandler && oListener[2] == bUseCapture) {
				break;
			}
		}

		// Remove listener
		if (oListener) {
			this._listeners.splice(nIndex, 1);
		}
	};

	xhr2.prototype.dispatchEvent = function(oEvent) {
		var oEventPseudo  = {
			'type':             oEvent.type,
			'target':           this,
			'currentTarget':    this,
			'eventPhase':       2,
			'bubbles':          oEvent.bubbles,
			'cancelable':       oEvent.cancelable,
			'timeStamp':        oEvent.timeStamp,
			'stopPropagation':  function() {},  // There is no flow
			'preventDefault':   function() {},  // There is no default action
			'initEvent':        function() {}   // Original event object should be initialized
		};

		// Execute onreadystatechange
		if (oEventPseudo.type == "readystatechange" && this.onreadystatechange) {
			(this.onreadystatechange.handleEvent || this.onreadystatechange).apply(this, [oEventPseudo]);
		}


		// Execute listeners
		for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++) {
			if (oListener[0] == oEventPseudo.type && !oListener[2]) {
				(oListener[1].handleEvent || oListener[1]).apply(this, [oEventPseudo]);
			}
		}

	};

	//
	xhr2.prototype.toString  = function() {
		return '[' + "object" + ' ' + "XMLHttpRequest" + ']';
	};

	xhr2.toString  = function() {
		return '[' + "XMLHttpRequest" + ']';
	};

	// Helper function
	function fXMLHttpRequest_send(oRequest) {
		oRequest._object.send(oRequest._data);

		console&&console.log('fXMLHttpRequest_send',oRequest.readyState);
		// BUGFIX: isGecko - missing readystatechange calls in synchronous requests
		if (isGecko && !oRequest._async) {
			oRequest.readyState = xhr2.OPENED;

			// Synchronize state
			fSynchronizeValues(oRequest);

			// Simulate missing states
			while (oRequest.readyState < xhr2.DONE) {
				oRequest.readyState++;
				fReadyStateChange(oRequest);
				// Check if we are aborted
				if (oRequest._aborted) {
					return;
				}
			}
		}
	}

	function fReadyStateChange(oRequest) {
		// Sniffing code
		if (xhr2.onreadystatechange){
			xhr2.onreadystatechange.apply(oRequest);
		}


		// Fake event
		oRequest.dispatchEvent({
			'type':       "readystatechange",
			'bubbles':    false,
			'cancelable': false,
			'timeStamp':  new Date + 0
		});
	}

	function fGetDocument(oRequest) {
		var oDocument = oRequest.responseXML;
		var sResponse = oRequest.responseText;
		// Try parsing responseText
		if (isIE&& sResponse && oDocument && !oDocument.documentElement && oRequest.getResponseHeader("Content-Type").match(/[^\/]+\/[^\+]+\+xml/)) {
			oDocument = new window.ActiveXObject("Microsoft.XMLDOM");
			oDocument.async       = false;
			oDocument.validateOnParse = false;
			oDocument.loadXML(sResponse);
		}

		// Check if there is no error in document
		if (oDocument){
			if ((isIE&& oDocument.parseError !== 0) || !oDocument.documentElement || (oDocument.documentElement && oDocument.documentElement.tagName == "parsererror")) {
				return null;
			}
		}
		return oDocument;
	}

	function fSynchronizeValues(oRequest) {
		try { oRequest.responseText = oRequest._object.responseText;  } catch (e) {}
		try { oRequest.responseXML  = fGetDocument(oRequest._object); } catch (e) {}
		try { oRequest.status       = oRequest._object.status;        } catch (e) {}
		try { oRequest.statusText   = oRequest._object.statusText;    } catch (e) {}
	}

	function fCleanTransport(oRequest) {
		// BUGFIX: isIE- memory leak (on-page leak)
		oRequest._object.onreadystatechange = new window.Function;
	}

	var anonXhr2 = function(){
		
	};
	anonXhr2.prototype = xhr2.prototype;
	
	// Register new object with window
	window.XMLHttpRequest = xhr2;

})();
















/* ----------------------------------------------------------------- */

/*\
|*|
|*|  :: XMLHttpRequest.prototype.sendAsBinary() Polifyll ::
|*|
|*|  https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest#sendAsBinary()
|*|
\*/

if (!XMLHttpRequest.prototype.sendAsBinary) {
  XMLHttpRequest.prototype.sendAsBinary = function (sData) {
    var nBytes = sData.length, ui8Data = new Uint8Array(nBytes);
    for (var nIdx = 0; nIdx < nBytes; nIdx++) {
      ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
    }
    /* send as ArrayBufferView...: */
    this.send(ui8Data);
    /* ...or as ArrayBuffer (legacy)...: this.send(ui8Data.buffer); */
  };
}
