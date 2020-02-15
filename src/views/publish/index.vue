<template>
  <div class='container-publish'>
    <el-card>
      <div slot="header">
        <my-bread>发布文章</my-bread>
      </div>
      <el-form label-width="120px">
        <el-form-item label="标题：">
          <el-input v-model="articleForm.title" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="内容：">富文本</el-form-item>
        <el-form-item label="封面：">封面组件</el-form-item>
        <el-form-item label="频道：">
          <my-channel v-model="articleForm.channel_id"></my-channel>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">发布文章</el-button>
          <el-button>存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 测试组件 -->
    <!-- :value="count" @input="count=$event"  就是v-model的语法糖底层 -->
    <my-increment v-model="count"></my-increment>
  </div>
</template>

<script>
import MyIncrement from '@/components/my-increment'
export default {
  components: { MyIncrement },
  name: 'app-publish',
  data () {
    return {
      count: 10,
      // 文章数据
      articleForm: {
        title: null,
        channel_id: null
      }
    }
  }
}
</script>

<style scoped lang='less'></style>
