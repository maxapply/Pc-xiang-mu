<template>
  <el-select @change="changeChannel" :value="value" placeholder="请选择" clearable>
    <el-option v-for="item in channelOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
    <!-- label 选项文字  value 选项的值 当你选择某个选项后，该选项的值提供v-model -->
  </el-select>
</template>

<script>
export default {
  name: 'my-channel',
  // v-model="value" 既能赋值，又改值，现在value数据仅读，所有不能使用v-model
  // 只能使用 :value 给el-select赋值
  props: ['value'],
  data () {
    return {
      // 默认选中下拉选项
      // value: null,
      // 所有的下拉选项
      channelOptions: []
    }
  },
  created () {
    this.getChannelOptions()
  },
  methods: {
    // value 是选择频道后的频道ID
    changeChannel (value) {
      // if (this.value === '') this.value = null
      // 通知父组件改值  filterData.channel_id
      if (value === '') value = null
      this.$emit('input', value)
    },
    // 获取频道数据
    async getChannelOptions () {
      // 发请求获取频道数据
      const res = await this.$http.get('channels')
      // res = {data:{message:'',data:{channels:[// 频道数组 ]}}}
      // this.channelOptions = [{id,name}]  数据格式
      this.channelOptions = res.data.data.channels
    }
  }
}
</script>

<style scoped lang='less'></style>
