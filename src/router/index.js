// 进行路由的初始化 和 配置
// 导入
import VueRouter from 'vue-router'
// 注册
import Vue from 'vue'
// 导入组件
// 完整路径 @/views/login/index.vue  index.vue是索引文件
// 疑问：index.js index.vue index.json  优先级和我书写的顺序一致
import Login from '@/views/login'
import Home from '@/views/home'
Vue.use(VueRouter)
// 初始化
const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    { path: '/', component: Home }
  ]
})
// 导出
export default router
