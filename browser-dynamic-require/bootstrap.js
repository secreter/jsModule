/**
 * Created by So on 2018/4/14.
 */
(function (global) {
  var id = 0,
    container = document.getElementsByTagName("head")[0];

  function jsonp(options) {
    if(!options || !options.url) return;

    var scriptNode = document.createElement("script"),
      data = options.data || {},
      url = options.url,
      callback = options.callback,
      fnName = "requireRemote";

    // 添加回调函数
    data["callback"] = fnName;
    data["nonce"] = id++;

    // 拼接url
    var params = [];
    for (var key in data) {
      params.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
    }
    url = url.indexOf("?") > 0 ? (url + "&") : (url + "?");
    url += params.join("&");
    scriptNode.src = url;
    let module={}
    let exports=module.exports={}
    let require=()=>{

    }
    // 传递的是一个匿名的回调函数，要执行的话，暴露为一个全局方法
    global[fnName] = function (moduleName,factory) {
      factory.bind(null,module,exports,require)()
      callback && callback(moduleName,module);
      //container.removeChild(scriptNode);
      //delete global[fnName];
    }

    // 出错处理
    scriptNode.onerror = function () {
      callback && callback({error:"error"});
      container.removeChild(scriptNode);
      global[fnName] && delete global[fnName];
    }

    scriptNode.type = "text/javascript";
    container.appendChild(scriptNode)
  }

  global.jsonp = jsonp;

})(this)

jsonp({
  url : "/public/jquery.js",
  data : {id : 1},
  callback : function (moduleName,module) {
    if(!window.__modules){
      window.__modules={}
    }
    window.__modules[moduleName]=module.exports
    console.log(window.__modules);
  }
})
jsonp({
  url : "/public/utils.js",
  data : {id : 1},
  callback : function (moduleName,module) {
    if(!window.__modules){
      window.__modules={}
    }
    window.__modules[moduleName]=module.exports
    console.log(window.__modules);
  }
});
