<template>
  <div class='wrapper'>
    数值：{{value}} <button @click="increment()">自增1</button>
  </div>
</template>

<script>
export default {
  name: 'my-increment',
  props: ['value'],
  // data () {
  //   return {
  //     count: 0
  //   }
  // },
  methods: {
    increment () {
      // this.value++  不能这么写
      this.$emit('input', this.value + 1)
    }
  }
}
</script>

<style scoped lang='less'></style>
