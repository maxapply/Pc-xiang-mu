<template>
  <div class='container-comment'>
    <el-card>
      <div slot="header">
        <my-bread>评论管理</my-bread>
      </div>
      <!-- 表格 -->
      <el-table :data="comments">
        <el-table-column label="文章标题" prop="title"></el-table-column>
        <el-table-column label="总评论数" prop="total_comment_count"></el-table-column>
        <el-table-column label="粉丝评论数" prop="fans_comment_count"></el-table-column>
        <el-table-column label="评论状态">
          <template slot-scope="scope">
            {{scope.row.comment_status?'正常':'关闭'}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="toggleStatus(scope.row)" size="small" v-if="scope.row.comment_status" type="danger">关闭评论</el-button>
            <el-button @click="toggleStatus(scope.row)" size="small" v-else type="success">打开评论</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        style="margin-top:20px"
        background
        layout="prev, pager, next"
        @current-change="pager"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'app-comment',
  data () {
    return {
      // 评论列表（文章列表，此时用来维护评论功能）
      comments: [],
      // 参数对象
      reqParams: {
        response_type: 'comment',
        page: 1,
        per_page: 20
      },
      // 总条数
      total: 0
    }
  },
  created () {
    this.getComments()
  },
  methods: {
    // 切换状态
    toggleStatus (row) {
      // 解释：row 其实就是comments数组遍历后的每一个对象。
      // 请求：put comments/status
      // 键值对传参：?article_id=文章ID
      // 请求体传参：allow_comment=想修改的状态
      // 关闭打开提示不一样：
      // 关闭：您是否确定要关闭该文章的评论功能，关闭后用户无法对文章进行评论。
      // 打开：您是否确定要打开该文章的评论功能。
      // row 中有 comment_status 标识当前文章状态
      const text1 = '您是否确定要关闭该文章的评论功能，关闭后用户无法对文章进行评论。'
      const text2 = '您是否确定要打开该文章的评论功能。'
      this.$confirm(row.comment_status ? text1 : text2, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          // res.data.data.allow_comment 修改后的状态
        // 请求
          const res = await this.$http.put(`comments/status?article_id=${row.id}`, {
            allow_comment: !row.comment_status
          })
          // 提示
          this.$message.success(res.data.data.allow_comment ? '打开成功' : '关闭成功')
          // 修改当前行文章的评论状态
          row.comment_status = res.data.data.allow_comment
        } catch (e) {
          this.$message.error('操作失败')
        }
      }).catch(() => {})
    },
    // 分页
    pager (newPage) {
      this.reqParams.page = newPage
      this.getComments()
    },
    // 获取评论列表
    async getComments () {
      // 调用articles接口，但是response_type=comment，获取评论相关字段数据。
      const res = await this.$http.get('articles', { params: this.reqParams })
      this.comments = res.data.data.results
      this.total = res.data.data.total_count
    }
  }
}
</script>

<style scoped lang='less'></style>
