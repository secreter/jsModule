/**
 * Created by So on 2018/4/14.
 * 浏览器端模块化启动文件
 */
/**
 * 通过modulePath引用一个模块，支持嵌套路径
 * @param modulePath
 * @returns {*}
 */
function require(modulePath){
  var path = require.resolve(modulePath);
  var module = require.modules[path];
  if (!module) throw new Error('failed to require "' + modulePath + '"');
  if (!module.exports) {
    module.exports = {}
    module.call(module.exports, module, module.exports, require.relative(path));
  }
  return module.exports;
}

//挂载所有注册了的module，用path做key，dir做namespace
require.modules = {}

/**
 * 查找module的顺序
 * @param path
 * @returns {*|string}
 */
require.resolve = function (path){
  var orig = path;
  var reg = path + '.js';
  var index = path + '/index.js';
  return require.modules[reg] && reg
    || require.modules[index] && index
    || orig;
};

/**
 * 注册模块，挂载到modules上
 * @param path
 * @param fn
 */
require.register = function (path, fn){
  require.modules[path] = fn;
};

/**
 * 传递引用者模块的path，在引用者模块内部，被引用的模块使用的是相对路径；
 * relative函数将相对路径转换为绝对路径，再使用require来包含绝对路径；
 * relative相当于一个动态识别路径的require
 * @param parent
 * @returns {Function}
 */
require.relative = function (parent) {
  return function(modulePath){
    //require(moduleName)
    if ('.' != modulePath.charAt(0)) return require(modulePath);
    var path = parent.split('/');         //[".", "layout", "header.js"] 本模块位置
    var segs = modulePath.split('/');     // ["..", "config"]
    console.log(path)
    console.log(segs)
    path.pop();                          //[".", "layout"] 获取所在目录
    console.log(path)

    for (var i = 0; i < segs.length; i++) {
      var seg = segs[i];
      if ('..' == seg) path.pop();        //["."] 获取上级目录
      else if ('.' != seg) path.push(seg);
    }
    console.log(path.join('/'))
    console.log(require.modules)
    return require(path.join('/'));
  };
};