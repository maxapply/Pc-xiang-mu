<template>
  <div class="container-image">
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <!-- 按钮 -->
      <div class="btn-box">
        <!-- collect 值为true收藏的图片  false全部的图片 -->
        <!-- :label 指定值才是布尔类型  -->
        <el-radio-group @change="changeCollect()" v-model="reqParams.collect" size="small">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button @click="openDialog()" style="float:right" type="success" size="small">添加素材</el-button>
      </div>
      <!-- 列表 -->
      <div class="img-list">
        <div class="img-item" v-for="item in images" :key="item.id">
          <img :src="item.url" alt />
          <div class="option" v-if="!reqParams.collect">
            <span
              @click="toggleStatus(item)"
              class="el-icon-star-off"
              :class="{red: item.is_collected}"
            ></span>
            <span @click="delImage(item.id)" class="el-icon-delete"></span>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        :total="total"
        @current-change="pager"
      ></el-pagination>
    </el-card>
    <!-- 对话框 -->
    <el-dialog title="添加素材" :visible.sync="dialogVisible" width="300px">
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        name="image"
        :headers="uploadHeaders"
        :show-file-list="false"
        :on-success="handleSuccess"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import auth from '@/utils/auth'
export default {
  name: 'app-image',
  data () {
    return {
      // 控制對話框顯示隱藏
      dialogVisible: false,
      // 查询条件
      reqParams: {
        collect: false,
        page: 1,
        per_page: 10
      },
      // 素材列表
      images: [],
      // 总条数
      total: 0,
      // 预览图片地址
      imageUrl: null,
      // 上传请求头
      uploadHeaders: {
        Authorization: `Bearer ${auth.getUser().token}`
      }
    }
  },
  created () {
    this.getImages()
  },
  methods: {
    // 上传成功
    handleSuccess () {},
    // 打开对话框
    openDialog () {
      // 1. 准备一个对话框
      // 2. 再来打开对话框
      this.dialogVisible = true
    },
    // 删除函数
    delImage (id) {
      // 确认框
      this.$confirm('亲，您是否要删除该图片素材?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 删除请求
          try {
            await this.$http.delete(`/user/images/${id}`)
            this.$message.success('删除成功')
            this.getImages()
          } catch (e) {
            this.$message.error('删除失败')
          }
        })
        .catch(() => {})
    },
    // 切换添加收藏与取消收藏
    async toggleStatus (item) {
      try {
        const res = await this.$http.put(`/user/images/${item.id}`, {
          collect: !item.is_collected
        })
        // res.data.data.collect 就是当前素材状态
        this.$message.success(
          res.data.data.collect ? '添加收藏成功' : '取消收藏成功'
        )
        // item 就是素材数据  is_collected 显示收藏图标的 颜色
        item.is_collected = res.data.data.collect
      } catch (e) {
        this.$message.error('操作失败')
      }
    },
    // 切换全部与收藏
    changeCollect () {
      this.reqParams.page = 1
      this.getImages()
    },
    // 切换分页
    pager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 获取素材
    async getImages () {
      const res = await this.$http.get('user/images', {
        params: this.reqParams
      })
      this.images = res.data.data.results
      this.total = res.data.data.total_count
    }
  }
}
</script>

<style scoped lang='less'>
// 图片列表
.img-list {
  margin-bottom: 15px;
  .img-item {
    width: 180px;
    height: 180px;
    border: 1px dashed #ddd;
    position: relative;
    margin-top: 20px;
    display: inline-block;
    margin-right: 30px;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
    .option {
      width: 100%;
      height: 30px;
      line-height: 30px;
      background: rgba(0, 0, 0, 0.3);
      position: absolute;
      left: 0;
      bottom: 0;
      text-align: center;
      span {
        color: #fff;
        margin: 0 30px;
      }
      .red {
        color: red;
      }
    }
  }
}
</style>
