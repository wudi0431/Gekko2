// api for v8
var LizardGetModels, LizardRender, LizardUrlMapping;

var Lizard = Lizard||{};

;(function (){
  Lizard.runAt = "server";
  Lizard.renderAt = "server";

  /***** configuration start *****/
  
  // underscore for v8
  ;var _=function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,v=e.reduce,h=e.reduceRight,d=e.filter,m=e.every,g=e.some,y=e.indexOf,_=e.lastIndexOf,b=Array.isArray,x=Object.keys,j=i.bind,w=function(n){return n instanceof w?n:this instanceof w?void(this._wrapped=n):new w(n)
  };"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=w),exports._=w):n._=w,w.VERSION="1.4.4";var A=w.each=w.forEach=function(n,t,e){if(null!=n)if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return
  }else for(var a in n)if(w.has(n,a)&&t.call(e,n[a],a,n)===r)return};w.map=w.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e[e.length]=t.call(r,n,u,i)}),e)};var O="Reduce of empty array with no initial value";w.reduce=w.foldl=w.inject=function(n,t,r,e){var u=arguments.length>2;
  if(null==n&&(n=[]),v&&n.reduce===v)return e&&(t=w.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(O);return r},w.reduceRight=w.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduceRight===h)return e&&(t=w.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);
  var i=n.length;if(i!==+i){var a=w.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(O);return r},w.find=w.detect=function(n,t,r){var e;return E(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},w.filter=w.select=function(n,t,r){var e=[];
  return null==n?e:d&&n.filter===d?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&(e[e.length]=n)}),e)},w.reject=function(n,t,r){return w.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},w.every=w.all=function(n,t,e){t||(t=w.identity);var u=!0;return null==n?u:m&&n.every===m?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r
  }),!!u)};var E=w.some=w.any=function(n,t,e){t||(t=w.identity);var u=!1;return null==n?u:g&&n.some===g?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};w.contains=w.include=function(n,t){return null==n?!1:y&&n.indexOf===y?-1!=n.indexOf(t):E(n,function(n){return n===t})},w.invoke=function(n,t){var r=o.call(arguments,2),e=w.isFunction(t);
  return w.map(n,function(n){return(e?t:n[t]).apply(n,r)})},w.pluck=function(n,t){return w.map(n,function(n){return n[t]})},w.where=function(n,t,r){return w.isEmpty(t)?r?null:[]:w[r?"find":"filter"](n,function(n){for(var r in t)if(t[r]!==n[r])return!1;return!0})},w.findWhere=function(n,t){return w.where(n,t,!0)
  },w.max=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.max.apply(Math,n);if(!t&&w.isEmpty(n))return-1/0;var e={computed:-1/0,value:-1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a>=e.computed&&(e={value:n,computed:a})}),e.value},w.min=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.min.apply(Math,n);
  if(!t&&w.isEmpty(n))return 1/0;var e={computed:1/0,value:1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a<e.computed&&(e={value:n,computed:a})}),e.value},w.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=w.random(r++),e[r-1]=e[t],e[t]=n}),e};var k=function(n){return w.isFunction(n)?n:function(t){return t[n]
  }};w.sortBy=function(n,t,r){var e=k(t);return w.pluck(w.map(n,function(n,t,u){return{value:n,index:t,criteria:e.call(r,n,t,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||void 0===r)return 1;if(e>r||void 0===e)return-1}return n.index<t.index?-1:1}),"value")};var F=function(n,t,r,e){var u={},i=k(t||w.identity);
  return A(n,function(t,a){var o=i.call(r,t,a,n);e(u,o,t)}),u};w.groupBy=function(n,t,r){return F(n,t,r,function(n,t,r){(w.has(n,t)?n[t]:n[t]=[]).push(r)})},w.countBy=function(n,t,r){return F(n,t,r,function(n,t){w.has(n,t)||(n[t]=0),n[t]++})},w.sortedIndex=function(n,t,r,e){r=null==r?w.identity:k(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;
  r.call(e,n[o])<u?i=o+1:a=o}return i},w.toArray=function(n){return n?w.isArray(n)?o.call(n):n.length===+n.length?w.map(n,w.identity):w.values(n):[]},w.size=function(n){return null==n?0:n.length===+n.length?n.length:w.keys(n).length},w.first=w.head=w.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:o.call(n,0,t)
  },w.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},w.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},w.rest=w.tail=w.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},w.compact=function(n){return w.filter(n,w.identity)};
  var R=function(n,t,r){return A(n,function(n){w.isArray(n)?t?a.apply(r,n):R(n,t,r):r.push(n)}),r};w.flatten=function(n,t){return R(n,t,[])},w.without=function(n){return w.difference(n,o.call(arguments,1))},w.uniq=w.unique=function(n,t,r,e){w.isFunction(t)&&(e=r,r=t,t=!1);var u=r?w.map(n,r,e):n,i=[],a=[];
  return A(u,function(r,e){(t?e&&a[a.length-1]===r:w.contains(a,r))||(a.push(r),i.push(n[e]))}),i},w.union=function(){return w.uniq(c.apply(e,arguments))},w.intersection=function(n){var t=o.call(arguments,1);return w.filter(w.uniq(n),function(n){return w.every(t,function(t){return w.indexOf(t,n)>=0})})
  },w.difference=function(n){var t=c.apply(e,o.call(arguments,1));return w.filter(n,function(n){return!w.contains(t,n)})},w.zip=function(){for(var n=o.call(arguments),t=w.max(w.pluck(n,"length")),r=new Array(t),e=0;t>e;e++)r[e]=w.pluck(n,""+e);return r},w.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];
  return r},w.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=w.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},w.lastIndexOf=function(n,t,r){if(null==n)return-1;
  var e=null!=r;if(_&&n.lastIndexOf===_)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},w.range=function(n,t,r){arguments.length<=1&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=new Array(e);e>u;)i[u++]=n,n+=r;return i
  },w.bind=function(n,t){if(n.bind===j&&j)return j.apply(n,o.call(arguments,1));var r=o.call(arguments,2);return function(){return n.apply(t,r.concat(o.call(arguments)))}},w.partial=function(n){var t=o.call(arguments,1);return function(){return n.apply(this,t.concat(o.call(arguments)))}},w.bindAll=function(n){var t=o.call(arguments,1);
  return 0===t.length&&(t=w.functions(n)),A(t,function(t){n[t]=w.bind(n[t],n)}),n},w.memoize=function(n,t){var r={};return t||(t=w.identity),function(){var e=t.apply(this,arguments);return w.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},w.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)
  },t)},w.defer=function(n){return w.delay.apply(w,[n,1].concat(o.call(arguments,1)))},w.throttle=function(n,t){var r,e,u,i,a=0,o=function(){a=new Date,u=null,i=n.apply(r,e)};return function(){var c=new Date,l=t-(c-a);return r=this,e=arguments,0>=l?(clearTimeout(u),u=null,a=c,i=n.apply(r,e)):u||(u=setTimeout(o,l)),i
  }},w.debounce=function(n,t,r){var e,u;return function(){var i=this,a=arguments,o=function(){e=null,r||(u=n.apply(i,a))},c=r&&!e;return clearTimeout(e),e=setTimeout(o,t),c&&(u=n.apply(i,a)),u}},w.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},w.wrap=function(n,t){return function(){var r=[n];
  return a.apply(r,arguments),t.apply(this,r)}},w.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},w.after=function(n,t){return 0>=n?t():function(){return--n<1?t.apply(this,arguments):void 0}},w.keys=x||function(n){if(n!==Object(n))throw new TypeError("Invalid object");
  var t=[];for(var r in n)w.has(n,r)&&(t[t.length]=r);return t},w.values=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push(n[r]);return t},w.pairs=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push([r,n[r]]);return t},w.invert=function(n){var t={};for(var r in n)w.has(n,r)&&(t[n[r]]=r);return t
  },w.functions=w.methods=function(n){var t=[];for(var r in n)w.isFunction(n[r])&&t.push(r);return t.sort()},w.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},w.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])
  }),t},w.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)w.contains(r,u)||(t[u]=n[u]);return t},w.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)null==n[r]&&(n[r]=t[r])}),n},w.clone=function(n){return w.isObject(n)?w.isArray(n)?n.slice():w.extend({},n):n
  },w.tap=function(n,t){return t(n),n};var S=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof w&&(n=n._wrapped),t instanceof w&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==String(t);case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;
  case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;r.push(n),e.push(t);var a=0,o=!0;
  if("[object Array]"==u){if(a=n.length,o=a==t.length)for(;a--&&(o=S(n[a],t[a],r,e)););}else{var c=n.constructor,f=t.constructor;if(c!==f&&!(w.isFunction(c)&&c instanceof c&&w.isFunction(f)&&f instanceof f))return!1;for(var s in n)if(w.has(n,s)&&(a++,!(o=w.has(t,s)&&S(n[s],t[s],r,e))))break;if(o){for(s in t)if(w.has(t,s)&&!a--)break;
  o=!a}}return r.pop(),e.pop(),o};w.isEqual=function(n,t){return S(n,t,[],[])},w.isEmpty=function(n){if(null==n)return!0;if(w.isArray(n)||w.isString(n))return 0===n.length;for(var t in n)if(w.has(n,t))return!1;return!0},w.isElement=function(n){return!(!n||1!==n.nodeType)},w.isArray=b||function(n){return"[object Array]"==l.call(n)
  },w.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){w["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),w.isArguments(arguments)||(w.isArguments=function(n){return!(!n||!w.has(n,"callee"))}),"function"!=typeof/./&&(w.isFunction=function(n){return"function"==typeof n
  }),w.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},w.isNaN=function(n){return w.isNumber(n)&&n!=+n},w.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},w.isNull=function(n){return null===n},w.isUndefined=function(n){return void 0===n},w.has=function(n,t){return f.call(n,t)
  },w.noConflict=function(){return n._=t,this},w.identity=function(n){return n},w.times=function(n,t,r){for(var e=Array(n),u=0;n>u;u++)e[u]=t.call(r,u);return e},w.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))};var I={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};
  I.unescape=w.invert(I.escape);var M={escape:new RegExp("["+w.keys(I.escape).join("")+"]","g"),unescape:new RegExp("("+w.keys(I.unescape).join("|")+")","g")};w.each(["escape","unescape"],function(n){w[n]=function(t){return null==t?"":(""+t).replace(M[n],function(t){return I[n][t]})}}),w.result=function(n,t){if(null==n)return null;
  var r=n[t];return w.isFunction(r)?r.call(n):r},w.mixin=function(n){A(w.functions(n),function(t){var r=w[t]=n[t];w.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),D.call(this,r.apply(w,n))}})};var N=0;w.uniqueId=function(n){var t=++N+"";return n?n+t:t},w.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};
  var T=/(.)^/,q={"'":"'","\\":"\\","\r":"r","\n":"n","\t":"t","\u2028":"u2028","\u2029":"u2029"},B=/\\|'|\r|\n|\t|\u2028|\u2029/g;w.template=function(n,t,r){var e;r=w.defaults({},r,w.templateSettings);var u=new RegExp([(r.escape||T).source,(r.interpolate||T).source,(r.evaluate||T).source].join("|")+"|$","g"),i=0,a="__p+='";
  n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(B,function(n){return"\\"+q[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(__sandbox||{}){with(obj||{}){\n"+a+"}}\n"),a="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";
  try{e=new Function(r.variable||"obj","_","__sandbox",a)}catch(o){throw o.source=a,o}if(t){var c="";return c=vm&&vm.eval?vm.eval("(function(){"+a+"})()",{obj:t,_:w,__sandbox:__sandbox})||"":e(t,w,__sandbox)||""}var l=function(n,t){var r="";return r=vm&&vm.eval?vm.eval("(function(){"+a+"})()",{obj:n,_:w,__sandbox:t})||"":e(n,w,t)||""
  };return l.source="function("+(r.variable||"obj")+"){\n"+a+"}",l},w.chain=function(n){return w(n).chain()};var D=function(n){return this._chain?w(n).chain():n};return w.mixin(w),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];w.prototype[n]=function(){var r=this._wrapped;
  return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],D.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];w.prototype[n]=function(){return D.call(this,t.apply(this._wrapped,arguments))}}),w.extend(w.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped
  }}),w}();

  // htmlparser for v8
  /**
   * Ctrip JavaScript Code
   * http://www.ctrip.com/
   * Copyright(C) 2008 - 2014, Ctrip All rights reserved.
   * Version: 140515
   * Date: 2014-05-15
   */
  function htmlNode(parser,parent,tagName,plainText,plainComment){
    this.parser=parser;
    if (tagName){
      this._tagName=tagName;
      this._attrs={};
      this._children=[];
    }
    if (plainText){
      this._plainText=plainText;
    }
    if (plainComment){
      this._plainComment=plainComment;
    }
    if (tagName||plainComment){
      this._htmlStart=-1;
      this._htmlEnd=-1;
      this._ohtmlStart=-1;
      this._ohtmlEnd=-1;
    }
    this._parent=parent;
    if (parent){
      parent._children.push(this);
    }
  }
  htmlNode.prototype.children=function(){
    return this._children||null;
  };
  htmlNode.prototype.parent=function(){
    return this._parent||null;
  };
  htmlNode.prototype.tagName=function(){
    return this._tagName||null;
  };
  htmlNode.prototype.find=function(tagName,attrs){
    tagName=(tagName||'*').toLowerCase();
    if (this._type(attrs)!='object'){
      attrs={};
    }
    var ret=null;
    if (this._tagName){
      for (var i=0;i<this._children.length;i++){
        if (this._children[i]._tagName){
          if (tagName=='*'||this._children[i]._tagName==tagName){
            if (this._compareAttr(this._children[i]._attrs,attrs)){
              ret=this._children[i];
              break;
            }
          }
          ret=this._children[i].find(tagName,attrs);
          if (ret){
            break;
          }
        }
      }
    }
    return ret;
  };
  htmlNode.prototype.findAll=function(tagName,attrs){
    tagName=(tagName||'*').toLowerCase();
    if (this._type(attrs)!='object'){
      attrs={};
    }
    var ret=[];
    if (this._tagName){
      for (var i=0;i<this._children.length;i++){
        if (this._children[i]._tagName){
          if (tagName=='*'||this._children[i]._tagName==tagName){
            if (this._compareAttr(this._children[i]._attrs,attrs)){
              ret.push(this._children[i]);
            }
          }
          ret=ret.concat(this._children[i].findAll(tagName,attrs));
        }
      }
    }
    return ret;
  };
  htmlNode.prototype.comment=function(){
    var ret=[];
    if (this._tagName){
      for (var i=0;i<this._children.length;i++){
        if (this._children[i]._plainComment){
          ret.push(this._children[i]);
        }
        if (this._children[i]._tagName){
          ret=ret.concat(this._children[i].comment());
        }
      }
    }
    return ret;
  };
  htmlNode.prototype._compareAttr=function(nodeAttrs,attrs){
    for (var key in attrs){
      if (attrs.hasOwnProperty(key)){
        if (nodeAttrs.hasOwnProperty(key)){
          switch (this._type(attrs[key])){
            case 'string':
              if (attrs[key]!=nodeAttrs[key]){
                return false;
              }
              break;
            case 'regexp':
              if (nodeAttrs[key].test(atts[key])){
                return false;
              }
              break;
          }
        }else{
          return false;
        }
      }
    }
    return true;
  };
  htmlNode.prototype._type=function(obj){
    if(typeof obj=="undefined")return "undefined";
    if(obj===null)return "object";
    var arr=Object.prototype.toString.call(obj).match(/^\[object (.+)\]$/);
    return arr?arr[1].toLowerCase():'';
  };
  htmlNode.prototype.html=function(){
    var ret='';
    if (this._htmlStart!=-1){
      ret=this.parser._html.substring(this._htmlStart,this._htmlEnd+1);
    }
    return ret;
  };
  htmlNode.prototype.ohtml=function(){
    var ret='';
    if (this._ohtmlStart!=-1){
      ret=this.parser._html.substring(this._ohtmlStart,this._ohtmlEnd+1);
    }
    return ret;
  };
  htmlNode.prototype.text=function(){
    var ret=[];
    if (this._plainText){
      ret.push(this._plainText);
    }else if (this._tagName){
      for (var i=0;i<this._children.length;i++){
        ret.push(this._children[i].text());
      }
    }
    return ret.join(' ');
  };
  htmlNode.prototype.attr=function(attrKey,attrValue){
    if (this._type(attrValue)=='undefined'){
      var ret=null;
      if (this._attrs&&this._attrs.hasOwnProperty(attrKey)){
        ret=this._attrs[attrKey];
      }
      return ret;
    }else{
      this._attrs[attrKey]=attrValue;
      return this;
    }
  };
  htmlNode.prototype.remove=function(){
    if (this==this.parser.root){
      for (var i=node._children.length;i>=0;i--){
        node._children[i].remove();
      }
      return;
    }
    if (this._ohtmlStart==-1||this._ohtmlEnd==-1){
      return;
    }
    // calc position
    var p1=this._ohtmlStart,p2=this._ohtmlEnd+1;
    var start=this._ohtmlEnd;
    var len=this._ohtmlStart-this._ohtmlEnd-1;
    // remove node
    var children=this._parent._children;
    for (var i=0;i<children.length;i++){
      if (children[i]==this){
        children.splice(i,1);
        break;
      }
    }
    this._parent=null;
    // fix this node postion
    this.parser.root._fixPosition(start,len);
    this._fixPosition(0,-start);
    // fix html
    this.parser._html=this.parser._html.slice(0,p1)+this.parser._html.slice(p2);
    // add flag
    this._remove=true;
    return this.parser.root;
  };
  htmlNode.prototype._fixPosition=function(start,len){
    var arr=['_htmlStart','_htmlEnd','_ohtmlStart','_ohtmlEnd'];
    for (var i=0;i<arr.length;i++){
      if (this[arr[i]]>=start){
        this[arr[i]]+=len;
      }
    }
    if (this._tagName){
      for (var i=0;i<this._children.length;i++){
        this._children[i]._fixPosition(start,len);
      }
    }
  };


  function htmlParse(html){
    this._html='';
    this._parse(html);
  };
  htmlParse.prototype._autoCloseTag=(function(){
    var tagArr='!DOCTYPE,input,br,hr,area,base,img,meta,link'.split(',');
    var tagHash={};
    for (var i=0;i<tagArr.length;i++){
      tagHash[tagArr[i]]=1;
    }
    return tagHash;
  })();
  htmlParse.prototype._ignoreTag=(function(){
    var tagArr='script,textarea,pre'.split(',');
    var tagHash={};
    for (var i=0;i<tagArr.length;i++){
      tagHash[tagArr[i]]=1;
    }
    return tagHash;
  })();
  htmlParse.prototype._parse=function(html){
    if (htmlNode.prototype._type(html)=='string'){
      this._html=html||'';
    }
    var commentStart='<!--',commentEnd='-->';
    var commentStartChar=commentStart.substr(0,1);
    var commentEndChar=commentEnd.substr(0,1);
    var codeArr=this._html.split("");
    var curNode=this.root=new htmlNode(this,null,'root',null,null);
    curNode._htmlStart=curNode._ohtmlStart=0;
    curNode._htmlEnd=curNode._ohtmlEnd=this._html.length-1;
    var s='text',isIgnore=false,isClose,tagName,start,attrKey,attrValue,plainText='',plainComment='',isQuote='',isError=false;
    for (var i=0;i<codeArr.length;i++){
      var t=codeArr[i],pt=codeArr[i-1],nt=codeArr[i+1];
      var isLast=i==codeArr.length-1;
      switch (s){
        case 'text':
          if (!isIgnore&&t==commentStartChar&&codeArr.slice(i,i+commentStart.length).join('')==commentStart){
            start=i;
            plainComment=commentStart;
            s='comment';
            i+=commentStart.length-1;
          }else if (isLast||!isIgnore&&t=='<'&&nt&&!/^\s$/.test(nt)
            ||isIgnore&&t=='<'&&codeArr.slice(i,i+tagName.length+2).join('')=='</'+tagName&&/^[>\/\s]$/.test(codeArr[i+tagName.length+2])){
              if (this._trim(plainText)){
                new htmlNode(this,curNode,null,plainText,null);
              }
              tagName='';
              start=i;
              s='tagName';
              isIgnore=false;
              if (nt=='/'){
                isClose=true;
                i++;
              }else{
                isClose=false;
              }
          }else{
            plainText+=t;
          }
          break;
        case 'comment':
          if (isLast||t==commentEndChar&&codeArr.slice(i,i+commentEnd.length).join('')==commentEnd){
            s='text';
            var node=new htmlNode(this,curNode,null,null,plainComment+commentEnd);
            node._ohtmlStart=start;
            node._htmlStart=start+commentStart.length;
            node._htmlEnd=i-1;
            i+=commentEnd.length-1;
            node._ohtmlEnd=i;
          }else{
            plainComment+=t;
          }
          break;
        case 'tagName':
          if (/^[>\/\s]$/.test(t)){
            if (!isClose){
              curNode=new htmlNode(this,curNode,tagName,null,null);
              isIgnore=this._ignoreTag.hasOwnProperty(tagName);
              curNode._ohtmlStart=start;
            }
            attrKey='';
            attrValue='';
            s='attrKey';
            if (t=='>'){
              i--;
            }
          }else{
            tagName+=t.toLowerCase();
          }
          break;
        case 'attrKey':
          if (t=='>'){
            if (isClose){
              var t=curNode;
              var wfcArr=[];
              while (t){
                if (t._tagName==tagName){
                  for (var j=0;j<wfcArr.length;j++){
                    wfcArr[j]._htmlEnd=wfcArr[j]._ohtmlEnd=start-1;
                  }
                  t._htmlEnd=start-1;
                  t._ohtmlEnd=i;
                  curNode=t._parent;
                  break;
                }else{
                  wfcArr.push(t);
                }
                t=t._parent;
              }
            }else{
              if (this._autoCloseTag.hasOwnProperty(tagName)){
                curNode._ohtmlEnd=i;
                curNode=curNode._parent;
              }else{
                curNode._htmlStart=i+1;
              }
            }
            plainText='';
            s='text';
          }else if (attrKey&&t=='='){
            attrValue='';
            s='attrValue';
          }else if (/^[\/\s]$/.test(t)){
            if (!isClose){
              this._addAttr(curNode,attrKey,attrValue);
            }
          }else{
            attrKey+=t;
          }
          break;
        case 'attrValue':
          if (isQuote){
            if (t==isQuote){
              isQuote=false;
              if (!isClose){
                this._addAttr(curNode,attrKey,attrValue);
              }
              //update weixj start
              attrKey='';
              attrValue='';
              //update weixj end
              s='attrKey';
            }else{
              attrValue+=t;
            }
          }else if (!attrValue&&/^[\'\"]$/.test(t)){
            isQuote=t;
          }else if (attrValue&&/^\s$/.test(t)||t=='>'){
            if (!isClose){
              this._addAttr(curNode,attrKey,attrValue);
            }
            attrKey='';
            attrValue='';
            s='attrKey';
            if (t=='>'){
              i--;
            }
          }else{
            if (attrValue||/^\s$/.test(t)){
              attrValue+=t;
            }
          }
          break;
      }
    }
    switch (s){
      case 'text':
      case 'comment':
      case 'tagName':
        break;
      case 'attrKey':
      case 'attrValue':
        curNode._parent.pop();
        break;
    }
    while (curNode!=this.root){
      t._htmlEnd=t._ohtmlEnd=codeArr.length-1;
      curNode=curNode._parent;
    }
  };
  htmlParse.prototype._addAttr=function(node,attrKey,attrValue){
    if (attrKey&&!node._attrs.hasOwnProperty(node)){
      node._attrs[attrKey]=attrValue;
    }
  };
  htmlParse.prototype._trim=function(str){
    return str.replace(/^\s+|\s+$/g,'');
  };

  // htmlparser for browser
  /*
  ;function htmlNode(t,e){this.parser=t,this._parent=parent,this._node=e}function htmlParse(t){this._html="",this._parse(t)}htmlNode.prototype.children=function(){var t=[];if(1==this._node.nodeType&&this.parser._ignoreTag.hasOwnProperty(this._node.tagName))t.push(document.createTextNode(this._node.innerHTML));
  else for(var e=0;e<this._node.childNodes.length;e++)t.push(new htmlNode(this.parser,this._node.childNodes[e]));return t.length?t:null},htmlNode.prototype.parent=function(){var t=null,e=this._node.parent;return e&&(t=new htmlNode(this.parser,e)),t},htmlNode.prototype.tagName=function(){return this._node.tagName||null
  },htmlNode.prototype.find=function(t,e){t=(t||"*").toLowerCase(),"object"!=this._type(e)&&(e={});for(var o=null,r=this._node.getElementsByTagName(t),n=0;n<r.length;n++)if(this._compareAttr(r[n],e)){o=new htmlNode(this.parser,r[n]);break}return o},htmlNode.prototype.findAll=function(t,e){t=(t||"*").toLowerCase(),"object"!=this._type(e)&&(e={});
  for(var o=[],r=this._node.getElementsByTagName(t),n=0;n<r.length;n++)this._compareAttr(r[n],e)&&o.push(new htmlNode(this.parser,r[n]));return o},htmlNode.prototype._compareAttr=function(t,e){for(var o in e)if(e.hasOwnProperty(o)){if(!t.hasAttribute(o))return!1;var r=""+t.getAttribute(o);switch(this._type(e[o])){case"string":if(e[o]!=r)return!1;
  break;case"regexp":if(r.test(atts[o]))return!1}}return!0},htmlNode.prototype._type=function(t){var e=Object.prototype.toString.call(t).match(/^\[object (.+)\]$/);return e?e[1].toLowerCase():""},htmlNode.prototype.html=function(){var t="";return t=this==this.parser.root?new htmlNode(this.parser,this._node.documentElement).ohtml():this._node.innerHTML||""
  },htmlNode.prototype.ohtml=function(){var t="";if(this==this.parser.root)t=new htmlNode(this.parser,this._node.documentElement).ohtml();else if(t=this._node.outerHTML||"",!t){var e=this.parser._document.createElement("div");e.appendChild(this._node.cloneNode(!0)),t=e.innerHTML||""}return t},htmlNode.prototype.text=function(){var t="";
  return this==this.parser.root?t=new htmlNode(this.parser,this._node.documentElement).text():(t=1==this._node.nodeType?this._node.innerText||this._node.textContent:this._node.nodeValue,t=this.parser._trim(t)),t},htmlNode.prototype.attr=function(t,e){if("undefined"==this._type(e)){var o=null;return 1==this._node.nodeType&&this._node.hasAttribute(t)&&(o=this._node.getAttribute(t)),o
  }return 1==this._node.nodeType&&this._node.setAttribute(t,e),this},htmlNode.prototype.remove=function(){return this==this.parser.root||this._node==this.parser._document.documentElement?(this.parser._document.open(),this.parser._document.write(""),this.parser._document.close()):this._node.parentNode.removeChild(this._node),this.parser.root
  },htmlParse.prototype._ignoreTag=function(){for(var t="script,textarea,pre".split(","),e={},o=0;o<t.length;o++)e[t[o]]=1;return e}(),htmlParse.prototype._parse=function(t){"string"==htmlNode.prototype._type(t)&&(this._html=t||""),this._document=document.implementation.createHTMLDocument(),this._document.open(),this._document.write(this._html),this._document.close(),this.root=new htmlNode(this,this._document)
  },htmlParse.prototype._trim=function(t){return t.replace(/^\s+|\s+$/g,"")};
  */

  // sandbox for browser
  /*
  var sandbox={
    Lizard:Lizard,
  };
  */
  
  // vm for v8
  var vm={};
  vm.undfn=void(0);
  vm.global=(1,eval)('this');
  vm.getContext=function(code,context){
    code=code||'';
    context=context||{};
    var con={
      global:{},
      alert:function(){},
      confirm:function(){},
    console:{
        log:function(){},
    },
    localStorage:{
      setItem:function(){},
      getItem:function(){return '';}
      },
      vm:vm.undfn,
      Lizard:Lizard,
      setInterval:function(){},
      setTimeout:function(){}
    };
    if (context){
      for (var key in context){
        if (context.hasOwnProperty(key)&&!con.hasOwnProperty(key)){
          con[key]=context[key];
        }
      }
    }
    code.replace(/[a-z][a-z0-9_$]*/gi,function(a){
      if (!con.hasOwnProperty(a) && !vm.global.hasOwnProperty(a)){
        con[a]=vm.undfn;
      }
    });
    return con;
  };
  vm.code2string=function(code){
    var hash={
      '\\':'\\\\',
      '\t':'\\t',
      '\r':'\\r',
      '\n':'\\n',
      '\'':'\\\'',
      '\"':'\\\"'
    };
    ret=code.replace(/[\\\t\r\n\'\"]/g,function(a){
      return hash[a];
    });
    return ret;
  };
  vm.require=function(code,context){
    var ret={};
    var con=vm.getContext(code,context);
    con.define=function(){
      var args=arguments;
      for (var i=0;i<args.length;i++){
        if (typeof args[i]=='function'){
          try{
            ret=args[i](ret);
          }catch(e){};
        }
      }
    };
    try{
      var fn=new Function('__context','with(__context){'+code+'}');
      fn(con);
    }catch(e){}
    return ret;
  };
  vm.eval=function(code,context){
    var ret=vm.undef;
    var con=vm.getContext(code,context);
    try{
      var fn=new Function('__context','with(__context){return eval(\''+vm.code2string(code)+'\');}');
      ret=fn(con);
    }catch(e){
      var conStr='';
      try{
        conStr=JSON.stringify(con);
      }catch(e){};
      throw(new Error(('['+e.stack+'] '+code+' @@@ '+conStr+' @@@ ').replace(/</g,'&lt;').replace(/>/g,'&gt;')));
    }
    return ret;
  };
  /***** configuration end *****/

  var uuid = 0;
  var isServer = typeof window=='undefined';  

  /*
    获取传过来的参数
  */
  function getPageParams(url, urlschema) {
    var ret = {};
    if (typeof urlschema == 'string')
    {
    urlschema = [urlschema];
    }
    _.each(urlschema, function(item){
    var paraArr = [], paraHash = {};
    var parseRet = Lizard.schema2re(item, url);
    if (parseRet.reStr && parseRet.param)     
    {
      ret = parseRet.param;
    }
    });   
    // parseQuery
    var queryStr=url.replace(/^[^\?#]*\??/g,'').replace(/#DIALOG_.*$/g,'');
    queryStr.replace(/([^=&]+)=([^&]*)/g, function (a, b, c) {
      b = decodeURIComponent(b);
      c = decodeURIComponent(c);
      ret[b] = c;
      ret[b.toLowerCase()] = c;
    });
    return ret;
  }
  /*
  获取页面配置项
  */
  function getPageConfig(parser, pd_init_script){
    var defaultStr = JSON.stringify({"url_schema": "","model": {"apis": []},"view":{}});
    try{
      var configStr=parser.root.find('script',{
        type:'text/lizard-config'
      }).text();
    }catch(e){
      var configStr = defaultStr
    }
    if(!configStr)configStr = defaultStr;
    var ajaxDataMatch = configStr.match(/Lizard.D\(([\'\"])(.*?)([\'\"])\)(.*?)(,|\s)/g), dataexpr = [];
    if (ajaxDataMatch)
    {
      _.each(ajaxDataMatch, function(match){
      var dataexprStr = match.split(',').join('').split('}').join('');
      dataexpr.push(dataexprStr);
      })
    }
    var ret={};
    var funcStr='(function(){'+pd_init_script+';ret='+configStr+';return ret;})()';
    ret=vm.eval(funcStr);
    ret.dataexpr = dataexpr;
    return ret;
  }
  
  /*
  获取页面templates
  */
  function getPageTemplates(parser){
    var ret={};
    var templates=parser.root.findAll('script',{
      type:'text/lizard-template'
    });
  


    for (var i=0;i<templates.length;i++){
      var id=templates[i].attr('id');
      if (id){
        ret[id]={
          'runat': templates[i].attr('runat')||'all',
          'text': removeTags(templates[i].text(),isServer?'client':'server')
        };
      }
    }
    return ret;
  }
  function removeTags(html,runat){
    var ret=html||'';
    if (/runat=/.test(ret)){
      var hash={};
      var guid='';
      var re;
      while (1){
        guid=(Math.random()*10000).toFixed(0);
        re=new RegExp('lizard_'+guid+'_\\d+','g');
        if (!re.test(ret)){
          break;
        }
      }
      var i=0;
      ret=ret.replace(/<%[\s\S]*?%>/g,function(a){
        var id='/*lizard_'+guid+'_'+i+'*/';
        hash[i]=a;
        i++;
        return id;
      });
      var parser=new htmlParse(ret),node;
      while (node=parser.root.find('*',{
        'runat':runat
      })){
        node.remove();
      }
      ret=parser.root.html();
      re=new RegExp('\\/?\\*lizard_'+guid+'_(\\d+)\\*\\/?','g');
      ret=ret.replace(re,function(a,b){
        return hash[b]||'';
      });
    }
    return ret;
  }
  /*
  获取页面urlschema
  */
  function getPageUrlschema(parser){
    var ret='';
    var defaultStr = JSON.stringify({"url_schema": "","model": {"apis": []},"view":{}});
    try{
      var configStr=parser.root.find('script',{
        type:'text/lizard-config'
      }).text();
    }catch(e){
      return '';
    }
    if(!configStr)configStr = defaultStr;
    var arr=configStr.match(/([\'\"])?url_schema\1\s*:\s*([\'\"])(.*?)\2/) || configStr.match(/([\'\"])?url_schema\1\s*:\s*\[\s*([\'\"])((.|\s)*?)\2(\s*|,)]/);
    if (arr){
      ret = vm.eval('(function() { ret = {' + arr[0] + '}[\'url_schema\']; return ret;})()');
    }
    return ret;
  }

  function _Lizard(url,html, pd_init_script){
    this.url = url;
    this.html = html;
    this.configs = [];
    this.models = {};
    this.filters = {};
    this.urlschema = "";
    this.templates = {};
    this.params = {};
    /*
    将各自的内容填到congfig中
    */
    this.snapshoot1 = [];
    this._init(pd_init_script)
  }
  
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  
  _Lizard.prototype = {
    _init:function(pd_init_script){ 
      var url = this.url;
      var html = this.html;
      
      parser=new htmlParse(html);
      
      Lizard.T.lizTmpl = this.templates = getPageTemplates(parser);
      Lizard.P.lizParam = this.params = getPageParams(this.url, getPageUrlschema(parser));
      this.config = getPageConfig(parser, pd_init_script);      
    },
    getModels:function(){
      if(!this.config.model)this.config.model= {};
      var apis = this.config.model.apis || [];
      var ret = [];
  
    
      for(var i=0;i<apis.length;i++){
        var api = apis[i];
            
        api.runat = api.runat||"all";
        if(api.runat=="server"){
          if(Lizard.runAt == "server"){
            ret.push(api);
          };
        }else if(api.runat=="client"){
          if(Lizard.runAt == "client"){
            ret.push(api);
          };
        }else if(api.runat=="all"){
          ret.push(api);
        }
      }
      
      
      var ret1 = [];
      var len = ret.length;
      for(var i=0;i<len;i++){
        var api = ret[i];
        var url = api.url;
        url=hostMapping('',url);
        var postdata = api.postdata||{};
        if(!postdata.head)
        {
          postdata.head={
            "cid":     (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()),
            "ctok":    "351858059049938",
            "cver":    "1.0",
            "lang":    "01",
            "sid":     "8888",
            "syscode": '09',
            "auth":    ""
          };
        }
        postdata.head.syscode="09";
        ret1.push({
          url:url, 
          postdata:postdata, 
          name: api.name
        })
      }
      return this._parseDepend(ret1);
    },
    _runUnderscore:function(tmpl,datas, script){
      var _this=this;
      if (!datas){
        datas={};
      }
      var ret='';
      if (tmpl){
        var compiled=_.template(tmpl);
        var handler=Lizard.T;
        Lizard.T=function(id,datas){
          return _this._runUnderscore(Lizard._T(id),datas, script);
        };
        Lizard.T.lizTmpl=Lizard._T.lizTmpl;
        if (!script) script = '';
        try
        {
          var funcStr = '(function(){'+script+';return typeof hotel == "undefined"?null:hotel;})()', context={};
          context.hotel=vm.eval(funcStr);
          ret=compiled(datas,context).trim(); 
        }
        finally
        {
          Lizard.T=handler;
        }
      }
      return ret;
    },
    render:function(datas){
      this.ohtml = this.html;
      var TDK={};
      var TDKStr = "";
      var setTDK = this.config.model.setTDK;
      if (setTDK){
        TDK = setTDK(datas);
      }
      
      var parser=new htmlParse(this.html);
      var title=parser.root.find('title');
      if(TDK.title){
        if(title)title.remove();
        TDKStr+='<title>'+TDK.title+'</title>';
      }
      
      // var parser=new htmlParse(parser.root.html());
      var mtitle=parser.root.find('meta',{
        name:'title'
      });
      
      if(TDK.title){
        if(mtitle)mtitle.remove();
        TDKStr+='<meta name="title" content="'+TDK.title+'" />';
      }
      
      // var parser=new htmlParse(parser.root.html());
      var description=parser.root.find('meta',{
        name:'description'
      })
      
      if(TDK.description){
        if(description)description.remove();
        TDKStr+='<meta name="description" content="'+TDK.description+'" />';
      }
      
      // var parser=new htmlParse(parser.root.html());
      var keywords=parser.root.find('meta',{
        name:'keywords'
      })
      if(TDK.keywords){
        if(keywords)keywords.remove();
        TDKStr+='<meta name="keywords" content="'+TDK.keywords+'" />';
      }
      
      this.html = parser.root.html();
      var pd_script = datas[100];
      if (this.config.model.filter){          
        var funcStr='(function(){'+datas[100]+';return typeof hotel=="undefined"?null:hotel})()';
        var hotel=vm.eval(funcStr);
        datas = vm.eval('fn.call(_this, datas, TDK)',{
          fn:this.config.model.filter,
          _this:this,
          datas:datas,
          TDK:TDK
        });
      };  
      var ret = {
        header: '',
        viewport: ''
      };
      
      for (var tmplName in this.config.view){
        if (this.config.view.hasOwnProperty(tmplName)){
          ret[tmplName]=this._runUnderscore(this.config.view[tmplName],datas, pd_script);
        }
      }
      if (ret.header)
      {
        ret.header = ret.header.replace(/<[\s|\B]+h1|<h1/gi, '<h2').replace(/h1[\s|\B]+>|h1>/gi, 'h2>');
      }
      var id = this.url;

      function getGuid(){
        return +new Date();
      }
      function getID(url){
        var id= "id_viewport"+(++uuid);
        return id;
      }
      id = getID(id);

      ret.viewport = ('<div id="' + id + '" page-url="'+this.url+'">'
              + ret.viewport
              //+ (this.config.controller?'<script type="text/controller" data-src="' + this.config.controller + '"></script>':'')
              +'</div>').trim();
      ret.id = id;
      ret.controller = this.config.controller;
      ret.config = this.config;
      ret.datas = datas;
      ret.lizTmpl = this.templates;
      ret.lizParam = this.params;
      ret.TDK = TDKStr;
      if (isServer) {
      
        var parser=new htmlParse(this.html),node;
        var main_viewport=parser.root.find('*',{
          'class':'main-viewport'
        });
        if(main_viewport){
          while (node=main_viewport.children()[0]){
            node.remove();
          }
        }
        this.html = parser.root.html();
        
        var temp_html =
          this.html
            .replace(/<div\b[^>]*?class=([\'\"])main-viewport\1[^>]*>/i, function (a) {
              return a.replace('>',' renderat="server" >') + ret.viewport;
            })
            .replace(/<header\b[^>]*>/i, function (a) {
              return a + ret.header;
            })
            .replace(/<head\b[^>]*>/, function(a){
              
              var ret = "";
              if(TDKStr){
                ret = a +TDKStr ;
              }else{
                ret = a;
              }
              return ret;
            }).replace(/<a\s+.*?\>([\w\W]*?)\<\/a\>/gi, function(linktag){
              return linktag.replace(/href\s*=\s*[\"\']?([^\"\' ]+)[\"\']/gi, function(a, b){
                return a.replace(b, b.replace('\/webapp\/','\/html5\/'));     
              })
            });
        return temp_html;
      } else {
        return ret;
      }
    },
    _unint:function(){
      
    },
    _parseDepend: function(apis)
    {     
      var dataexpr = this.config.dataexpr, self = this;     
      _.each(apis, function(api){
      if ('suspend' in api)
      {
        api.suspend = api.suspend.toString();
      }
      else
      {
        api.suspend = false;
      }
      _.each(dataexpr, function(p)
      {
        var postdataStr = JSON.stringify(api.postdata);
        if (JSON.stringify(postdataStr).indexOf(p) > -1 || self._containFunc(api.postdata, p) || (api.suspend && api.suspend.indexOf(p) > -1))
        {
          if (!api.depends)
          {
          api.depends = [];
          api.expressionMap = {};
          }
      var code=p.match(/Lizard.D\(([\'\"])(.*?)([\'\"])\)/g)[0].split('Lizard.D').join('');
      api.depends.push(vm.eval(code));
          api.expressionMap[p] = dataexpr[p];
        }
      });
      });
      return apis;
    },
    _containFunc: function(obj, expr)
    {
      var ret = false;
      for (var p in obj)
      {
      if (ret)
      {
        return true;
      }
      if (_.isFunction(obj[p]) && obj[p].toString().indexOf(expr) > -1)
      {
        obj[p] = obj[p].toString().trim();
        return true;
      }   
      else if (_.isObject(obj[p]) || _.isArray(obj[p]))
      {
        ret = this._containFunc(obj[p], expr);
      }     
      }
      return ret;     
    }
  }
  Lizard.getModels = function(url, html, pd_init_script){
    var ins = new _Lizard(url,html,pd_init_script);
    var models = ins.getModels();    
    ins._unint();
    ins = null;
    return models;
  }
  Lizard.render = function(url, html, datas){    
    var ins = new _Lizard(url,html, datas[100]);
    var text = ins.render(datas);
    ins._unint();
    ins = null;
    return text;
  }
  
  Lizard.P = function (key, value) {
    var ret=null;
    if (_.isUndefined(value)){
      ret= Lizard.P.lizParam[key] || Lizard.P.lizParam[key.toLowerCase()];
    }else{
      ret=Lizard.P.lizParam[key]=value;
    }
    return ret;
  };
  Lizard.T = Lizard._T = function (id) {
    var ret = "";
    var t=Lizard.T.lizTmpl[id];
    if (t&&t.runat!=(isServer?'client':'server')){
      ret = t.text;
    }
    return ret;
  };
  
  Lizard.S = function(stroename, key, defaultvalue)
  {
    return defaultvalue;
  }
  
  //导出对象
  LizardGetModels = function(){
  var url = arguments[0], html = arguments[1], fetchedDatas = arguments[2],funcStr;
    function transfuncToVal(obj)
    {
      for (var p in obj)
      {
        if (obj.hasOwnProperty(p))
        {
          if (_.isString(obj[p]) && obj[p].indexOf('function') == 0)
          {
            funcStr = '(function(){\r\n'+ fetchedDatas[100]+'; return (' + obj[p] + ')();})()';
            obj[p]=vm.eval(funcStr);
          }
          else if (_.isObject(obj[p]) || _.isArray(obj[p]))
          {
            transfuncToVal(obj[p]);
          }  
        }                 
      }
    }
    
    if (!fetchedDatas)
    {     
      var parser=new htmlParse(html); 
      var pdInitScript=parser.root.find('script',{pd_init: 1});
      if (pdInitScript)
      {
        return JSON.stringify({bProceed: true, models: [{url: hostMapping(null, pdInitScript._attrs['src']), postdata: '', name: '100'}], fetchedDatas: arguments[2]});   
      }
      else
      {
        fetchedDatas = {100: ''};
      }
    } else if (!pdInitScript) {
      fetchedDatas[100] = '';
    }    
    
    Lizard.P.lizParam={};
    Lizard.T.lizTmpl={};
    var models = Lizard.getModels.call(Lizard, url, html, fetchedDatas[100]);
    
    var indexMap = {};
    _.each(models, function(model, index){
      if (model.name) {
      indexMap[index] = model.name;
      }
      model.name = index;   
    });
    var leftmodels = models;
    
    if (_.size(fetchedDatas) > 0)
    {
      leftmodels = _.filter(models, function(model, index){
      if (fetchedDatas[index])
      {
        return false;
      }
      if (model.suspend && vm.eval('(' + model.suspend + ')()'))
      {
        return false;
      }
      return true;
      });     
    }
    if (leftmodels.length)
    {
      leftmodels = _.filter(leftmodels, function(model){
      return !model.depends || _.every(model.depends, function(depend){
        if (fetchedDatas)
        {
        for (var p in indexMap)
        {
          if (indexMap[p] == depend && fetchedDatas[p])
          {
          return true;
          }
        }
        }
        return false;
      });
      }); 
    }
    
    if (leftmodels.length)
    {
      Lizard.D = function(name)
      {
        for (var p in indexMap)
        {
          if (indexMap[p] == name)
          {
            return fetchedDatas[p]
          }
        }
      }
      
      _.each(leftmodels, function(model){
        funcStr='(function(){\r\n'+fetchedDatas[100]+';transfuncToVal(model);})()';
        model=vm.eval(funcStr,{
          model:model,
          transfuncToVal:transfuncToVal
        });
      })
    }
    return JSON.stringify({bProceed: (leftmodels.length + _.size(fetchedDatas) < models.length + 1), models: leftmodels, fetchedDatas: arguments[2]});   
  };
  LizardRender = function(){
    Lizard.P.lizParam={};
    Lizard.T.lizTmpl={};
    return Lizard.render.apply(Lizard, arguments)
  };

  function urlParse(url){
    var arr=url.match(/^\s*(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/)||[];
    return {
      href:arr[0]||'',
      hrefNoHash:arr[1]||'',
      hrefNoSearch:arr[2]||'',
      domain:arr[3]||'',
      protocol:arr[4]||'',
      doubleSlash:arr[5]||'',
      authority:arr[6]||'',
      username:arr[8]||'',
      password:arr[9]||'',
      host:arr[10]||'',
      hostname:arr[11]||'',
      port:arr[12]||'',
      pathname:arr[13]||'',
      directory:arr[14]||'',
      filename:arr[15]||'',
      search:arr[16]||'',
      hash:arr[17]||''
    };
  }

  function urlFormat(urlObj){
    return urlObj.protocol+urlObj.doubleSlash+urlObj.authority+urlObj.pathname+urlObj.search+urlObj.hash;
  }

  function hostMapping(env,url){
    var objUrl=urlParse(url);
//    objUrl.authority=objUrl.authority.replace(/^([^@]*@)?m.ctrip.com(:\d+)?/i,'$1restapi.mobile.ctripcorp.com$2');
  
    objUrl.authority=objUrl.authority.replace(/^([^@]*@)?m.ctrip.com(:\d+)?/i,'$1h5seo.mobile.ctripcorp.com$2');
    var ret=urlFormat(objUrl);
    return ret;

  }

  LizardUrlMapping=function(env,url){
    var objUrl=urlParse(url);

    // for all business
    objUrl.pathname=objUrl.pathname.replace(/^\/html5\//i,'/webapp/');
    // for tour seo
    // objUrl.pathname=objUrl.pathname.replace(/^\/webapp\/tour\b/i,'/webapp/tour/seo');

    var ret=urlFormat(objUrl);
    ret=hostMapping(env,ret);

    return ret;
  };
  
  function reString(str){
    var h={
    '\r':'\\r',
    '\n':'\\n',
    '\t':'\\t'
    };
    var re1=/([\.\\\/\+\*\?\[\]\{\}\(\)\^\$\|])/g;
    var re2=/[\r\t\n]/g;
    return str.replace(re1,'\\$1').replace(re2,function(a){
    return h[a];
    });
  }

  function fixReString(str){
    var chars=str.split('');
    var isInCharDict=false; // []
    var t='';
    var ret=[];
    while (t=chars.shift()){
    ret.push(t);
    if (t=='\\'){
      ret.push(chars.shift());
    }else if (t=='['&&!isInCharDict){
      isInCharDict=true;
    }else if (t==']'&&isInCharDict){
      isInCharDict=false;
    }else if (t=='('&&!isInCharDict){
      if (chars[0]=='?'&&(chars[1]==':'||chars[1]=='!'||chars[1]=='=')){
      chars.shift();
      chars.shift();
      }
      ret.push('?');
      ret.push(':');
    }
    }
    return ret.join('');
  }

  function schema2re(urlSchema, url){  
    var paraArr = [], tArr = [], params = {};
    var reStr = urlSchema.replace(/\{\{(.+?)\}\}/g,function(a,b){
    tArr.push(b);
    return '{@'+(tArr.length-1)+'}';
    }).replace(/\{(@?)(.+?)\}|[^\{\}]+/g,function(a,b,c){
      var ret = '';
      if (c){
      if (b){
        var pArr=tArr[c].match(/^(?:(?:\((\w+)\))?([^!=]+?)|([^!=]+?)=(.*))$/);
        if (pArr){
        if (pArr[2]){
          switch (pArr[1]){
          case 'number':
            ret='(\\d+(?:\\.\\d*)?|\\.\\d+)';
            break;
          case 'int':
            ret='(\\d+)';
            break;
          case 'letter':
            ret='([a-z _\\-\\$]+)';
            break;
          default:
            ret='([^\\\/]*)';
            break;
          }
          paraArr.push(pArr[2]);
        }else{
          paraArr.push(pArr[3]);
          if (/^\/.*\/$/.test(pArr[4])){
          ret='('+fixReString(pArr[4].slice(1,-1))+')';
          }else{
          var arr = pArr[4].split('||');
          for (var j = 0;j < arr.length; j++){
            arr[j]=reString(arr[j]);
          }
          ret='('+arr.join('|')+')';
          }
        }
        }else{
        ret='';
        }
      }else{
        paraArr.push(c);
        ret='([^\\\/]*)';
      }
      }else{
      ret=reString(a);
      }
      return ret;
    });
    
    url = url.replace(/[#\?].*$/g,'');    
    var matches = url.match(new RegExp(reStr,'i')), pathRe = '/([^\/]*)';
    if (reStr[reStr.length - 1] != '\\')
    {
    pathRe = '\\/([^\/]*)'
    }   
    var morePathmatches = url.match(new RegExp(reStr + pathRe,'i'));
    if (matches && !morePathmatches){
    for (var i=0;i<paraArr.length;i++) {
      params[paraArr[i]] = decodeURIComponent(matches[i+1])||null;
    }
    return {reStr: reStr, param: params, index: matches.index};
    } 
    return {};
  }  
  Lizard.schema2re = schema2re;
})(this);

// export for nodejs
;if (typeof exports !== 'undefined') {
  exports.Lizard = Lizard;
  exports.LizardGetModels = LizardGetModels;
  exports.LizardRender = LizardRender;
  exports.LizardUrlMapping = LizardUrlMapping;
};