/**
 * Created by So on 2018/4/14.
 */
require.register("./config.js", function(module, exports, require){
  module.exports = {
    backgroundColor:'#999',
    headerColor:'#888',
    mood:'无人与我把酒分，无人告我夜已深。'
  }
})
require.register("ajax", function(module, exports, require){
  module.exports = (options)=>{
    console.log(options,'ajax send!')
  }
})
require.register("./layout/header.js", function(module, exports, require){
  const headerColor=require('../config').headerColor
  const initHeader=()=>{
    let body=document.getElementsByTagName('body')[0]
    let header=document.createElement('header')
    header.innerHTML='<h2>像第一首诗不尽人意</h2>'
    header.style.backgroundColor=headerColor
    header.style.textAlign='center'
    body.appendChild(header)
  }
  module.exports = {
    initHeader
  }
})

require.register("./layout/body.js", function(module, exports, require){
  const {backgroundColor,mood}=require('../config')
  const initBody=()=>{
    let body=document.getElementsByTagName('body')[0]
    let header=document.createElement('header')
    header.innerHTML=`<p>${mood}</p>`
    header.style.textAlign='center'
    body.style.backgroundColor=backgroundColor
    body.appendChild(header)
  }
  module.exports = {
    initBody
  }
})

const {initHeader} = require("./layout/header.js");
// const {initBody} = require("./layout/body.js");
initHeader()
// initBody()