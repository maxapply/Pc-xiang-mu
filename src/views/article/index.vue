<template>
  <div class="container">Article</div>
</template>

<script>
export default {
  // 注意：组件名称不能和原生标签重名
  name: 'app-article',
  created () {
    // 发请求进行测试
    this.$http
      .get('http://ttapi.research.itcast.cn/mp/v1_0/articles')
      .then(res => {
        console.log(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>

<style scoped lang='less'></style>
