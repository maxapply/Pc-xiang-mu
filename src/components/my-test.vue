<template>
  <div class='container-test'>
    <slot name="up" age="18" gender="女" :msg="msg"></slot>
    <h4>测试组件</h4>
    <slot name="down"></slot>
  </div>
</template>

<script>
export default {
  name: 'my-test',
  data () {
    return {
      msg: '组件内数据'
    }
  }
}
</script>

<style scoped lang='less'></style>
