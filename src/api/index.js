// 导出一个配置好的axios提供给main使用
import axios from 'axios'
import auth from '@/utils/auth'

// 基准地址配置
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 请求头token配置
axios.defaults.headers.Authorization = `Bearer ${auth.getUser().token}`

export default axios
