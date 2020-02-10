// 导出一个配置好的axios提供给main使用
import axios from 'axios'
import auth from '@/utils/auth'

// 基准地址配置
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 请求头token配置
// axios.defaults.headers.Authorization = `Bearer ${auth.getUser().token}`
// 请求拦截器
axios.interceptors.request.use(config => {
  // 获取本地的token，如果有token咱们就追加即可
  const user = auth.getUser()
  if (user.token) config.headers.Authorization = `Bearer ${user.token}`
  return config
}, error => {
  return Promise.reject(error)
})
export default axios
