/**
 * Created by So on 2018/4/14.
 */
(function (modules) {

  // install a JSONP callback for chunk loading
  var parentJsonpFunction = window["requireJsonp"];
  var moduleFactorys={}
  window["requireJsonp"] = function requireJsonpCallback(moduleName, factory) {
    // add "moreModules" to the modules object,
    // then flag all "chunkIds" as loaded and fire callback

    moduleFactorys[moduleName]=factory
    if(promiseCache[moduleName]) {
      //resolve()
      promiseCache[moduleName][0](factory)
    }
    promiseCache[moduleName] = 0;
    if(parentJsonpFunction) parentJsonpFunction(moduleName, factory);
  };
  var id = 0,
    container = document.getElementsByTagName("head")[0];
  // The module cache
  var installedModules = {};
  function require (moduleName) {
    // Check if module is in cache
    if(installedModules[moduleName]) {
      return installedModules[moduleName].exports;
    }
    // Create a new module (and put it into the cache)
    var module = installedModules[moduleName] = {
      i: moduleName,
      l: false,
      exports: {}
    };
    // Execute the module function
    moduleFactorys[moduleName].call(module.exports, module, module.exports, require);
    // Flag the module as loaded
    module.l = true;
    // Return the exports of the module
    return module.exports;
  }
  var promiseCache={
    //jquery:[resolve, reject,promise]
  }
  require.requireEnsure=function requireEnsure(moduleName){
    if(promiseCache[moduleName]===0){
      return new Promise(function(resolve) { resolve(); });
    }
    if(promiseCache[moduleName]){
      return promiseCache[moduleName][2]
    }
    var promise = new Promise(function(resolve, reject) {
       promiseCache[moduleName] = [resolve, reject];
    });
    promiseCache[moduleName][2]=promise
    // start chunk loading
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.async = true;
    script.timeout = 120000;
    script.src = require.publicPath + moduleName + ".js";
    var timeout = setTimeout(onScriptComplete, 120000);
    script.onerror = script.onload = onScriptComplete;
    function onScriptComplete() {
      // avoid mem leaks in IE.
      script.onerror = script.onload = null;
      clearTimeout(timeout);
      var chunk = promiseCache[moduleName];
      if(chunk !== 0) {
        if(chunk) {
          chunk[1](new Error('Loading chunk ' + moduleName + ' failed.'));
        }
        promiseCache[moduleName] = undefined;
      }
    };
    head.appendChild(script);
    return promise;
  }
  require.load=function (moduleName) {
    modules[moduleName](require)
    return require.requireEnsure(moduleName)
  }
  require.modules=modules
  require.moduleFactorys=moduleFactorys
  require.installedModules=installedModules
  require.promiseCache=promiseCache
  require.publicPath='/public/'
  window.require=require
  return
})(
  {
    jquery:function ( require) {
      require.requireEnsure('jquery').then((data)=>{
        require.bind(null,'jquery')()
        console.log(11,require.moduleFactorys)
      })
    }
  }
)

// function jsonp(options) {
//   return new Promise((resolve, reject) => {
//     if (!options || !options.url) return;
//
//     var scriptNode = document.createElement("script"),
//       data = options.data || {},
//       url = options.url,
//       callback = options.callback,
//       fnName = "requireRemote";
//
//     // 添加回调函数
//     data["callback"] = fnName;
//     data["nonce"] = id++;
//
//     // 拼接url
//     var params = [];
//     for (var key in data) {
//       params.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
//     }
//     url = url.indexOf("?") > 0 ? (url + "&") : (url + "?");
//     url += params.join("&");
//     scriptNode.src = url;
//     let module = {}
//     let exports = module.exports = {}
//     let require = () => {
//
//     }
//     // 传递的是一个匿名的回调函数，要执行的话，暴露为一个全局方法
//     global[fnName] = function (moduleName, factory) {
//       factory.bind(null, module, exports, require)()
//       resolve(module)
//       console.log(11)
//       //callback && callback(moduleName, module);
//       //container.removeChild(scriptNode);
//       //delete global[fnName];
//     }
//
//     // 出错处理
//     scriptNode.onerror = function () {
//       reject(module)
//       //callback && callback({error: "error"});
//       //container.removeChild(scriptNode);
//       //global[fnName] && delete global[fnName];
//     }
//
//     scriptNode.type = "text/javascript";
//     container.appendChild(scriptNode)
//   })
// }

// global.jsonp = jsonp;
// jsonp({
//   url : "/public/jquery.js",
// }).then((module)=>{
//   if(!window.__modules){
//     window.__modules={}
//   }
//   window.__modules['jquery']=module.exports
//   console.log(window.__modules);
// }).catch(e=>console.log(e))
//
// jsonp({
//   url : "/public/utils.js",
// }).then((module)=>{
//   if(!window.__modules){
//     window.__modules={}
//   }
//   window.__modules['utils']=module.exports
//   console.log(window.__modules);
// }).catch(e=>console.log(e))
