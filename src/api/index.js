// 导出一个配置好的axios提供给main使用
import axios from 'axios'
import auth from '@/utils/auth'
import router from '@/router'
import JSONBINGINT from 'json-bigint'

// 基准地址配置
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 请求头token配置
// axios.defaults.headers.Authorization = `Bearer ${auth.getUser().token}`
// 转换响应格式
axios.defaults.transformResponse = [data => {
  // 进行格式转换 data有可能个不是json格式  极端情况
  // return JSONBINGINT.parse(data) 可能会报错
  try {
    // 正常转换
    return JSONBINGINT.parse(data)
  } catch (e) {
    // 转换异常，还是使用原始数据
    return data
  }
}]

// 请求拦截器
axios.interceptors.request.use(config => {
  // 获取本地的token，如果有token咱们就追加即可
  const user = auth.getUser()
  if (user.token) config.headers.Authorization = `Bearer ${user.token}`
  return config
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
axios.interceptors.response.use(res => {
  return res
}, err => {
  // token失效  后台会报错
  // err.response 响应报文对象
  // err.response.status 状态码
  if (err.response && err.response.status === 401) {
    // 拦截到登录
    // 大家代码：this.$router.push('/login')
    // this 一定不是vue实例，只有vue实例才能调用 $router或者$route
    // $router 就是路由实例，我们在router/index.js 初始化过路由实例
    // $router === router/index.js  理解吗？
    // window.location.href|hash 这样的跳转，可能不会触发路由的相关功能
    router.push('/login')
  }
  return Promise.reject(err)
})
export default axios
