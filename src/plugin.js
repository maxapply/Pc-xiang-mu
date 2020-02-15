// 基于vue的插件
import MyBread from '@/components/my-bread'
import MyChannel from '@/components/my-channel'
import MyImage from '@/components/my-image'
export default {
  // 在main.js使用Vue.use(当前插件)传入Vue参数
  install (Vue) {
    // 使用Vue对象扩展功能
    Vue.component(MyBread.name, MyBread)
    Vue.component(MyChannel.name, MyChannel)
    Vue.component(MyImage.name, MyImage)
  }
}
