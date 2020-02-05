// 导包（第三方|自己的）
import Vue from 'vue'
import App from './App.vue'

// 配置vue框架的日志级别  productionTip
// fasle 不是生产环境级别日志，开发环境日志，日志详细
// true 生产环境级别日志，上线之后部署服务器之后，日志简单
Vue.config.productionTip = false

// 根实例
// 使用App.vue组件渲染到 #app容器中
new Vue({
  render: h => h(App)
}).$mount('#app')

// main.js的职责
// 1. 依赖项目需要的资源 (公用功能模块，需要导入main.js)
// 2. 创建一个Vue根实例
