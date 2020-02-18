<template>
  <div class='container-publish'>
    <el-card>
      <div slot="header">
        <my-bread>{{$route.query.id?'修改':'发布'}}文章</my-bread>
      </div>
      <el-form label-width="120px">
        <el-form-item label="标题：">
          <el-input v-model="articleForm.title" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <quill-editor v-model="articleForm.content" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="封面：">
          <el-radio-group @change="articleForm.cover.images=[]" v-model="articleForm.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 组件位置 -->
          <div v-if="articleForm.cover.type===1">
            <my-image v-model="articleForm.cover.images[0]"></my-image>
          </div>
          <div v-if="articleForm.cover.type===3">
            <my-image :key="i" v-for="i in 3" v-model="articleForm.cover.images[i-1]"></my-image>
          </div>
        </el-form-item>
        <el-form-item label="频道：">
          <my-channel v-model="articleForm.channel_id"></my-channel>
        </el-form-item>
        <el-form-item v-if="$route.query.id">
          <el-button @click="update()" type="success">修改文章</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button @click="submit(false)" type="primary">发布文章</el-button>
          <el-button @click="submit(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 富文本需要的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 组件配置对象
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'app-publish',
  components: { quillEditor },
  data () {
    return {
      // 文章数据
      articleForm: {
        title: null,
        channel_id: null,
        content: null,
        cover: {
          // 封面类型 -1:自动，0-无图，1-1张，3-3张
          type: 1,
          // 放图片地址
          images: []
        }
      },
      // 富文本配置对象
      editorOption: {
        // 占位文字
        placeholder: '',
        // 模块配置
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['image']
          ]
        }
      }
    }
  },
  created () {
    // 当时修改文章的时候，获取文章信息填充表单
    if (this.$route.query.id) {
      this.getArticle()
    }
  },
  watch: {
    // 监听地址栏ID的变化
    '$route.query.id': function () {
      this.toggleFormInfo()
    }
  },
  methods: {
    // 修改函数
    async update () {
      try {
        // 修改只有发布，没有草稿
        // 路径传参 需要ID
        // 键值对传参  需要 draft
        // 请求体传参  articleForm
        await this.$http.put(`articles/${this.articleForm.id}?draft=false`, this.articleForm)
        this.$message.success('修改成功')
        this.$router.push('/article')
      } catch (e) {
        this.$message.error('修改失败')
      }
    },
    // 切换表单内容
    toggleFormInfo () {
      if (this.$route.query.id) {
        // 修改
        this.getArticle()
      } else {
        // 发布
        // 不能这样：this.articleForm = {} 但是模板中 artic来eForm.cover.type 报错
        // 保证模板依赖的字段都有对应的数据，保证模板编译不错误
        this.articleForm = {
          title: null,
          channel_id: null,
          content: null,
          cover: {
            type: 1,
            images: []
          }
        }
      }
    },
    // 获取文章信息
    async getArticle () {
      const res = await this.$http.get(`articles/${this.$route.query.id}`)
      this.articleForm = res.data.data
    },
    // 添加文章 draft===false 发布文章  draft===true  存入草稿
    async submit (draft) {
      try {
        // 请求
        await this.$http.post(`articles?draft=${draft}`, this.articleForm)
        // 提示
        this.$message.success(draft ? '存入草稿成功' : '发布文章成功')
        // 跳转
        this.$router.push('/article')
      } catch (e) {
        this.$message.error('操作失败')
      }
    }
  }
}
</script>

<style scoped lang='less'></style>
