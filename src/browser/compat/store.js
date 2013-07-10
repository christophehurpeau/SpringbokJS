S.store=(function(){
	if(doc.documentElement.addBehavior){
		/* https://github.com/marcuswestin/store.js/blob/master/store.js */
		var localStorageName = 'localStorage',
			storageOwner,storageContainer,
			serialize=JSON.stringify,
			deserialize=function(value){ return value && JSON.parse(value); };
		// Since #userData storage applies only to specific paths, we need to
		// somehow link our data to a specific path. We choose /favicon.ico
		// as a pretty safe option, since all browsers already make a request to
		// this URL anyway and being a 404 will not hurt us here. We wrap an
		// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
		// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
		// since the iframe access rules appear to allow direct access and
		// manipulation of the document element, even for a 404 page. This
		// document can be used instead of the current document (which would
		// have been limited to the current path) to perform #userData storage.
		
		try {
			storageContainer = new ActiveXObject('htmlfile')
			storageContainer.open()
			storageContainer.write('<s' + 'cript>document.w=window</s' + 'cript><iframe src="/favicon.ico"></iframe>')
			storageContainer.close()
			storageOwner = storageContainer.w.frames[0].document
			storage = storageOwner.createElement('div')
		} catch(e) {
			// somehow ActiveXObject instantiation failed (perhaps some special
			// security settings or otherwse), fall back to per-path storage
			storage = doc.createElement('div')
			storageOwner = doc.body
		}
		var withIEStorage=function(storeFunction) {
			return function() {
				var args = Array.prototype.slice.call(arguments, 0)
				args.unshift(storage)
				// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
				// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
				storageOwner.appendChild(storage)
				storage.addBehavior('#default#userData')
				storage.load(localStorageName)
				var result = storeFunction.apply(store, args)
				storageOwner.removeChild(storage)
				return result
			}
		}
			
		// In IE7, keys may not contain special chars. See all of https://github.com/marcuswestin/store.js/issues/40
		var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
		var ieKeyFix=function(key){ return key.replace(forbiddenCharsRegex, '___') }
		
		return {
			get:withIEStorage(function(storage, key){
				key = ieKeyFix(key);
				return deserialize(storage.getAttribute(key));
			}),
			set:withIEStorage(function(storage, key, val){
				key = ieKeyFix(key);
				if (val === undefined) { return store.remove(key) }
				storage.setAttribute(key, serialize(val));
				storage.save(localStorageName);
			}),
			remove:withIEStorage(function(storage, key){
				key = ieKeyFix(key);
				storage.removeAttribute(key);
				storage.save(localStorageName);
			}),
			clear:withIEStorage(function(storage, key){
				var attributes = storage.XMLDocument.documentElement.attributes;
				storage.load(localStorageName);
				for (var i=0, attr; attr=attributes[i]; i++)
					storage.removeAttribute(attr.name)
				storage.save(localStorageName);
			}),
			iterator:withIEStorage(function(storage, key){
				var attributes = storage.XMLDocument.documentElement.attributes, i=0;
				return {
					next:function(){
						if (i >= attributes.length)
							throw StopIteration;
						var attr=attributes[i++], key=ieKeyFix(attr.name);
						return [attr.name, deserialize(storage.getAttribute(key)) ];
					}
				};
			}),
			forEach:function(callback){
				var it=S.iterator(this);
				while(it.hasNext())
					callback.apply(null,it.next());
			}
		}
	}
	
	
	// well, only thing left, is to use an object, only valid for this page...
	var object={};
	return {
		get:function(key){ return object[key]; },
		set:function(key,value){ object[key] = value; },
		remove:function(key){ delete object[key]; },
		clear:function(){ object={}; },
		forEach:function(callback){ UObj.forEach(object,callback); },
		iterator:function(){
			return UObj.iterator(object);
		}
	}
})();
