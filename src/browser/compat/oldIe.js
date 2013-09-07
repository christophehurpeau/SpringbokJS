/*
 * pre-loaded for ie < 9
 * post-loaded for browsers where !Object.create : FF < 4, Safari < 5, Opera < 12
 * 
 * If legacy needed : http://code.google.com/p/base2/source/browse/version/1.0.2/src/base2-legacy.js
 */
window.msie= parseInt((/msie (\d+)/.exec(lowercase(navigator.userAgent)) || [])[1],10);
window.isIElt9=window.msie && window.msie < 9;

var html5elements = "address|article|aside|audio|canvas|command|datalist|details|dialog|figure|figcaption|footer|header|hgroup|keygen|mark|meter|menu|nav|progress|ruby|section|time|video".split("|");
for (var i = 0; i < html5elements.length; i++) document.createElement(html5elements[i]);



/* JSON : http://caniuse.com/json */
/* https://github.com/douglascrockford/JSON-js/blob/master/json2.js (http://closure-compiler.appspot.com/home)*/
"object"!==typeof JSON&&(JSON={}); (function(){function m(a){return 10>a?"0"+a:a}function r(a){s.lastIndex=0;return s.test(a)?'"'+a.replace(s,function(a){var c=u[a];return"string"===typeof c?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function p(a,l){var c,d,h,q,g=e,f,b=l[a];b&&("object"===typeof b&&"function"===typeof b.toJSON)&&(b=b.toJSON(a));"function"===typeof k&&(b=k.call(l,a,b));switch(typeof b){case "string":return r(b);case "number":return isFinite(b)?String(b):"null";case "boolean":case "null":return String(b); case "object":if(!b)return"null";e+=n;f=[];if("[object Array]"===Object.prototype.toString.apply(b)){q=b.length;for(c=0;c<q;c+=1)f[c]=p(c,b)||"null";h=0===f.length?"[]":e?"[\n"+e+f.join(",\n"+e)+"\n"+g+"]":"["+f.join(",")+"]";e=g;return h}if(k&&"object"===typeof k)for(q=k.length,c=0;c<q;c+=1)"string"===typeof k[c]&&(d=k[c],(h=p(d,b))&&f.push(r(d)+(e?": ":":")+h));else for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&(h=p(d,b))&&f.push(r(d)+(e?": ":":")+h);h=0===f.length?"{}":e?"{\n"+e+f.join(",\n"+ e)+"\n"+g+"}":"{"+f.join(",")+"}";e=g;return h}}"function"!==typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+m(this.getUTCMonth()+1)+"-"+m(this.getUTCDate())+"T"+m(this.getUTCHours())+":"+m(this.getUTCMinutes())+":"+m(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var t=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, s=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,e,n,u={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},k;"function"!==typeof JSON.stringify&&(JSON.stringify=function(a,l,c){var d;n=e="";if("number"===typeof c)for(d=0;d<c;d+=1)n+=" ";else"string"===typeof c&&(n=c);if((k=l)&&"function"!==typeof l&&("object"!==typeof l||"number"!==typeof l.length))throw Error("JSON.stringify");return p("",{"":a})}); "function"!==typeof JSON.parse&&(JSON.parse=function(a,e){function c(a,d){var g,f,b=a[d];if(b&&"object"===typeof b)for(g in b)Object.prototype.hasOwnProperty.call(b,g)&&(f=c(b,g),void 0!==f?b[g]=f:delete b[g]);return e.call(a,d,b)}var d;a=String(a);t.lastIndex=0;t.test(a)&&(a=a.replace(t,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return d=eval("("+a+")"),"function"===typeof e?c({"":d},""):d;throw new SyntaxError("JSON.parse");})})();



/* http://kangax.github.com/es5-compat-table/ */
/* https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js */
/* https://github.com/kriskowal/es5-shim/blob/master/es5-sham.min.js */


/* https://github.com/kriskowal/es5-shim/blob/master/es5-shim.min.js */
(function(o){"function"==typeof define?define(o):"function"==typeof YUI?YUI.add("es5",o):o()})(function(){function o(){}function v(a){a=+a;a!==a?a=0:0!==a&&(a!==1/0&&a!==-(1/0))&&(a=(0<a||-1)*Math.floor(Math.abs(a)));return a}function s(a){var b=typeof a;return null===a||"undefined"===b||"boolean"===b||"number"===b||"string"===b}Function.prototype.bind||(Function.prototype.bind=function(a){var b=this;if("function"!=typeof b)throw new TypeError("Function.prototype.bind called on incompatible "+b);
var d=q.call(arguments,1),c=function(){if(this instanceof c){var e=b.apply(this,d.concat(q.call(arguments)));return Object(e)===e?e:this}return b.apply(a,d.concat(q.call(arguments)))};b.prototype&&(o.prototype=b.prototype,c.prototype=new o,o.prototype=null);return c});var k=Function.prototype.call,p=Object.prototype,q=Array.prototype.slice,h=k.bind(p.toString),t=k.bind(p.hasOwnProperty);t(p,"__defineGetter__")&&(k.bind(p.__defineGetter__),k.bind(p.__defineSetter__),k.bind(p.__lookupGetter__),k.bind(p.__lookupSetter__));
if(2!=[1,2].splice(0).length){var y=Array.prototype.splice;Array.prototype.splice=function(a,b){return arguments.length?y.apply(this,[a===void 0?0:a,b===void 0?this.length-a:b].concat(q.call(arguments,2))):[]}}if(1!=[].unshift(0)){var z=Array.prototype.unshift;Array.prototype.unshift=function(){z.apply(this,arguments);return this.length}}Array.isArray||(Array.isArray=function(a){return h(a)=="[object Array]"});var k=Object("a"),l="a"!=k[0]||!(0 in k);Array.prototype.forEach||(Array.prototype.forEach=
function(a,b){var d=n(this),c=l&&h(this)=="[object String]"?this.split(""):d,e=-1,f=c.length>>>0;if(h(a)!="[object Function]")throw new TypeError;for(;++e<f;)e in c&&a.call(b,c[e],e,d)});Array.prototype.map||(Array.prototype.map=function(a,b){var d=n(this),c=l&&h(this)=="[object String]"?this.split(""):d,e=c.length>>>0,f=Array(e);if(h(a)!="[object Function]")throw new TypeError(a+" is not a function");for(var g=0;g<e;g++)g in c&&(f[g]=a.call(b,c[g],g,d));return f});Array.prototype.filter||(Array.prototype.filter=
function(a,b){var d=n(this),c=l&&h(this)=="[object String]"?this.split(""):d,e=c.length>>>0,f=[],g;if(h(a)!="[object Function]")throw new TypeError(a+" is not a function");for(var i=0;i<e;i++)if(i in c){g=c[i];a.call(b,g,i,d)&&f.push(g)}return f});Array.prototype.every||(Array.prototype.every=function(a,b){var d=n(this),c=l&&h(this)=="[object String]"?this.split(""):d,e=c.length>>>0;if(h(a)!="[object Function]")throw new TypeError(a+" is not a function");for(var f=0;f<e;f++)if(f in c&&!a.call(b,c[f],
f,d))return false;return true});Array.prototype.some||(Array.prototype.some=function(a,b){var d=n(this),c=l&&h(this)=="[object String]"?this.split(""):d,e=c.length>>>0;if(h(a)!="[object Function]")throw new TypeError(a+" is not a function");for(var f=0;f<e;f++)if(f in c&&a.call(b,c[f],f,d))return true;return false});Array.prototype.reduce||(Array.prototype.reduce=function(a){var b=n(this),d=l&&h(this)=="[object String]"?this.split(""):b,c=d.length>>>0;if(h(a)!="[object Function]")throw new TypeError(a+
" is not a function");if(!c&&arguments.length==1)throw new TypeError("reduce of empty array with no initial value");var e=0,f;if(arguments.length>=2)f=arguments[1];else{do{if(e in d){f=d[e++];break}if(++e>=c)throw new TypeError("reduce of empty array with no initial value");}while(1)}for(;e<c;e++)e in d&&(f=a.call(void 0,f,d[e],e,b));return f});Array.prototype.reduceRight||(Array.prototype.reduceRight=function(a){var b=n(this),d=l&&h(this)=="[object String]"?this.split(""):b,c=d.length>>>0;if(h(a)!=
"[object Function]")throw new TypeError(a+" is not a function");if(!c&&arguments.length==1)throw new TypeError("reduceRight of empty array with no initial value");var e,c=c-1;if(arguments.length>=2)e=arguments[1];else{do{if(c in d){e=d[c--];break}if(--c<0)throw new TypeError("reduceRight of empty array with no initial value");}while(1)}do c in this&&(e=a.call(void 0,e,d[c],c,b));while(c--);return e});if(!Array.prototype.indexOf||-1!=[0,1].indexOf(1,2))Array.prototype.indexOf=function(a){var b=l&&
h(this)=="[object String]"?this.split(""):n(this),d=b.length>>>0;if(!d)return-1;var c=0;arguments.length>1&&(c=v(arguments[1]));for(c=c>=0?c:Math.max(0,d+c);c<d;c++)if(c in b&&b[c]===a)return c;return-1};if(!Array.prototype.lastIndexOf||-1!=[0,1].lastIndexOf(0,-3))Array.prototype.lastIndexOf=function(a){var b=l&&h(this)=="[object String]"?this.split(""):n(this),d=b.length>>>0;if(!d)return-1;var c=d-1;arguments.length>1&&(c=Math.min(c,v(arguments[1])));for(c=c>=0?c:d-Math.abs(c);c>=0;c--)if(c in b&&
a===b[c])return c;return-1};if(!Object.keys){var w=!0,x="toString toLocaleString valueOf hasOwnProperty isPrototypeOf propertyIsEnumerable constructor".split(" "),A=x.length,r;for(r in{toString:null})w=!1;Object.keys=function(a){if(typeof a!="object"&&typeof a!="function"||a===null)throw new TypeError("Object.keys called on a non-object");var b=[],d;for(d in a)t(a,d)&&b.push(d);if(w)for(d=0;d<A;d++){var c=x[d];t(a,c)&&b.push(c)}return b}}if(!Date.prototype.toISOString||-1===(new Date(-621987552E5)).toISOString().indexOf("-000001"))Date.prototype.toISOString=
function(){var a,b,d,c;if(!isFinite(this))throw new RangeError("Date.prototype.toISOString called on non-finite value.");c=this.getUTCFullYear();a=this.getUTCMonth();c=c+Math.floor(a/12);a=[(a%12+12)%12+1,this.getUTCDate(),this.getUTCHours(),this.getUTCMinutes(),this.getUTCSeconds()];c=(c<0?"-":c>9999?"+":"")+("00000"+Math.abs(c)).slice(0<=c&&c<=9999?-4:-6);for(b=a.length;b--;){d=a[b];d<10&&(a[b]="0"+d)}return c+"-"+a.slice(0,2).join("-")+"T"+a.slice(2).join(":")+"."+("000"+this.getUTCMilliseconds()).slice(-3)+
"Z"};r=!1;try{r=Date.prototype.toJSON&&null===(new Date(NaN)).toJSON()&&-1!==(new Date(-621987552E5)).toJSON().indexOf("-000001")&&Date.prototype.toJSON.call({toISOString:function(){return true}})}catch(H){}r||(Date.prototype.toJSON=function(){var a=Object(this),b;a:if(s(a))b=a;else{b=a.valueOf;if(typeof b==="function"){b=b.call(a);if(s(b))break a}b=a.toString;if(typeof b==="function"){b=b.call(a);if(s(b))break a}throw new TypeError;}if(typeof b==="number"&&!isFinite(b))return null;b=a.toISOString;
if(typeof b!="function")throw new TypeError("toISOString property is not callable");return b.call(a)});var g=Date,m=function(a,b,d,c,e,f,h){var i=arguments.length;if(this instanceof g){i=i==1&&String(a)===a?new g(m.parse(a)):i>=7?new g(a,b,d,c,e,f,h):i>=6?new g(a,b,d,c,e,f):i>=5?new g(a,b,d,c,e):i>=4?new g(a,b,d,c):i>=3?new g(a,b,d):i>=2?new g(a,b):i>=1?new g(a):new g;i.constructor=m;return i}return g.apply(this,arguments)},u=function(a,b){var d=b>1?1:0;return B[b]+Math.floor((a-1969+d)/4)-Math.floor((a-
1901+d)/100)+Math.floor((a-1601+d)/400)+365*(a-1970)},C=RegExp("^(\\d{4}|[+-]\\d{6})(?:-(\\d{2})(?:-(\\d{2})(?:T(\\d{2}):(\\d{2})(?::(\\d{2})(?:\\.(\\d{3}))?)?(Z|(?:([-+])(\\d{2}):(\\d{2})))?)?)?)?$"),B=[0,31,59,90,120,151,181,212,243,273,304,334,365],j;for(j in g)m[j]=g[j];m.now=g.now;m.UTC=g.UTC;m.prototype=g.prototype;m.prototype.constructor=m;m.parse=function(a){var b=C.exec(a);if(b){var d=Number(b[1]),c=Number(b[2]||1)-1,e=Number(b[3]||1)-1,f=Number(b[4]||0),h=Number(b[5]||0),i=Number(b[6]||
0),j=Number(b[7]||0),m=!b[4]||b[8]?0:Number(new g(1970,0)),k=b[9]==="-"?1:-1,l=Number(b[10]||0),b=Number(b[11]||0);if(f<(h>0||i>0||j>0?24:25)&&h<60&&i<60&&j<1E3&&c>-1&&c<12&&l<24&&b<60&&e>-1&&e<u(d,c+1)-u(d,c)){d=((u(d,c)+e)*24+f+l*k)*60;d=((d+h+b*k)*60+i)*1E3+j+m;if(-864E13<=d&&d<=864E13)return d}return NaN}return g.parse.apply(this,arguments)};Date=m;Date.now||(Date.now=function(){return(new Date).getTime()});if("0".split(void 0,0).length){var D=String.prototype.split;String.prototype.split=function(a,
b){return a===void 0&&b===0?[]:D.apply(this,arguments)}}if("".substr&&"b"!=="0b".substr(-1)){var E=String.prototype.substr;String.prototype.substr=function(a,b){return E.call(this,a<0?(a=this.length+a)<0?0:a:a,b)}}j="\t\n\x0B\f\r \u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029\ufeff";if(!String.prototype.trim||j.trim()){j="["+j+"]";var F=RegExp("^"+j+j+"*"),G=RegExp(j+j+"*$");String.prototype.trim=function(){if(this===void 0||this===
null)throw new TypeError("can't convert "+this+" to object");return String(this).replace(F,"").replace(G,"")}}var n=function(a){if(a==null)throw new TypeError("can't convert "+a+" to object");return Object(a)}});

/* replace "var e=b.contentWindow.Object.prototype;" into "var clone=function(a){var b={};if(a)for(var i in a)b[i]=a[i];return b},z=b.contentWindow.Object,e=(z?z.prototype:clone(Object.prototype));" */
/* https://github.com/kriskowal/es5-shim/blob/master/es5-sham.min.js */
(function(f){"function"==typeof define?define(f):"function"==typeof YUI?YUI.add("es5-sham",f):f()})(function(){function f(a){try{return Object.defineProperty(a,"sentinel",{}),"sentinel"in a}catch(c){}}var b=Function.prototype.call,g=Object.prototype,h=b.bind(g.hasOwnProperty),p,q,k,l,i;if(i=h(g,"__defineGetter__"))p=b.bind(g.__defineGetter__),q=b.bind(g.__defineSetter__),k=b.bind(g.__lookupGetter__),l=b.bind(g.__lookupSetter__);Object.getPrototypeOf||(Object.getPrototypeOf=function(a){return a.__proto__||
(a.constructor?a.constructor.prototype:g)});Object.getOwnPropertyDescriptor||(Object.getOwnPropertyDescriptor=function(a,c){if(typeof a!="object"&&typeof a!="function"||a===null)throw new TypeError("Object.getOwnPropertyDescriptor called on a non-object: "+a);if(h(a,c)){var d={enumerable:true,configurable:true};if(i){var b=a.__proto__;a.__proto__=g;var e=k(a,c),f=l(a,c);a.__proto__=b;if(e||f){if(e)d.get=e;if(f)d.set=f;return d}}d.value=a[c];return d}});Object.getOwnPropertyNames||(Object.getOwnPropertyNames=
function(a){return Object.keys(a)});if(!Object.create){var m;if(null===Object.prototype.__proto__||"undefined"==typeof document)m=function(){return{__proto__:null}};else{var r=function(){},b=document.createElement("iframe"),j=document.body||document.documentElement;b.style.display="none";j.appendChild(b);b.src="javascript:";var clone=function(a){var b={};if(a)for(var i in a)b[i]=a[i];return b},z=b.contentWindow.Object,e=(z?z.prototype:clone(Object.prototype));j.removeChild(b);b=null;delete e.constructor;delete e.hasOwnProperty;delete e.propertyIsEnumerable;delete e.isPrototypeOf;delete e.toLocaleString;
delete e.toString;delete e.valueOf;e.__proto__=null;r.prototype=e;m=function(){return new r}}Object.create=function(a,c){function d(){}var b;if(a===null)b=m();else{if(typeof a!=="object"&&typeof a!=="function")throw new TypeError("Object prototype may only be an Object or null");d.prototype=a;b=new d;b.__proto__=a}c!==void 0&&Object.defineProperties(b,c);return b}}if(Object.defineProperty&&(b=f({}),j="undefined"==typeof document||f(document.createElement("div")),!b||!j))var n=Object.defineProperty,
o=Object.defineProperties;if(!Object.defineProperty||n)Object.defineProperty=function(a,c,d){if(typeof a!="object"&&typeof a!="function"||a===null)throw new TypeError("Object.defineProperty called on non-object: "+a);if(typeof d!="object"&&typeof d!="function"||d===null)throw new TypeError("Property description must be an object: "+d);if(n)try{return n.call(Object,a,c,d)}catch(b){}if(h(d,"value"))if(i&&(k(a,c)||l(a,c))){var e=a.__proto__;a.__proto__=g;delete a[c];a[c]=d.value;a.__proto__=e}else a[c]=
d.value;else{if(!i)throw new TypeError("getters & setters can not be defined on this javascript engine");h(d,"get")&&p(a,c,d.get);h(d,"set")&&q(a,c,d.set)}return a};if(!Object.defineProperties||o)Object.defineProperties=function(a,c){if(o)try{return o.call(Object,a,c)}catch(d){}for(var b in c)h(c,b)&&b!="__proto__"&&Object.defineProperty(a,b,c[b]);return a};Object.seal||(Object.seal=function(a){return a});Object.freeze||(Object.freeze=function(a){return a});try{Object.freeze(function(){})}catch(t){var s=
Object.freeze;Object.freeze=function(a){return typeof a=="function"?a:s(a)}}Object.preventExtensions||(Object.preventExtensions=function(a){return a});Object.isSealed||(Object.isSealed=function(){return false});Object.isFrozen||(Object.isFrozen=function(){return false});Object.isExtensible||(Object.isExtensible=function(a){if(Object(a)!==a)throw new TypeError;for(var c="";h(a,c);)c=c+"?";a[c]=true;var b=h(a,c);delete a[c];return b})});



/* --- DOM --- */

/* http://code.google.com/p/base2/ - http://code.google.com/p/base2/source/browse/version/1.0.2/base2-dom-fp.js */
/*
  base2 - copyright 2007-2011, Dean Edwards
  http://code.google.com/p/base2/
  http://www.opensource.org/licenses/mit-license.php

  Contributors:
    Doeke Zanstra
*/
var base2={name:"base2",version:"1.0.2",exports:"Base,Package,Abstract,Module,Enumerable,Map,Collection,RegGrp,Undefined,Null,This,True,False,assignID,detect,global",namespace:""};new function(_D){var Undefined=K(),Null=K(null),True=K(true),False=K(false),This=function(){return this};var global=This();var base2=global.base2;var _1L=/%([1-9])/g;var _13=/^\s\s*/;var _14=/\s\s*$/;var _15=/([\/()[\]{}|*+-.,^$?\\])/g;var _E=/try/.test(detect)?/\bbase\b/:/.*/;var _F=["constructor","toString","valueOf"];var _16=detect("(jscript)")?new RegExp("^"+rescape(isNaN).replace(/isNaN/,"\\w+")+"$"):{test:False};var _17=1;var _5=Array.prototype.slice;_b();function assignID(a){if(!a.base2ID)a.base2ID="b2_"+_17++;return a.base2ID};var _G=function(a,b){base2.__prototyping=this.prototype;var c=new this;if(a)extend(c,a);delete base2.__prototyping;var d=c.constructor;function f(){if(!base2.__prototyping){if(this.constructor==arguments.callee||this.__constructing){this.__constructing=true;d.apply(this,arguments);delete this.__constructing}else{return extend(arguments[0],c)}}return this};c.constructor=f;for(var g in Base)f[g]=this[g];f.ancestor=this;f.base=Undefined;if(b)extend(f,b);f.prototype=c;if(f.init)f.init();return f};var Base=_G.call(Object,{constructor:function(){if(arguments.length>0){this.extend(arguments[0])}},base:function(){},extend:delegate(extend)},Base={ancestorOf:function(a){return _r(this,a)},extend:_G,forEach:function(a,b,c){_b(this,a,b,c)},implement:function(a){if(typeof a=="function"){a=a.prototype}extend(this.prototype,a);return this}});var Package=Base.extend({constructor:function(d,f){this.extend(f);if(this.init)this.init();if(this.name&&this.name!="base2"){if(!this.parent)this.parent=base2;this.parent.addName(this.name,this);this.namespace=format("var %1=%2;",this.name,String2.slice(this,1,-1))}if(d){var g=base2.JavaScript?base2.JavaScript.namespace:"";d.imports=Array2.reduce(csv(this.imports),function(a,b){var c=j(b)||j("JavaScript."+b);return a+=c.namespace},"var base2=(function(){return this.base2})();"+base2.namespace+g)+lang.namespace;d.exports=Array2.reduce(csv(this.exports),function(a,b){var c=this.name+"."+b;this.namespace+="var "+b+"="+c+";";return a+="if(!"+c+")"+c+"="+b+";"},"",this)+"this._18"+this.name+"();";var h=this;var i=String2.slice(this,1,-1);d["_18"+this.name]=function(){Package.forEach(h,function(a,b){if(a&&a.ancestorOf==Base.ancestorOf){a.toString=K(format("[%1.%2]",i,b));if(a.prototype.toString==Base.prototype.toString){a.prototype.toString=K(format("[object %1.%2]",i,b))}}})}}function j(a){a=a.split(".");var b=base2,c=0;while(b&&a[c]!=null){b=b[a[c++]]}return b}},exports:"",imports:"",name:"",namespace:"",parent:null,addName:function(a,b){if(!this[a]){this[a]=b;this.exports+=","+a;this.namespace+=format("var %1=%2.%1;",a,this.name)}},addPackage:function(a){this.addName(a,new Package(null,{name:a,parent:this}))},toString:function(){return format("[%1]",this.parent?String2.slice(this.parent,1,-1)+"."+this.name:this.name)}});var Abstract=Base.extend({constructor:function(){throw new TypeError("Abstract class cannot be instantiated.");}});var _19=0;var Module=Abstract.extend(null,{namespace:"",extend:function(a,b){var c=this.base();var d=_19++;c.namespace="";c.partial=this.partial;c.toString=K("[base2.Module["+d+"]]");Module[d]=c;c.implement(this);if(a)c.implement(a);if(b){extend(c,b);if(c.init)c.init()}return c},forEach:function(c,d){_b(Module,this.prototype,function(a,b){if(typeOf(a)=="function"){c.call(d,this[b],b,this)}},this)},implement:function(a){var b=this;var c=b.toString().slice(1,-1);if(typeof a=="function"){if(!_r(a,b)){this.base(a)}if(_r(Module,a)){for(var d in a){if(b[d]===undefined){var f=a[d];if(typeof f=="function"&&f.call&&a.prototype[d]){f=_1a(a,d)}b[d]=f}}b.namespace+=a.namespace.replace(/base2\.Module\[\d+\]/g,c)}}else{extend(b,a);_H(b,a)}return b},partial:function(){var c=Module.extend();var d=c.toString().slice(1,-1);c.namespace=this.namespace.replace(/(\w+)=b[^\)]+\)/g,"$1="+d+".$1");this.forEach(function(a,b){c[b]=partial(bind(a,c))});return c}});function _H(a,b){var c=a.prototype;var d=a.toString().slice(1,-1);for(var f in b){var g=b[f],h="";if(f.charAt(0)=="@"){if(detect(f.slice(1)))_H(a,g)}else if(!c[f]){if(f==f.toUpperCase()){h="var "+f+"="+d+"."+f+";"}else if(typeof g=="function"&&g.call){h="var "+f+"=base2.lang.bind('"+f+"',"+d+");";c[f]=_1b(a,f)}if(a.namespace.indexOf(h)==-1){a.namespace+=h}}}};function _1a(a,b){return function(){return a[b].apply(a,arguments)}};function _1b(b,c){return function(){var a=_5.call(arguments);a.unshift(this);return b[c].apply(b,a)}};var Enumerable=Module.extend({every:function(c,d,f){var g=true;try{forEach(c,function(a,b){g=d.call(f,a,b,c);if(!g)throw StopIteration;})}catch(error){if(error!=StopIteration)throw error;}return!!g},filter:function(d,f,g){var h=0;return this.reduce(d,function(a,b,c){if(f.call(g,b,c,d)){a[h++]=b}return a},[])},invoke:function(b,c){var d=_5.call(arguments,2);return this.map(b,(typeof c=="function")?function(a){return a==null?undefined:c.apply(a,d)}:function(a){return a==null?undefined:a[c].apply(a,d)})},map:function(c,d,f){var g=[],h=0;forEach(c,function(a,b){g[h++]=d.call(f,a,b,c)});return g},pluck:function(b,c){return this.map(b,function(a){return a==null?undefined:a[c]})},reduce:function(c,d,f,g){var h=arguments.length>2;forEach(c,function(a,b){if(h){f=d.call(g,f,a,b,c)}else{f=a;h=true}});return f},some:function(a,b,c){return!this.every(a,not(b),c)}});var _2="#";var Map=Base.extend({constructor:function(a){if(a)this.merge(a)},clear:function(){for(var a in this)if(a.indexOf(_2)==0){delete this[a]}},copy:function(){base2.__prototyping=true;var a=new this.constructor;delete base2.__prototyping;for(var b in this)if(this[b]!==a[b]){a[b]=this[b]}return a},forEach:function(a,b){for(var c in this)if(c.indexOf(_2)==0){a.call(b,this[c],c.slice(1),this)}},get:function(a){return this[_2+a]},getKeys:function(){return this.map(II)},getValues:function(){return this.map(I)},has:function(a){/*@cc_on @*/ /*@if(@_jscript_version<5.5)return $Legacy.has(this,_2+a);@else @*/return _2+a in this;/*@end @*/},merge:function(b){var c=flip(this.put);forEach(arguments,function(a){forEach(a,c,this)},this);return this},put:function(a,b){this[_2+a]=b},remove:function(a){delete this[_2+a]},size:function(){var a=0;for(var b in this)if(b.indexOf(_2)==0)a++;return a},union:function(a){return this.merge.apply(this.copy(),arguments)}});Map.implement(Enumerable);Map.prototype.filter=function(d,f){return this.reduce(function(a,b,c){if(!d.call(f,b,c,this)){a.remove(c)}return a},this.copy(),this)};var _0="~";var Collection=Map.extend({constructor:function(a){this[_0]=new Array2;this.base(a)},add:function(a,b){assert(!this.has(a),"Duplicate key '"+a+"'.");this.put.apply(this,arguments)},clear:function(){this.base();this[_0].length=0},copy:function(){var a=this.base();a[_0]=this[_0].copy();return a},forEach:function(a,b){var c=this[_0];var d=c.length;for(var f=0;f<d;f++){a.call(b,this[_2+c[f]],c[f],this)}},getAt:function(a){var b=this[_0].item(a);return(b===undefined)?undefined:this[_2+b]},getKeys:function(){return this[_0].copy()},indexOf:function(a){return this[_0].indexOf(String(a))},insertAt:function(a,b,c){assert(this[_0].item(a)!==undefined,"Index out of bounds.");assert(!this.has(b),"Duplicate key '"+b+"'.");this[_0].insertAt(a,String(b));this[_2+b]=null;this.put.apply(this,_5.call(arguments,1))},item:function(a){return this[typeof a=="number"?"getAt":"get"](a)},put:function(a,b){if(!this.has(a)){this[_0].push(String(a))}var c=this.constructor;if(c.Item&&!instanceOf(b,c.Item)){b=c.create.apply(c,arguments)}this[_2+a]=b},putAt:function(a,b){arguments[0]=this[_0].item(a);assert(arguments[0]!==undefined,"Index out of bounds.");this.put.apply(this,arguments)},remove:function(a){if(this.has(a)){this[_0].remove(String(a));delete this[_2+a]}},removeAt:function(a){var b=this[_0].item(a);if(b!==undefined){this[_0].removeAt(a);delete this[_2+b]}},reverse:function(){this[_0].reverse();return this},size:function(){return this[_0].length},slice:function(a,b){var c=this.copy();if(arguments.length>0){var d=this[_0],f=d;c[_0]=Array2(_5.apply(d,arguments));if(c[_0].length){f=f.slice(0,a);if(arguments.length>1){f=f.concat(d.slice(b))}}for(var g=0;g<f.length;g++){delete c[_2+f[g]]}}return c},sort:function(c){if(c){this[_0].sort(bind(function(a,b){return c(this[_2+a],this[_2+b],a,b)},this))}else this[_0].sort();return this},toString:function(){return"("+(this[_0]||"")+")"}},{Item:null,create:function(a,b){return this.Item?new this.Item(a,b):b},extend:function(a,b){var c=this.base(a);c.create=this.create;if(b)extend(c,b);if(!c.Item){c.Item=this.Item}else if(typeof c.Item!="function"){c.Item=(this.Item||Base).extend(c.Item)}if(c.init)c.init();return c}});var _1c=/\\(\d+)/g,_1d=/\\./g,_1e=/\(\?[:=!]|\[[^\]]+\]/g,_1f=/\(/g,_1g=/\$(\d+)/,_1h=/^\$\d+$/;var RegGrp=Collection.extend({constructor:function(a,b){this.base(a);this.ignoreCase=!!b},ignoreCase:false,exec:function(h,i){h+="";var j=this,k=this[_0];if(!k.length)return h;if(i==RegGrp.IGNORE)i=0;return h.replace(new RegExp(this,this.ignoreCase?"gi":"g"),function(a){var b,c=1,d=0;while((b=j[_2+k[d++]])){var f=c+b.length+1;if(arguments[c]){var g=i==null?b.replacement:i;switch(typeof g){case"function":return g.apply(j,_5.call(arguments,c,f));case"number":return arguments[c+g];default:return g}}c=f}return a})},insertAt:function(a,b,c){if(instanceOf(b,RegExp)){arguments[1]=b.source}return base(this,arguments)},test:function(a){return this.exec(a)!=a},toString:function(){var f=1;return"("+this.map(function(c){var d=(c+"").replace(_1c,function(a,b){return"\\"+(f+Number(b))});f+=c.length+1;return d}).join(")|(")+")"}},{IGNORE:"$0",init:function(){forEach("add,get,has,put,remove".split(","),function(b){_s(this,b,function(a){if(instanceOf(a,RegExp)){arguments[0]=a.source}return base(this,arguments)})},this.prototype)},Item:{constructor:function(a,b){if(b==null)b=RegGrp.IGNORE;else if(b.replacement!=null)b=b.replacement;else if(typeof b!="function")b=String(b);if(typeof b=="string"&&_1g.test(b)){if(_1h.test(b)){b=parseInt(b.slice(1))}else{var c='"';b=b.replace(/\\/g,"\\\\").replace(/"/g,"\\x22").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\$(\d+)/g,c+"+(arguments[$1]||"+c+c+")+"+c).replace(/(['"])\1\+(.*)\+\1\1$/,"$1");b=new Function("return "+c+b+c)}}this.length=RegGrp.count(a);this.replacement=b;this.toString=K(a+"")},length:0,replacement:""},count:function(a){a=(a+"").replace(_1d,"").replace(_1e,"");return match(a,_1f).length}});var lang={name:"lang",version:base2.version,exports:"assert,assertArity,assertType,base,bind,copy,extend,forEach,format,instanceOf,match,pcopy,rescape,trim,typeOf",namespace:""};function assert(a,b,c){if(!a){throw new(c||Error)(b||"Assertion failed.");}};function assertArity(a,b,c){if(b==null)b=a.callee.length;if(a.length<b){throw new SyntaxError(c||"Not enough arguments.");}};function assertType(a,b,c){if(b&&(typeof b=="function"?!instanceOf(a,b):typeOf(a)!=b)){throw new TypeError(c||"Invalid type.");}};function copy(a){var b={};for(var c in a){b[c]=a[c]}return b};function pcopy(a){_I.prototype=a;return new _I};function _I(){};function base(a,b){return a.base.apply(a,b)};function extend(a,b){if(a&&b){if(arguments.length>2){var c=b;b={};b[c]=arguments[2]}var d=global[(typeof b=="function"?"Function":"Object")].prototype;if(base2.__prototyping){var f=_F.length,c;while((c=_F[--f])){var g=b[c];if(g!=d[c]){if(_E.test(g)){_s(a,c,g)}else{a[c]=g}}}}for(c in b){if(d[c]===undefined){var g=b[c];if(c.charAt(0)=="@"){if(detect(c.slice(1)))extend(a,g)}else{var h=a[c];if(h&&typeof g=="function"){if(g!=h){if(_E.test(g)){_s(a,c,g)}else{g.ancestor=h;a[c]=g}}}else{a[c]=g}}}}}return a};function _r(a,b){while(b){if(!b.ancestor)return false;b=b.ancestor;if(b==a)return true}return false};function _s(c,d,f){var g=c[d];var h=base2.__prototyping;if(h&&g!=h[d])h=null;function i(){var a=this.base;this.base=h?h[d]:g;var b=f.apply(this,arguments);this.base=a;return b};i.method=f;i.ancestor=g;c[d]=i};if(typeof StopIteration=="undefined"){StopIteration=new Error("StopIteration")}function forEach(a,b,c,d){if(a==null)return;if(!d){if(typeof a=="function"&&a.call){d=Function}else if(typeof a.forEach=="function"&&a.forEach!=arguments.callee){a.forEach(b,c);return}else if(typeof a.length=="number"){_J(a,b,c);return}}_b(d||Object,a,b,c)};forEach.csv=function(a,b,c){forEach(csv(a),b,c)};forEach.detect=function(c,d,f){forEach(c,function(a,b){if(b.charAt(0)=="@"){if(detect(b.slice(1)))forEach(a,arguments.callee)}else d.call(f,a,b,c)})};function _J(a,b,c){if(a==null)a=global;var d=a.length||0,f;if(typeof a=="string"){for(f=0;f<d;f++){b.call(c,a.charAt(f),f,a)}}else{for(f=0;f<d;f++){/*@cc_on @*/ /*@if(@_jscript_version<5.2)if($Legacy.has(a,f))@else @*/if(f in a)/*@end @*/b.call(c,a[f],f,a)}}};function _b(h,i,j,k){var l=function(){this.i=1};l.prototype={i:1};var m=0;for(var n in new l)m++;_b=(m>1)?function(a,b,c,d){var f={};for(var g in b){if(!f[g]&&a.prototype[g]===undefined){f[g]=true;c.call(d,b[g],g,b)}}}:function(a,b,c,d){for(var f in b){if(a.prototype[f]===undefined){c.call(d,b[f],f,b)}}};_b(h,i,j,k)};function instanceOf(a,b){if(typeof b!="function"){throw new TypeError("Invalid 'instanceOf' operand.");}if(a==null)return false;/*@cc_on if(typeof a.constructor!="function"){return typeOf(a)==typeof b.prototype.valueOf()}@*/if(a.constructor==b)return true;if(b.ancestorOf)return b.ancestorOf(a.constructor);/*@if(@_jscript_version<5.1)@else @*/if(a instanceof b)return true;/*@end @*/if(Base.ancestorOf==b.ancestorOf)return false;if(Base.ancestorOf==a.constructor.ancestorOf)return b==Object;switch(b){case Array:return!!(typeof a=="object"&&a.join&&a.splice);case Function:return typeOf(a)=="function";case RegExp:return typeof a.constructor.$1=="string";case Date:return!!a.getTimezoneOffset;case String:case Number:case Boolean:return typeOf(a)==typeof b.prototype.valueOf();case Object:return true}return false};function typeOf(a){var b=typeof a;switch(b){case"object":return a==null?"null":typeof a.constructor=="undefined"?_16.test(a)?"function":b:typeof a.constructor.prototype.valueOf();case"function":return typeof a.call=="function"?b:"object";default:return b}};var JavaScript={name:"JavaScript",version:base2.version,exports:"Array2,Date2,Function2,String2",namespace:"",bind:function(c){var d=global;global=c;forEach.csv(this.exports,function(a){var b=a.slice(0,-1);extend(c[b],this[a]);this[a](c[b].prototype)},this);global=d;return c}};function _i(b,c,d,f){var g=Module.extend();var h=g.toString().slice(1,-1);forEach.csv(d,function(a){g[a]=unbind(b.prototype[a]);g.namespace+=format("var %1=%2.%1;",a,h)});forEach(_5.call(arguments,3),g.implement,g);var i=function(){return g(this.constructor==g?c.apply(null,arguments):arguments[0])};i.prototype=g.prototype;for(var j in g){if(j!="prototype"&&b[j]){delete g.prototype[j]}i[j]=g[j]}i.ancestor=Object;delete i.extend;i.namespace=i.namespace.replace(/(var (\w+)=)[^,;]+,([^\)]+)\)/g,"$1$3.$2");return i};if((new Date).getYear()>1900){Date.prototype.getYear=function(){return this.getFullYear()-1900};Date.prototype.setYear=function(a){return this.setFullYear(a+1900)}}var _K=new Date(Date.UTC(2006,1,20));_K.setUTCDate(15);if(_K.getUTCHours()!=0){forEach.csv("FullYear,Month,Date,Hours,Minutes,Seconds,Milliseconds",function(b){extend(Date.prototype,"setUTC"+b,function(){var a=base(this,arguments);if(a>=57722401000){a-=3600000;this.setTime(a)}return a})})}Function.prototype.prototype={};if("".replace(/^/,K("$$"))=="$"){extend(String.prototype,"replace",function(a,b){if(typeof b=="function"){var c=b;b=function(){return String(c.apply(null,arguments)).split("$").join("$$")}}return this.base(a,b)})}var Array2=_i(Array,Array,"concat,join,pop,push,reverse,shift,slice,sort,splice,unshift",Enumerable,{combine:function(d,f){if(!f)f=d;return Array2.reduce(d,function(a,b,c){a[b]=f[c];return a},{})},contains:function(a,b){return Array2.indexOf(a,b)!=-1},copy:function(a){var b=_5.call(a);if(!b.swap)Array2(b);return b},flatten:function(c){var d=0;return Array2.reduce(c,function(a,b){if(Array2.like(b)){Array2.reduce(b,arguments.callee,a)}else{a[d++]=b}return a},[])},forEach:_J,indexOf:function(a,b,c){var d=a.length;if(c==null){c=0}else if(c<0){c=Math.max(0,d+c)}for(var f=c;f<d;f++){if(a[f]===b)return f}return-1},insertAt:function(a,b,c){Array2.splice(a,b,0,c);return c},item:function(a,b){if(b<0)b+=a.length;return a[b]},lastIndexOf:function(a,b,c){var d=a.length;if(c==null){c=d-1}else if(c<0){c=Math.max(0,d+c)}for(var f=c;f>=0;f--){if(a[f]===b)return f}return-1},map:function(c,d,f){var g=[];Array2.forEach(c,function(a,b){g[b]=d.call(f,a,b,c)});return g},remove:function(a,b){var c=Array2.indexOf(a,b);if(c!=-1)Array2.removeAt(a,c)},removeAt:function(a,b){Array2.splice(a,b,1)},swap:function(a,b,c){if(b<0)b+=a.length;if(c<0)c+=a.length;var d=a[b];a[b]=a[c];a[c]=d;return a}});Array2.reduce=Enumerable.reduce;Array2.like=function(a){return typeOf(a)=="object"&&typeof a.length=="number"};var _1i=/^((-\d+|\d{4,})(-(\d{2})(-(\d{2}))?)?)?T((\d{2})(:(\d{2})(:(\d{2})(\.(\d{1,3})(\d)?\d*)?)?)?)?(([+-])(\d{2})(:(\d{2}))?|Z)?$/;var _a={FullYear:2,Month:4,Date:6,Hours:8,Minutes:10,Seconds:12,Milliseconds:14};var _8={Hectomicroseconds:15,UTC:16,Sign:17,Hours:18,Minutes:20};var _1j=/(((00)?:0+)?:0+)?\.0+$/;var _1k=/(T[0-9:.]+)$/;var Date2=_i(Date,function(a,b,c,d,f,g,h){switch(arguments.length){case 0:return new Date;case 1:return typeof a=="number"?new Date(a):Date2.parse(a);default:return new Date(a,b,arguments.length==2?1:c,d||0,f||0,g||0,h||0)}},"",{toISOString:function(c){var d="####-##-##T##:##:##.###";for(var f in _a){d=d.replace(/#+/,function(a){var b=c["getUTC"+f]();if(f=="Month")b++;return("000"+b).slice(-a.length)})}return d.replace(_1j,"").replace(_1k,"$1Z")}});delete Date2.forEach;Date2.now=function(){return(new Date).valueOf()};Date2.parse=function(a,b){if(arguments.length>1){assertType(b,"number","default date should be of type 'number'.")}var c=match(a,_1i);if(c.length){if(c[_a.Month])c[_a.Month]--;if(c[_8.Hectomicroseconds]>=5)c[_a.Milliseconds]++;var d=new Date(b||0);var f=c[_8.UTC]||c[_8.Hours]?"UTC":"";for(var g in _a){var h=c[_a[g]];if(!h)continue;d["set"+f+g](h);if(d["get"+f+g]()!=c[_a[g]]){return NaN}}if(c[_8.Hours]){var i=Number(c[_8.Sign]+c[_8.Hours]);var j=Number(c[_8.Sign]+(c[_8.Minutes]||0));d.setUTCMinutes(d.getUTCMinutes()+(i*60)+j)}return d.valueOf()}else{return Date.parse(a)}};var String2=_i(String,function(a){return new String(arguments.length==0?"":a)},"charAt,charCodeAt,concat,indexOf,lastIndexOf,match,replace,search,slice,split,substr,substring,toLowerCase,toUpperCase",{csv:csv,format:format,rescape:rescape,trim:trim});delete String2.forEach;function trim(a){return String(a).replace(_13,"").replace(_14,"")};function csv(a){return a?(a+"").split(/\s*,\s*/):[]};function format(c){var d=arguments;var f=new RegExp("%([1-"+(arguments.length-1)+"])","g");return(c+"").replace(f,function(a,b){return d[b]})};function match(a,b){return(a+"").match(b)||[]};function rescape(a){return(a+"").replace(_15,"\\$1")};var Function2=_i(Function,Function,"",{I:I,II:II,K:K,bind:bind,compose:compose,delegate:delegate,flip:flip,not:not,partial:partial,unbind:unbind});function I(a){return a};function II(a,b){return b};function K(a){return function(){return a}};function bind(a,b){var c=typeof a!="function";if(arguments.length>2){var d=_5.call(arguments,2);return function(){return(c?b[a]:a).apply(b,d.concat.apply(d,arguments))}}else{return function(){return(c?b[a]:a).apply(b,arguments)}}};function compose(){var c=_5.call(arguments);return function(){var a=c.length,b=c[--a].apply(this,arguments);while(a--)b=c[a].call(this,b);return b}};function delegate(b,c){return function(){var a=_5.call(arguments);a.unshift(this);return b.apply(c,a)}};function flip(a){return function(){return a.apply(this,Array2.swap(arguments,0,1))}};function not(a){return function(){return!a.apply(this,arguments)}};function partial(d){var f=_5.call(arguments,1);return function(){var a=f.concat(),b=0,c=0;while(b<f.length&&c<arguments.length){if(a[b]===undefined)a[b]=arguments[c++];b++}while(c<arguments.length){a[b++]=arguments[c++]}if(Array2.contains(a,undefined)){a.unshift(d);return partial.apply(null,a)}return d.apply(this,a)}};function unbind(b){return function(a){return b.apply(a,_5.call(arguments,1))}};function detect(){var f=NaN/*@cc_on||@_jscript_version@*/;var g=global.java?true:false;if(global.navigator){var h=/MSIE[\d.]+/g;var i=document.createElement("span");var j=navigator.userAgent.replace(/([a-z])[\s\/](\d)/gi,"$1$2");if(!f)j=j.replace(h,"");if(h.test(j))j=j.match(h)[0]+" "+j.replace(h,"");base2.userAgent=navigator.platform+" "+j.replace(/like \w+/gi,"");g&=navigator.javaEnabled()}var k={};detect=function(a){if(k[a]==null){var b=false,c=a;var d=c.charAt(0)=="!";if(d)c=c.slice(1);if(c.charAt(0)=="("){try{b=new Function("element,jscript,java,global","return !!"+c)(i,f,g,global)}catch(ex){}}else{b=new RegExp("("+c+")","i").test(base2.userAgent)}k[a]=!!(d^b)}return k[a]};return detect(arguments[0])};base2=global.base2=new Package(this,base2);var exports=this.exports;lang=new Package(this,lang);exports+=this.exports;JavaScript=new Package(this,JavaScript);eval(exports+this.exports);lang.base=base;lang.extend=extend};new function(_D){var DOM=new base2.Package(this,{name:"DOM",version:"1.0.1",imports:"Function2",exports:"Interface,Binding,Node,Document,Element,AbstractView,HTMLDocument,HTMLElement,Selector,Traversal,CSSParser,XPathParser,NodeSelector,DocumentSelector,ElementSelector,StaticNodeList,Event,EventTarget,DocumentEvent,ViewCSS,CSSStyleDeclaration,ClassList",bind:function(a){if(a&&a.nodeType){var b=assignID(a);if(!DOM.bind[b]){switch(a.nodeType){case 1:if(typeof a.className=="string"){(HTMLElement.bindings[a.tagName]||HTMLElement).bind(a)}else{Element.bind(a)}break;case 9:if(a.writeln){HTMLDocument.bind(a)}else{Document.bind(a)}break;default:Node.bind(a)}DOM.bind[b]=true}}return a},"@MSIE5.+win":{bind:function(a){if(a&&a.writeln){a.nodeType=9}return this.base(a)}}});eval(this.imports);var _9=detect("MSIE");var _j=detect("MSIE5");var Interface=Module.extend(null,{forEach:function(c,d){forEach(this,function(a,b){if(typeOf(a)=="function"&&(this.prototype[b]||a._k)){c.call(d,a,b,this)}},this,Module)},implement:function(a){if(typeof a=="object"){_L(this,a)}else if(Interface.ancestorOf(a)){for(var b in a){if(a[b]&&a[b]._k){this[b]=bind(b,a);this[b]._k=b}}}return this.base(a)}});function _L(a,b){var c=a.toString().slice(1,-1);for(var d in b){var f=b[d];if(d.charAt(0)=="@"){_L(a,f)}else if(!a[d]&&typeof f=="function"&&f.call){var g="abcdefghij".slice(0,f.length).split("");var h=new Function(g.join(","),format("%2.base=%2.%1.ancestor;var m=%2.base?'base':'%1';return %2[m](%3)",d,g[0],g.slice(1)));h._k=d;a[d]=h;a.namespace+="var "+d+"=base2.lang.bind('"+d+"',"+c+");";}}};var Binding=Interface.extend(null,{extend:function(d,a){if(a&&a.bind!=Function.bind){var c=a.bind;delete a.bind}
var b=this.base(d,a);b.bind=this.bind;if(c)extend(b,"bind",c);return b},bind:function(b){return extend(b,this.prototype)}});var Node=Binding.extend({"@!(element.compareDocumentPosition)":{compareDocumentPosition:function(a,b){if(Traversal.contains(a,b)){return 4|16;}else if(Traversal.contains(b,a)){return 2|8;}var c=_M(a);var d=_M(b);if(c<d){return 4;}else if(c>d){return 2;}return 0;}}},{"@Gecko":{bind:function(b){return extend(this.base(b),"removeEventListener",function(){var a=Array2.slice(arguments);a.unshift(this);EventTarget.removeEventListener.apply(EventTarget,a);});}}});var _M=document.documentElement.sourceIndex?function(a){return a.sourceIndex;}:function(a){var b=0;while(a){b=Traversal.getNodeIndex(a)+"."+b;a=a.parentNode;}return b;};var Document=Node.extend(null,{bind:function(b){extend(b,"createElement",function(a){return DOM.bind(this.base(a));});AbstractView.bind(b.defaultView);if(b!=window.document)new DOMContentLoadedEvent(b);return this.base(b);},"@!(document.defaultView)":{bind:function(a){a.defaultView=Traversal.getDefaultView(a);return this.base(a);}}});var _l={"class":"className","for":"htmlFor"};var Element=Node.extend({"@MSIE.+win":{getAttribute:function(a,b){if(a.className===undefined){return this.base(a,b);}var c=_N(a,b);if(c&&(c.specified||b=="value")){if(b=="href"||b=="src"){a.base=a.getAttribute.ancestor;return a[a.base?"base":"getAttribute"](b,2);}else if(b=="style"){return a.style.cssText.toLowerCase();}else{return c.nodeValue;}}else if(b=="type"&&a.nodeName=="INPUT"){var d=a.outerHTML;with(d)d=slice(0,indexOf(">")+1);return match(d,/type="?([^\s">]*)"?/i)[1]||null}return null},removeAttribute:function(a,b){if(a.className!==undefined){b=_l[b.toLowerCase()]||b}this.base(a,b)},setAttribute:function(a,b,c){if(a.className===undefined){this.base(a,b,c)}else if(b=="style"){a.style.cssText=c}else{c=String(c);var d=_N(a,b);if(d){d.nodeValue=c}else{this.base(a,_l[b.toLowerCase()]||b,c)}}}},"@!(element.hasAttribute)":{hasAttribute:function(a,b){if(a.className===undefined){return this.base(a,b)}return this.getAttribute(a,b)!=null}}});if(detect("MSIE.+win"))extend(Element.prototype,"cloneNode",function(deep){var clone=this.base(deep||false);clone.base2ID=undefined;return clone});var _O="colSpan,rowSpan,vAlign,dateTime,accessKey,tabIndex,encType,maxLength,readOnly,longDesc";extend(_l,Array2.combine(_O.toLowerCase().split(","),_O.split(",")));var _N=document.documentElement.getAttributeNode?function(a,b){return a.getAttributeNode(b)}:function(a,b){return a.attributes[b]||a.attributes[_l[b.toLowerCase()]]};var TEXT=detect("(element.textContent===undefined)")?"innerText":"textContent";var Traversal=Module.extend({getDefaultView:function(a){return this.getDocument(a).defaultView},getNextElementSibling:function(a){while(a&&(a=a.nextSibling)&&!this.isElement(a))continue;return a},getNodeIndex:function(a){var b=0;while(a&&(a=a.previousSibling))b++;return b},getOwnerDocument:function(a){return a.ownerDocument},getPreviousElementSibling:function(a){while(a&&(a=a.previousSibling)&&!this.isElement(a))continue;return a},getTextContent:function(a,b){return a[b?"innerHTML":TEXT]},isEmpty:function(a){a=a.firstChild;while(a){if(a.nodeType==3||this.isElement(a))return false;a=a.nextSibling}return true},setTextContent:function(a,b,c){return a[c?"innerHTML":TEXT]=b},"@!MSIE":{setTextContent:function(a,b,c){with(a)while(lastChild)parentNode.removeChild(lastChild);return this.base(a,b,c)}},"@MSIE":{getDefaultView:function(a){return(a.document||a).parentWindow},"@MSIE5":{getOwnerDocument:function(a){return a.ownerDocument||a.document}}}},{contains:function(a,b){a.nodeType;while(b&&(b=b.parentNode)&&a!=b)continue;return!!b},getDocument:function(a){return this.isDocument(a)?a:a.ownerDocument||a.document},isDocument:function(a){return!!(a&&a.documentElement)},isElement:function(a){return!!(a&&a.nodeType==1)},"@(element.contains)":{contains:function(a,b){return a!=b&&(this.isDocument(a)?a==this.getOwnerDocument(b):a.contains(b))}},"@MSIE5":{isElement:function(a){return!!(a&&a.nodeType==1&&a.nodeName!="!")}}});var AbstractView=Binding.extend();var _P={},_Q={"2":2,"4":1};var _e=1,_R=2,_m=3;var _S=/^mouse(up|down)|click$/,_1l=/click$/,_t="abort|error|select|change|resize|scroll|",_n="(dbl)?click|mouse(down|up|over|move|out|wheel)|key(down|up)|submit|reset";_t=new RegExp("^("+_t+_n+")$");_n=new RegExp("^("+_n+")$");if(_9){var _1m={focusin:"focus",focusout:"blur"};_P={focus:"focusin",blur:"focusout"}}var _T=/^(blur|submit|reset|change|select)$|^(mouse|key|focus)|click$/;var Event=Binding.extend({"@!(document.createEvent)":{initEvent:function(a,b,c,d){a.type=String(b);a.bubbles=!!c;a.cancelable=!!d},preventDefault:function(a){if(a.cancelable!==false){a.returnValue=false}},stopPropagation:function(a){a.cancelBubble=true},"@MSIE":{preventDefault:function(b){this.base(b);if(b.type=="mousedown"){var c="onbeforedeactivate";var d=Traversal.getDocument(b.target);d.attachEvent(c,function(a){a.returnValue=false;d.detachEvent(c,arguments.callee)})}}}}},{CAPTURING_PHASE:_e,AT_TARGET:_R,BUBBLING_PHASE:_m,"@!(document.createEvent)":{"@MSIE":{bind:function(a){var b=a.type;if(!a.timeStamp){a.bubbles=_t.test(b);a.cancelable=_n.test(b);a.timeStamp=new Date().valueOf()}a.relatedTarget=a[(a.target==a.fromElement?"to":"from")+"Element"];return this.base(a)}}},cloneEvent:function(a){var b=copy(a);b.stopPropagation=function(){a.stopPropagation()};b.preventDefault=function(){a.preventDefault()};return b},"@MSIE":{cloneEvent:copy}});var EventDispatcher=Base.extend({constructor:function(a){this.state=a;this.events=a.events},dispatch:function(a,b,c){b.eventPhase=c;var d=this.events[b.type][c];if(d){var f=a.length;while(f--&&!b.cancelBubble){var g=a[f];var h=d[g.base2ID];if(h){h=copy(h);b.currentTarget=g;b.eventPhase=g==b.target?_R:c;for(var i in h){var j=h[i];if(typeof j=="function"){j.call(g,b)}else{j.handleEvent(b)}}}}}},handleEvent:function(a,b){Event.bind(a);var c=a.type;var d=_1m[c];if(d){a=copy(a);c=a.type=d}if(this.events[c]){if(_S.test(c)){var f=_1l.test(c)?this.state._u:a.button;f=_Q[f]||0;if(a.button!=f){a=copy(a);a.button=f}}var g=a.target;var h=[],i=0;while(g){h[i++]=g;g=g.parentNode}this.dispatch(h,a,_e);if(!a.cancelBubble){if(!a.bubbles)h.length=1;h.reverse();this.dispatch(h,a,_m)}}return a.returnValue!==false},"@MSIE.+win":{handleEvent:function(a){if(a.type=="scroll"){setTimeout(bind(this.base,this,copy(a),true),0);return true}else{return this.base(a)}},"@MSIE5":{dispatch:function(a,b,c){if(c==_e&&!Array2.item(a,-1).documentElement){a.push(a[0].document)}this.base(a,b,c)}}}});var _f={};var EventTarget=Interface.extend({"@!(element.addEventListener)":{addEventListener:function(a,b,c,d){var f=DocumentState.getInstance(a);var g=assignID(a);var h=assignID(c);var i=d?_e:_m;var j=f.registerEvent(b,a);var k=j[i];if(!k)k=j[i]={};if(d)b=_P[b]||b;var l=k[g];if(!l)l=k[g]={};l[h]=c},dispatchEvent:function(a,b){b.target=a;return DocumentState.getInstance(a).handleEvent(b)},removeEventListener:function(a,b,c,d){var f=DocumentState.getInstance(a).events;var g=f[b];if(g){var h=g[d?_e:_m];if(h){var i=h[a.base2ID];if(i)delete i[c.base2ID]}}}},"@(element.addEventListener)":{"@Gecko":{addEventListener:function(b,c,d,f){if(c=="mousewheel"){c="DOMMouseScroll";var g=d;d=_f[assignID(d)]=function(a){a=Event.cloneEvent(a);a.type="mousewheel";a.wheelDelta=(-a.detail*40)||0;_v(b,g,a)}}this.base(b,c,d,f)}},"@webkit[1-4]|KHTML[34]":{addEventListener:function(c,d,f,g){if(_S.test(d)){var h=f;f=_f[assignID(f)]=function(a){var b=_Q[a.button]||0;if(a.button!=b){a=Event.cloneEvent(a);a.button=b}_v(c,h,a)}}else if(typeof f=="object"){f=_f[assignID(f)]=bind("handleEvent",f)}this.base(c,d,f,g)}},"@Linux|Mac|opera":{addEventListener:function(g,h,i,j){if(h=="keydown"){var k=i;i=_f[assignID(i)]=function(b){var c=0,d=false;extend(b,"preventDefault",function(){this.base();d=true});function f(a){if(d)a.preventDefault();if(a==b||c>1){_v(g,k,b)}c++};f(b);g.addEventListener("keyup",function(){g.removeEventListener("keypress",f,true);g.removeEventListener("keyup",arguments.callee,true)},true);g.addEventListener("keypress",f,true)}}this.base(g,h,i,j)}},removeEventListener:function(a,b,c,d){this.base(a,b,_f[c.base2ID]||c,d)}}});if(detect("Gecko")){EventTarget.removeEventListener._k="removeEventListener";delete EventTarget.prototype.removeEventListener}function _v(a,b,c){if(typeof b=="function"){b.call(a,c)}else{b.handleEvent(c)}};var DocumentEvent=Interface.extend({"@!(document.createEvent)":{createEvent:function(a,b){var c=a.createEventObject?a.createEventObject():{};c.bubbles=false;c.cancelable=false;c.eventPhase=0;c.target=a;c.currentTarget=null;c.relatedTarget=null;c.timeStamp=new Date().valueOf();return Event(c)}},"@(document.createEvent)":{"@!(document.createEvent('Events'))":{createEvent:function(a,b){return this.base(a,b=="Events"?"UIEvents":b)}}}});var DOMContentLoadedEvent=Base.extend({constructor:function(b){var c=false;this.fire=function(){if(!c){c=true;setTimeout(function(){var a=DocumentEvent.createEvent(b,"Events");Event.initEvent(a,"DOMContentLoaded",true,false);EventTarget.dispatchEvent(b,a)},1)}};EventTarget.addEventListener(b,"DOMContentLoaded",function(){c=true},false);this.listen(b)},listen:Undefined,"@!Gecko20([^0]|0[3-9])|Webkit[5-9]|Opera[19]|MSIE.+mac":{listen:function(a){EventTarget.addEventListener(Traversal.getDefaultView(a),"load",this.fire,false)},"@MSIE.+win":{listen:function(a){try{a.body.doScroll("left");if(!this.__constructing)this.fire()}catch(e){setTimeout(bind(this.listen,this,a),10)}}},"@KHTML":{listen:function(a){if(/loaded|complete/.test(a.readyState)){if(!this.__constructing)this.fire()}else{setTimeout(bind(this.listen,this,a),10)}}}}});Document.implement(DocumentEvent);Document.implement(EventTarget);Element.implement(EventTarget);var _1n=/^\d+(px)?$/i,_U=/(width|height|top|bottom|left|right|fontSize)$/,_V=/^(color|backgroundColor)$/,_1o="rgb(0, 0, 0)",_1p={black:1,"#000":1,"#000000":1};var ViewCSS=Interface.extend({"@!(document.defaultView.getComputedStyle)":{"@MSIE":{getComputedStyle:function(a,b,c){var d=b.currentStyle;var f={};for(var g in d){if(_U.test(g)||_V.test(g)){f[g]=this.getComputedPropertyValue(a,b,g)}else if(g.indexOf("ruby")!=0){f[g]=d[g]}}return f}}},getComputedStyle:function(a,b,c){return _W.bind(this.base(a,b,c))}},{getComputedPropertyValue:function(a,b,c){return CSSStyleDeclaration.getPropertyValue(this.getComputedStyle(a,b,null),c)},"@MSIE":{getComputedPropertyValue:function(a,b,c){c=this.toCamelCase(c);var d=b.currentStyle[c];if(_U.test(c))return _1q(b,d)+"px";if(!_j&&_V.test(c)){var f=_1r(b,c=="color"?"ForeColor":"BackColor");return(f==_1o&&!_1p[d])?d:f}return d}},toCamelCase:function(a){return a.replace(/\-([a-z])/g,flip(String2.toUpperCase))}});function _1q(a,b){if(_1n.test(b))return parseInt(b);var c=a.style.left;var d=a.runtimeStyle.left;a.runtimeStyle.left=a.currentStyle.left;a.style.left=b||0;b=a.style.pixelLeft;a.style.left=c;a.runtimeStyle.left=d;return b};function _1r(a,b){if(a.createTextRange){var c=a.createTextRange()}else{c=a.document.body.createTextRange();c.moveToElementText(a)}var d=c.queryCommandValue(b);return format("rgb(%1, %2, %3)",d&0xff,(d&0xff00)>>8,(d&0xff0000)>>16)};var _W=Binding.extend({getPropertyValue:function(a,b){return this.base(a,_X[b]||b)},"@MSIE.+win":{getPropertyValue:function(a,b){return b=="float"?a.styleFloat:a[ViewCSS.toCamelCase(b)]}}});var CSSStyleDeclaration=_W.extend({setProperty:function(a,b,c,d){return this.base(a,_X[b]||b,c,d)},"@MSIE.+win":{setProperty:function(a,b,c,d){if(b=="opacity"){c*=100;a.opacity=c;a.zoom=1;a.filter="Alpha(opacity="+c+")"}else{if(d=="important"){a.cssText+=format(";%1:%2!important;",b,c)}else{a.setAttribute(ViewCSS.toCamelCase(b),c)}}}}},{"@MSIE":{bind:function(a){a.getPropertyValue=this.prototype.getPropertyValue;a.setProperty=this.prototype.setProperty;return a}}});var _X=new Base({"@Gecko":{opacity:"-moz-opacity"},"@KHTML":{opacity:"-khtml-opacity"}});with(CSSStyleDeclaration.prototype)getPropertyValue.toString=setProperty.toString=K("[base2]");AbstractView.implement(ViewCSS);var NodeSelector=Interface.extend({"@(element.querySelector)":{querySelector:function(a,b){try{var c=this.base(a,trim(b));if(c)return c}catch(x){}return new Selector(b).exec(a,1)},querySelectorAll:function(a,b){try{var c=this.base(a,trim(b));if(c)return new StaticNodeList(c)}catch(x){}return new Selector(b).exec(a)}},"@!(element.querySelector)":{querySelector:function(a,b){return new Selector(b).exec(a,1)},querySelectorAll:function(a,b){return new Selector(b).exec(a)}}});extend(NodeSelector.prototype,{querySelector:function(a){return DOM.bind(this.base(a))},querySelectorAll:function(b){return extend(this.base(b),"item",function(a){return DOM.bind(this.base(a))})}});var DocumentSelector=NodeSelector.extend();var ElementSelector=NodeSelector.extend({"@!(element.matchesSelector)":{matchesSelector:function(a,b){return new Selector(b).test(a)}}});var _1s=/'(\\.|[^'\\])*'|"(\\.|[^"\\])*"/g,_1t=/([\s>+~,]|[^(]\+|^)([#.:\[])/g,_1u=/(^|,)([^\s>+~])/g,_1v=/\s*([\s>+~,]|^|$)\s*/g,_1w=/\s\*\s/g,_1x=/\x01(\d+)/g,_1y=/'/g;var CSSParser=RegGrp.extend({constructor:function(a){this.base(a);this.cache={};this.sorter=new RegGrp;this.sorter.add(/:not\([^)]*\)/,RegGrp.IGNORE);this.sorter.add(/([ >](\*|[\w-]+))([^: >+~]*)(:\w+-child(\([^)]+\))?)([^: >+~]*)/,"$1$3$6$4")},cache:null,ignoreCase:true,escape:function(b,c){var d=this._1z=[];b=this.optimise(this.format(String(b).replace(_1s,function(a){return"\x01"+d.push(a.slice(1,-1).replace(_1y,"\\'"))})));if(c)b=b.replace(/^ \*?/,"");return b},format:function(a){return a.replace(_1v,"$1").replace(_1u,"$1 $2").replace(_1t,"$1*$2")},optimise:function(a){return this.sorter.exec(a.replace(_1w,">* "))},parse:function(a,b){return this.cache[a]||(this.cache[a]=this.unescape(this.exec(this.escape(a,b))))},unescape:function(c){var d=this._1z;return c.replace(_1x,function(a,b){return d[b-1]})}});function _Y(a,b,c,d,f,g,h,i){d=/last/i.test(a)?d+"+1-":"";if(!isNaN(b))b="0n+"+b;else if(b=="even")b="2n";else if(b=="odd")b="2n+1";b=b.split("n");var j=b[0]?(b[0]=="-")?-1:parseInt(b[0]):1;var k=parseInt(b[1])||0;var l=j<0;if(l){j=-j;if(j==1)k++}var m=format(j==0?"%3%7"+(d+k):"(%4%3-%2)%6%1%70%5%4%3>=%2",j,k,c,d,g,h,i);if(l)m=f+"("+m+")";return m};var XPathParser=CSSParser.extend({constructor:function(){this.base(XPathParser.build());this.sorter.putAt(1,"$1$4$3$6")},escape:function(a,b){return this.base(a,b).replace(/,/g,"\x02")},unescape:function(b){return this.base(b.replace(/\[self::\*\]/g,"").replace(/(^|\x02)\//g,"$1./").replace(/\x02/g," | ")).replace(/'[^'\\]*\\'(\\.|[^'\\])*'/g,function(a){return"concat("+a.split("\\'").join("',\"'\",'")+")"})},"@opera(7|8|9\\.[1-4])":{unescape:function(a){return this.base(a.replace(/last\(\)/g,"count(preceding-sibling::*)+count(following-sibling::*)+1"))}}},{build:function(){this.values.attributes[""]="[@$1]";forEach(this.types,function(a,b){forEach(this.values[b],a,this.rules)},this);this.build=K(this.rules);return this.rules},optimised:{pseudoClasses:{"first-child":"[1]","last-child":"[last()]","only-child":"[last()=1]"}},rules:extend({},{"@!KHTML|opera":{"(^|\\x02) (\\*|[\\w-]+)#([\\w-]+)":"$1id('$3')[self::$2]"},"@!KHTML":{"([ >])(\\*|[\\w-]+):([\\w-]+-child(\\(([^)]+)\\))?)":function(a,b,c,d,f,g){var h=(b==" ")?"//*":"/*";if(/^nth/i.test(d)){h+=_w(d,g,"position()")}else{h+=XPathParser.optimised.pseudoClasses[d]}return h+"[self::"+c+"]"}}}),types:{identifiers:function(a,b){this[rescape(b)+"([\\w-]+)"]=a},combinators:function(a,b){this[rescape(b)+"(\\*|[\\w-]+)"]=a},attributes:function(a,b){this["\\[\\s*([\\w-]+)\\s*"+rescape(b)+"\\s*([^\\]\\s]*)\\s*\\]"]=a},pseudoClasses:function(a,b){this[":"+b.replace(/\(\)$/,"\\(([^)]+)\\)")]=a}},values:{identifiers:{"#":"[@id='$1'][1]",".":"[contains(concat(' ',@class,' '),' $1 ')]"},combinators:{" ":"/descendant::$1",">":"/child::$1","+":"/following-sibling::*[1][self::$1]","~":"/following-sibling::$1"},attributes:{"*=":"[contains(@$1,'$2')]","^=":"[starts-with(@$1,'$2')]","$=":"[substring(@$1,string-length(@$1)-string-length('$2')+1)='$2']","~=":"[contains(concat(' ',@$1,' '),' $2 ')]","|=":"[contains(concat('-',@$1,'-'),'-$2-')]","!=":"[not(@$1='$2')]","=":"[@$1='$2']"},pseudoClasses:{"link":"[false]","visited":"[false]","empty":"[not(child::*) and not(text())]","first-child":"[not(preceding-sibling::*)]","last-child":"[not(following-sibling::*)]","not()":_1A,"nth-child()":_w,"nth-last-child()":_w,"only-child":"[not(preceding-sibling::*) and not(following-sibling::*)]","root":"[not(parent::*)]"}},"@opera(7|8|9\\.[1-4])":{build:function(){this.optimised.pseudoClasses["last-child"]=this.values.pseudoClasses["last-child"];this.optimised.pseudoClasses["only-child"]=this.values.pseudoClasses["only-child"];return this.base()}}});var _x;function _1A(a,b){if(!_x)_x=new XPathParser;return"[not("+_x.exec(trim(b)).replace(/\[1\]/g,"").replace(/^(\*|[\w-]+)/,"[self::$1]").replace(/\]\[/g," and ").slice(1,-1)+")]"};function _w(a,b,c){return"["+_Y(a,b,c||"count(preceding-sibling::*)+1","last()","not"," and "," mod ","=")+"]"};var Selector=Base.extend({constructor:function(a){this.toString=K(trim(a))},exec:function(a,b,c){return Selector.parse(this,c)(a,b)},isSimple:function(){if(!_6.exec)_6=new CSSParser(_6);return!_1B.test(trim(_6.escape(this)))},test:function(a){if(this.isSimple()){return!!Selector.parse(this,true)(a,1)}else{a.setAttribute("b2-test",true);var b=new Selector(this+"[b2-test]").exec(Traversal.getOwnerDocument(a),1);a.removeAttribute("b2-test");return b==a}},toXPath:function(a){return Selector.toXPath(this,a)},"@(XPathResult)":{exec:function(a,b,c){if(_c.test(this)){return this.base(a,b,c)}var d=Traversal.getDocument(a);var f=b==1?9:7;var g=d.evaluate(this.toXPath(c),a,null,f,null);return b==1?g.singleNodeValue:g}},"@MSIE":{exec:function(a,b,c){if(typeof a.selectNodes!="undefined"&&!_c.test(this)){var d=single?"selectSingleNode":"selectNodes";return a[d](this.toXPath(c))}return this.base(a,b,c)}},"@(true)":{exec:function(a,b,c){try{var d=this.base(a||document,b,c)}catch(error){throw new SyntaxError(format("'%1' is not a valid CSS selector.",this));}return b==1?d:new StaticNodeList(d)}}},{toXPath:function(a,b){if(!_y)_y=new XPathParser;return _y.parse(a,b)}});var _1B=/[^,]\s|[+>~]/;var _c=":(checked|disabled|enabled|contains|hover|active|focus)|^(#[\\w-]+\\s*)?\\w+$";if(detect("KHTML")){if(detect("WebKit5")){_c+="|nth\\-|,"}else{_c="."}}_c=new RegExp(_c);Selector.operators={"=":"%1=='%2'","~=":/(^| )%1( |$)/,"|=":/^%1(-|$)/,"^=":/^%1/,"$=":/%1$/,"*=":/%1/};Selector.operators[""]="%1!=null";Selector.pseudoClasses={"checked":"e%1.checked","contains":"e%1[TEXT].indexOf('%2')!=-1","disabled":"e%1.disabled","empty":"Traversal.isEmpty(e%1)","enabled":"e%1.disabled===false","first-child":"!Traversal.getPreviousElementSibling(e%1)","last-child":"!Traversal.getNextElementSibling(e%1)","only-child":"!Traversal.getPreviousElementSibling(e%1)&&!Traversal.getNextElementSibling(e%1)","root":"e%1==Traversal.getDocument(e%1).documentElement","target":"e%1.id&&e%1.id==location.hash.slice(1)","hover":"DocumentState.getInstance(d).isHover(e%1)","active":"DocumentState.getInstance(d).isActive(e%1)","focus":"DocumentState.getInstance(d).hasFocus(e%1)","link":"false","visited":"false"};var _Z=document.documentElement.sourceIndex!==undefined,_10="var p%2=0,i%2,e%3,n%2=e%1.",_1C=_Z?"e%1.sourceIndex":"assignID(e%1)",_1D="var g="+_1C+";if(!p[g]){p[g]=1;",_1E="r[k++]=e%1;if(s==1)return e%1;if(k===s){_g.state=[%2];_g.complete=%3;return r;",_1F="var _g=function(e0,s%1){_h++;var r=[],p={},p0=0,reg=[%4],d=Traversal.getDocument(e0),c=d.writeln?'toUpperCase':'toString',k=0;";var _y;var _d,_1,_3,_4,_7,_1M,_o,_1G={},_1H={};function sum(a){var b=0;for(var c=0;c<a.length;c++){b+=a[c]}return b};var _6={"^(\\*|[\\w-]+)":function(a,b){return b=="*"?"":format("if(e0.nodeName=='%1'[c]()){",b)},"^ \\*:root":function(a){_3=false;var b="e%2=d.documentElement;if(Traversal.contains(e%1,e%2)){";return format(b,_1++,_1)}," (\\*|[\\w-]+)#([\\w-]+)":function(a,b,c){_3=false;var d="var e%2=_1I(d,'%4');if(e%2&&";if(b!="*")d+="e%2.nodeName=='%3'[c]()&&";d+="Traversal.contains(e%1,e%2)){";if(_4[_7])d+=format("i%1=n%1.length;",sum(_4));return format(d,_1++,_1,b,c)}," (\\*|[\\w-]+)":function(a,b){_o++;_3=b=="*";var c=format(_10,_1++,"%2",_1);c+=(_3&&_j)?"all":"getElementsByTagName('%3')";c+=";for(i%2=a%2||0;(e%1=n%2[i%2]);i%2++){";_4[_7]++;return format(c,_1,sum(_4),b)},">(\\*|[\\w-]+)":function(a,b){var c=_9&&_1;_3=b=="*";var d=_10+(c?"children":"childNodes");d=format(d,_1++,"%2",_1);if(!_3&&_9&&c)d+=".tags('%3')";d+=";for(i%2=a%2||0;(e%1=n%2[i%2]);i%2++){";if(_3){d+="if(e%1.nodeType==1){";_3=_j}else{if(!_9||!c)d+="if(e%1.nodeName=='%3'[c]()){"}_4[_7]++;return format(d,_1,sum(_4),b)},"\\+(\\*|[\\w-]+)":function(a,b){var c="";if(_3&&_9)c+="if(e%1.nodeName!='!'){";_3=false;c+="e%1=Traversal.getNextElementSibling(e%1);if(e%1";if(b!="*")c+="&&e%1.nodeName=='%2'[c]()";c+="){";return format(c,_1,b)},"~(\\*|[\\w-]+)":function(a,b){var c="";if(_3&&_9)c+="if(e%1.nodeName!='!'){";_3=false;_o=2;c+="while(e%1=e%1.nextSibling){if(e%1.b2_adjacent==_h)break;if(";if(b=="*"){c+="e%1.nodeType==1";if(_j)c+="&&e%1.nodeName!='!'"}else c+="e%1.nodeName=='%2'[c]()";c+="){e%1.b2_adjacent=_h;";return format(c,_1,b)},"#([\\w-]+)":function(a,b){_3=false;var c="if(e%1.id=='%2'){";if(_4[_7])c+=format("i%1=n%1.length;",sum(_4));return format(c,_1,b)},"\\.([\\w-]+)":function(a,b){_3=false;_d.push(new RegExp("(^|\\s)"+rescape(b)+"(\\s|$)"));return format("if(e%1.className&&reg[%2].test(e%1.className)){",_1,_d.length-1)},":not\\((\\*|[\\w-]+)?([^)]*)\\)":function(a,b,c){var d=(b&&b!="*")?format("if(e%1.nodeName=='%2'[c]()){",_1,b):"";d+=_6.exec(c);return"if(!"+d.slice(2,-1).replace(/\)\{if\(/g,"&&")+"){"},":nth(-last)?-child\\(([^)]+)\\)":function(a,b,c){_3=false;b=format("e%1.parentNode.b2_length",_1);var d="if(p%1!==e%1.parentNode)p%1=_1J(e%1.parentNode);";d+="var i=e%1[p%1.b2_lookup];if(p%1.b2_lookup!='b2_index')i++;if(";return format(d,_1)+_Y(a,c,"i",b,"!","&&","% ","==")+"){"},":([\\w-]+)(\\(([^)]+)\\))?":function(a,b,c,d){return"if("+format(Selector.pseudoClasses[b]||"throw",_1,d||"")+"){"},"\\[\\s*([\\w-]+)\\s*([^=]?=)?\\s*([^\\]\\s]*)\\s*\\]":function(a,b,c,d){d=trim(d);if(_9){var f="Element.getAttribute(e%1,'%2')"}else{f="e%1.getAttribute('%2')"}f=format(f,_1,b);var g=Selector.operators[c||""];if(instanceOf(g,RegExp)){_d.push(new RegExp(format(g.source,rescape(_6.unescape(d)))));g="reg[%2].test(%1)";d=_d.length-1}return"if("+format(g,f,d)+"){"}};(function(_D){var _1I=detect("MSIE[5-7]")?function(a,b){var c=a.all[b]||null;if(!c||c.id==b)return c;for(var d=0;d<c.length;d++){if(c[d].id==b)return c[d]}return null}:function(a,b){return a.getElementById(b)};var _h=1;function _1J(a){if(a.rows){a.b2_length=a.rows.length;a.b2_lookup="rowIndex"}else if(a.cells){a.b2_length=a.cells.length;a.b2_lookup="cellIndex"}else if(a.b2_indexed!=_h){var b=0;var c=a.firstChild;while(c){if(c.nodeType==1&&c.nodeName!="!"){c.b2_index=++b}c=c.nextSibling}a.b2_length=b;a.b2_lookup="b2_index"}a.b2_indexed=_h;return a};Selector.parse=function(a,b){var c=b?_1H:_1G;if(!c[a]){if(!_6.exec)_6=new CSSParser(_6);_d=[];_4=[];var d="";var f=_6.escape(a,b).split(",");for(_7=0;_7<f.length;_7++){_3=_1=_4[_7]=0;_o=f.length>1?2:0;var g=_6.exec(f[_7])||"throw;";if(_3&&_9){g+=format("if(e%1.tagName!='!'){",_1)}var h=(_o>1)?_1D:"";g+=format(h+_1E,_1,"%2");g+=Array(match(g,/\{/g).length+1).join("}");d+=g}d=_6.unescape(d);if(f.length>1)d+="r.unsorted=1;";var i="";var j=[];var k=sum(_4);for(var l=1;l<=k;l++){i+=",a"+l;j.push("i"+l+"?(i"+l+"-1):0")}if(k){var m=[],n=0;for(var l=0;l<_7;l++){n+=_4[l];if(_4[l])m.push(format("n%1&&i%1==n%1.length",n))}}d+="_g.state=[%2];_g.complete=%3;return s==1?null:r}";eval(format(_1F+d,i,j.join(","),k?m.join("&&"):true,_d));c[a]=_g}return c[a]}})();var StaticNodeList=Base.extend({constructor:function(b){b=b||[];this.length=b.length;this.item=function(a){if(a<0)a+=this.length;return b[a]};if(b.unsorted)b.sort(_1K)},length:0,forEach:function(a,b){for(var c=0;c<this.length;c++){a.call(b,this.item(c),c,this)}},item:Undefined,not:function(a,b){return this.filter(not(a),b)},slice:function(a,b){return new StaticNodeList(this.map(I).slice(a,b))},"@(XPathResult)":{constructor:function(b){if(b&&b.snapshotItem){this.length=b.snapshotLength;this.item=function(a){if(a<0)a+=this.length;return b.snapshotItem(a)}}else this.base(b)}}});StaticNodeList.implement(Enumerable);var _p=function(a,b){if(typeof a!="function"){a=bind("test",new Selector(a))}return this.base(a,b)};StaticNodeList.implement({every:_p,filter:_p,not:_p,some:_p});StaticNodeList.implement({filter:function(a,b){return new StaticNodeList(this.base(a,b))}});var _1K=_Z?function(a,b){return a.sourceIndex-b.sourceIndex}:function(a,b){return(Node.compareDocumentPosition(a,b)&2)-1};Document.implement(DocumentSelector);Element.implement(ElementSelector);var HTMLDocument=Document.extend(null,{bind:function(a){DocumentState.createState(a);return this.base(a)}});var HTMLElement=Element.extend(null,{bindings:{},tags:"*",bind:function(a){if(!a.classList){a.classList=new _11(a)}if(!a.ownerDocument){a.ownerDocument=Traversal.getOwnerDocument(a)}return this.base(a)},extend:function(){var b=base(this,arguments);forEach.csv(b.tags,function(a){HTMLElement.bindings[a]=b});return b}});HTMLElement.extend(null,{tags:"APPLET,EMBED",bind:I});var ClassList=Module.extend({add:function(a,b){if(!this.has(a,b)){a.className+=(a.className?" ":"")+b}},has:function(a,b){var c=new RegExp("(^|\\s)"+b+"(\\s|$)");return c.test(a.className)},remove:function(a,b){var c=new RegExp("(^|\\s)"+b+"(\\s|$)","g");a.className=trim(a.className.replace(c,"$2"))},toggle:function(a,b){this[this.has(a,b)?"remove":"add"](a,b)}});function _11(b){this.add=function(a){ClassList.add(b,a)};this.has=function(a){return ClassList.has(b,a)};this.remove=function(a){ClassList.remove(b,a)}};_11.prototype.toggle=function(a){this[this.has(a)?"remove":"add"](a)};var DocumentState=Base.extend({constructor:function(d){this.document=d;this.events={};this._z=d.documentElement;this.isBound=function(){return!!DOM.bind[d.base2ID]};forEach(this,function(a,b,c){if(/^on((DOM)?\w+|[a-z]+)$/.test(b)){c.registerEvent(b.slice(2))}})},includes:function(a,b){return b&&(a==b||Traversal.contains(a,b))},hasFocus:function(a){return a==this._A},isActive:function(a){return this.includes(a,this._B)},isHover:function(a){return this.includes(a,this._z)},handleEvent:function(a){return this["on"+a.type](a)},onblur:function(a){delete this._A},onmouseover:function(a){this._z=a.target},onmouseout:function(a){delete this._z},onmousedown:function(a){this._B=a.target},onfocus:function(a){this._A=a.target},onmouseup:function(a){delete this._B},registerEvent:function(a){this.document.addEventListener(a,this,true);this.events[a]=true},"@(document.activeElement===undefined)":{constructor:function(a){this.base(a);if(this.isBound()){a.activeElement=a.body}},onfocus:function(a){this.base(a);if(this.isBound()){this.document.activeElement=this._A}},onblur:function(a){this.base(a);if(this.isBound()){this.document.activeElement=this.document.body}}},"@!(element.addEventListener)":{constructor:function(b){this.base(b);var c=new EventDispatcher(this);this._q=function(a){a.target=a.target||a.srcElement||b;c.handleEvent(a)};this.handleEvent=function(a){if(this["on"+a.type]){this["on"+a.type](a)}return c.handleEvent(a)}},registerEvent:function(b,c){var d=this.events[b];var f=_T.test(b);if(!d||!f){if(!d)d=this.events[b]={};if(f||!c)c=this.document;var g=this;c["on"+b]=function(a){if(!a){a=Traversal.getDefaultView(this).event}if(a)g.handleEvent(a)}}return d},"@MSIE.+win":{constructor:function(c){this.base(c);var d={};this._12=function(a){var b=assignID(a);if(!d[b]){d[b]=true;a.attachEvent("onsubmit",this._q);a.attachEvent("onreset",this._q)}}},fireEvent:function(a,b){b=copy(b);b.type=a;this.handleEvent(b)},registerEvent:function(b,c){var d=this.events[b];var f=_T.test(b);if(!d||!f){if(!d)d=this.events[b]={};if(f||!c)c=this.document;var g=this;c.attachEvent("on"+b,function(a){a.target=a.srcElement||g.document;g.handleEvent(a);if(g["after"+b]){g["after"+b](a)}})}return d},onDOMContentLoaded:function(a){forEach(a.target.forms,this._12,this);this.setFocus(this.document.activeElement)},onmousedown:function(a){this.base(a);this._u=a.button},onmouseup:function(a){this.base(a);if(this._u==null){this.fireEvent("mousedown",a)}delete this._u},aftermouseup:function(){if(this._C){this._q(this._C);delete this._C}},onfocusin:function(a){this.setFocus(a.target);this.onfocus(a)},setFocus:function(b){var c=this.events.change,d=this.events.select;if(c||d){var f=this._q;if(c)b.attachEvent("onchange",f);if(d){var g=this;var h=function(a){if(g._B==b){g._C=copy(a)}else{f(a)}};b.attachEvent("onselect",h)}b.attachEvent("onblur",function(){b.detachEvent("onblur",arguments.callee);if(c)b.detachEvent("onchange",f);if(d)b.detachEvent("onselect",h)})}},onfocusout:function(a){this.onblur(a)},onclick:function(a){var b=a.target;if(b.form)this._12(b.form)},ondblclick:function(a){this.fireEvent("click",a)}}}},{init:function(){assignID(document);DocumentState=this;this.createState(document);new DOMContentLoadedEvent(document)},createState:function(a){var b=a.base2ID;if(!this[b]){this[b]=new this(a)}return this[b]},getInstance:function(a){return this[Traversal.getDocument(a).base2ID]}});eval(this.exports)};
base2.DOM.bind(document);
// base2 querySelector alternative : http://polyfilljs.com/js/mylibs/querySelector.js

/* http://webbugtrack.blogspot.fr/2007/08/bug-152-getelementbyid-returns.html */
//use browser sniffing to determine if IE or Opera (ugly, but required)
var isOpera = !!window.opera, isIE = false;
if(!isOpera && navigator.userAgent.indexOf('Internet Explorer')){isIE = true;}

//fix both IE and Opera (adjust when they implement this method properly)
if(isOpera || isIE){
  document.nativeGetElementById = document.getElementById;
  //redefine it!
  document.getElementById = function(id){
    var elem = document.nativeGetElementById(id);
    if(elem){
      //verify it is a valid match!
      if(elem.id == id){
        //valid match!
        return elem;
      } else {
        //not a valid match!
        //the non-standard, document.all array has keys for all name'd, and id'd elements
        //start at one, because we know the first match, is wrong!
        for(var i=1;i<document.all[id].length;i++){
          if(document.all[id][i].id == id){
            return document.all[id][i];
          }
        }
      }
    }
    return null;
  };
}


/* https://github.com/inexorabletash/polyfill */
(function(){
  
  //
  // XMLHttpRequest (http://www.w3.org/TR/XMLHttpRequest/)
  //
  window.XMLHttpRequest = window.XMLHttpRequest || function () {
    /*global ActiveXObject*/
    try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) { }
    try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) { }
    try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) { }
    throw new Error("This browser does not support XMLHttpRequest.");
  };
  XMLHttpRequest.UNSENT = 0;
  XMLHttpRequest.OPENED = 1;
  XMLHttpRequest.HEADERS_RECEIVED = 2;
  XMLHttpRequest.LOADING = 3;
  XMLHttpRequest.DONE = 4;
  
  //----------------------------------------------------------------------
  //
  // DOM
  //
  //----------------------------------------------------------------------



	/* http://polyfilljs.com/js/mylibs/getelementsbyclassname.js*/
  if (!document.getElementsByClassName) {
    document.getElementsByClassName = function (classes) {
      return document.querySelectorAll('.' + classes.replace(/ /g,' .'));
    };
  }
})();

(function(global){if(!String.prototype.contains) String.prototype.contains=function(str){return this.indexOf(str)!==-1};
if(!String.prototype.startsWith) String.prototype.startsWith=function(str,pos){return this.indexOf(str,pos)===0};
if(!String.prototype.endsWith) String.prototype.endsWith=function(str,pos){ var d=this.length-str.length; return d >= 0 && this.indexOf(str,d)===d; };

if (!String.prototype.trimLeft || !String.prototype.trimRight){
	var ws = "[" + "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
	"\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
	"\u2029\uFEFF"+ "]";
	var trimBeginRegexp = new RegExp("^" + ws + ws + "*"), trimEndRegexp = new RegExp(ws + ws + "*$");
	String.prototype.trimLeft = function(){ return String(this).replace(trimBeginRegexp, ""); };
	String.prototype.trimRight = function(){ return String(this).replace(trimEndRegexp, ""); };
}

if(!String.prototype.repeat) String.prototype.repeat=function(count){
	//return new Array(count + 1).join(this)
	if(count < 1) return '';
	/* Growing pattern : http://jsfiddle.net/disfated/GejWV/ */
	var result = '',pattern=this.valueOf();
	while(count > 0){
		if (count & 1) result += pattern;
		count >>= 1, pattern += pattern;
	}
	return result;
};

/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String */
// Assumes all supplied String instance methods already present (one may use shims for these if not available)
(function () {
    'use strict';

    var i,
        // We could also build the array of methods with the following, but the
        //   getOwnPropertyNames() method is non-shimable:
        // Object.getOwnPropertyNames(String).filter(function (methodName) {return typeof String[methodName] === 'function'});
        methods = [
            /*'quote', */'substring', 'toLowerCase', 'toUpperCase', 'charAt',
            'charCodeAt', 'indexOf', 'lastIndexOf', 'startsWith', 'endsWith',
            'trim', 'trimLeft', 'trimRight', 'toLocaleLowerCase',
            'toLocaleUpperCase', 'localeCompare', 'match', 'search',
            'replace', 'split', 'substr', 'concat', 'slice', 'fromCharCode'
        ],
        methodCount = methods.length,
        assignStringGeneric = function (methodName) {
            var method = String.prototype[methodName];

            String[methodName] = function (arg1) {
            	
                return method.apply(arg1, Array.prototype.slice.call(arguments, 1));
            };
        };

    for (i = 0; i < methodCount; i++) {
        assignStringGeneric(methods[i]);
    }
}());
/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Array_generic_methods */
if(!Array.forEach)
	(function () {
		'use strict';
	
		var i,
			// We could also build the array of methods with the following, but the
			//   getOwnPropertyNames() method is non-shimable:
			// Object.getOwnPropertyNames(Array).filter(function (methodName) {return typeof Array[methodName] === 'function'});
			methods = [
				'join', 'reverse', 'sort', 'push', 'pop', 'shift', 'unshift',
				'splice', 'concat', 'slice', 'indexOf', 'lastIndexOf',
				'forEach', 'map', 'reduce', 'reduceRight', 'filter',
				'some', 'every'
			],
			methodCount = methods.length,
			assignArrayGeneric = function (methodName) {
				var method = Array.prototype[methodName];
				Array[methodName] = function (arg1) {
					return method.apply(arg1, UArray.slice1(arguments));
				};
			};
	
		for (i = 0; i < methodCount; i++) {
			assignArrayGeneric(methods[i]);
		}
	}());
/* https://github.com/WebReflection/es6-collections */
/* https://raw.github.com/eriwen/es6-map-shim/master/es6-map-shim.js */


/* chrome pre-implementation is lacking of the iterator method. Must be activated in prefs (like node --harmony) so most users won't have any implementation '*/
if(global.Map && (!global.Map.prototype.iterator || !global.Map.prototype.clear)) global.Map=null;


global.Map = global.Map || (function(){
	
	
	var Map=function(iterator){
		this.items = {}; this.size = 0;
		if(iterator) iterator.forEach(function(kv){
			this.items[kv[0]] = kv[1];
		}.bind(this));
	};
	Object.defineProperties(Map.prototype,{
		set:{ value:function(k,v){
			if(!this.items.hasOwnProperty(k))
				this.size++;
			this.items[k]=v;
		} },
		get:{ value:function(k){
			return this.items[k];
		} },
		has:{ value:function(k){
			return this.items.hasOwnProperty(k);
		} },
		'delete':{ value:function(k){
			if(this.items.hasOwnProperty(k)){
				this.size--;
				delete this.items[k];
			}
		} },
		clear:{ value:function(){
			this.size = 0;
			this.items = {};
		} },
		iterator:{ value:function(){
			return UObj.iterator(this.items);
		} },
		/*
		forEach:{ value:function(callback){
			UObj.forEach(this.items,callback,this);
		} },*/
		toString:{ value: function() {
			return '[Object Map]';
		} }
	});
	return Map;
})();
/* firefox implementation is lacking of the forEach method*/
if(!Map.prototype.forEach)
	/**
	 * Given a callback function and optional context, invoke the callback on all
	 * entries in this Map.
	 *
	 * @param callbackFn {Function}
	 */
	Map.prototype.forEach=function(callbackfn){
		console.log('Map.prototype.forEach');
		/*var iter = this.iterator();
		while(true){
			var current;
			try{ current=iter.next(); }catch(err){ return; }
			callbackfn.call(this,current[0],current[1]);
		}*/
		var it=S.iterator(this);
		while(it.hasNext()){
			var next = it.next();
			callbackfn.call(this,next[1],next[0]);
		}
	};

/* chrome pre-implementation is lacking of the iterator method. Must be activated in prefs (like node --harmony) so most users won't have any implementation '*/
if(global.Set && (!global.Set.prototype.iterator || !global.Set.prototype.clear)) global.Set=null;

global.Set = global.Set || (function(){
	
	
	var Set=function(iterator){
		this.items = []; this.size = 0;
		if(iterator) iterator.forEach(function(v){
			this.items.push(v);
		}.bind(this));
	};
	Object.defineProperties(Set.prototype,{
		add:{ value:function(v){
			if(!this.has(v)){
				this.size++;
				this.items.push(v);
			}
		} },
		has:{ value:function(v){
			return UArray.has(this.items,v);
		} },
		'delete':{ value:function(v){
			var i=this.items.indexOf(v);
			if(i!==-1){
				this.size--;
				this.items = this.items.slice(i,1);
			}
		} },
		clear:{ value:function(){
			this.size = 0;
			this.items = [];
		} },
		iterator:{ value:function(){
			var it = UArray.iterator(this.items);
			return Object.freeze({
				hasNext:it.hasNext.bind(it),
				next:function(){
					return this.items[it.next()];
				}.bind(this)
			});
		} },
		forEach:{ value:function(callback){
			this.items.forEach.call(this.items,callback,this);
		} },
		toString:{ value: function() {
			return '[Object Set]';
		} }
	});
	return Set;
})();
/* firefox implementation is lacking of the forEach method*/
if(!Set.prototype.forEach)
	/**
	 * Given a callback function and optional context, invoke the callback on all
	 * entries in this Map.
	 *
	 * @param callbackFn {Function}
	 */
	Map.prototype.forEach=function(callbackfn){
		var it=S.iterator(this);
		while(it.hasNext())
			callbackfn.apply(this,it.next());
	};

/* loaded by :
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 *  => Firefox < 11, Chrome < 15, IE, Opera < 11.6, Safari
 * 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Array_generic_methods
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/contains
 *  => Almost all except Firefox > 19
 * 
 * -
 * http://kangax.github.com/es5-compat-table/es6/
 */

// document.head (HTML5)
if(!document.head) document.head = document.getElementsByTagName('head')[0];
// Iterators
window.StopIteration=window.StopIteration || {};

/*/new Event (ie10)
try{
	var e=new Event('__es6Event__');
}catch(err){
	window.Event=function(name){
		var event = document.createEvent('Event');
		event.initEvent(name, true, true);
		return event;
	}
}*/

/* DOM-shim : https://github.com/Raynos/DOM-shim/tree/master/src/all/interfaces */

var shim=function(name,shim){
	var constructor = window[name];
	if (!constructor)
		constructor = window[name] = shim.interface;
	delete shim.interface;
	var proto = constructor && constructor.prototype;
	if (shim.prototype) {
		proto = constructor.prototype = shim.prototype;
		delete shim.prototype;
	}
	
	console&&console.log("adding interface ", name);
	
	if (shim.hasOwnProperty("constructor")) {
		window[name] = constructor = shim.constructor;
		proto && (shim.constructor.prototype = proto);
		delete shim.constructor;
	}
};

shim('Event',{
	constructor: function(type, dict){
		var e = document.createEvent("Event");
		dict = dict || {};
		dict.bubbles = dict.bubbles || false;
		dict.catchable = dict.catchable || false;
		e.initEvent(type, dict.bubbles, dict.catchable);
		return e;
	}
});

shim('EventTarget',{
	interface: window.Node || window.Element
});

shim('CustomEvent',{
	interface: window.Event,
	constructor: function(type, dict){
		var e = document.createEvent("CustomEvent");
		dict = dict || {};
		dict.detail = dict.detail || null;
		dict.bubbles = dict.bubbles || false;
		dict.catchable = dict.catchable || false;
		if (e.initCustomEvent) {
			e.initCustomEvent(type, dict.bubbles, dict.catchable, dict.detail);
		} else {
			e.initEvent(type, dict.bubbles, dict.catchable);
			e.detail = dict.detail;
		}
		return e;
	}
});



})(window);
