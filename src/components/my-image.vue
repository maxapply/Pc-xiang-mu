<template>
  <div class="my-image">
    <!-- 图片按钮 -->
    <div class="img_btn" @click="openDialog()">
      <img :src="imageBtnUrl" alt />
    </div>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" width="750px">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="list">
          <div v-loading="loading">
            <!-- 按钮 -->
            <el-radio-group @change="changeCollect" v-model="reqParams.collect" size="small">
              <el-radio-button :label="false">全部</el-radio-button>
              <el-radio-button :label="true">收藏</el-radio-button>
            </el-radio-group>
            <!-- 列表 -->
            <div class="img-list">
              <div
                @click="selectedImage(item.url)"
                :class="{selected:selectedImageUrl===item.url}"
                class="img-item"
                v-for="item in images"
                :key="item.id"
              >
                <img :src="item.url" alt />
              </div>
            </div>
            <!-- 分页 -->
            <el-pagination
              background
              layout="prev, pager, next"
              hide-on-single-page
              @current-change="pager"
              :current-page="reqParams.page"
              :page-size="reqParams.per_page"
              :total="total"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="upload">
          <!-- 上傳組件 -->
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            name="image"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleSuccess"
          >
            <img v-if="uploadImageUrl" :src="uploadImageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmImage()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import auth from '@/utils/auth'
export default {
  name: 'my-image',
  data () {
    return {
      // 获取素材列表参数对象
      reqParams: {
        collect: false,
        page: 1,
        per_page: 8
      },
      // 素材列表
      images: [],
      // 素材总条数
      total: 0,
      // 加载中
      loading: false,
      // 控制对话框显示隐藏
      dialogVisible: false,
      // 激活tab的名称
      activeName: 'list',
      // 当前选中的素材图片地址
      selectedImageUrl: null,
      // 上传请求头
      uploadHeaders: {
        Authorization: `Bearer ${auth.getUser().token}`
      },
      // 上传的图片
      uploadImageUrl: null,
      // 图片按钮 图片地址
      imageBtnUrl: '../assets/default.png'
    }
  },
  methods: {
    // 确认图片
    confirmImage () {
      // 如何判断此时是激活的  素材库还是上传图片
      if (this.activeName === 'list') {
        // 素材库
        // 校验是否选中图片
        if (!this.selectedImageUrl) return this.$message.warning('请选中一张素材图片')
        // 把选中的图片放到图片按钮位置
        this.imageBtnUrl = this.selectedImageUrl
      } else {
        // 上传图片
        // 校验是否上传图片
        if (!this.uploadImageUrl) return this.$message.warning('请上传一张素材图片')
        // 把上传的图片放到图片按钮位置
        this.imageBtnUrl = this.uploadImageUrl
      }
      // 关闭对话框
      this.dialogVisible = false
    },
    // 上传成功
    handleSuccess (res) {
      this.$message.success('上传成功')
      // 预览
      this.uploadImageUrl = res.data.url
    },
    // 选中图片
    selectedImage (url) {
      this.selectedImageUrl = url
    },
    // 打开对话框
    openDialog () {
      this.dialogVisible = true
      // 打开对话框获取素材列表数据
      // 原因：数据会有变化，用户不用封面
      this.getImages()
      // 重置数据
      // 默认激活第一个选项卡
      this.activeName = 'list'
      this.selectedImageUrl = null
      this.uploadImageUrl = null
    },
    // 切换全部与收藏
    changeCollect () {
      this.reqParams.page = 1
      this.getImages()
    },
    // 分页函数
    pager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 获取图片素材
    async getImages () {
      // 开始加载
      this.loading = true
      // 请求获取数据
      const res = await this.$http.get('user/images', {
        params: this.reqParams
      })
      // 加载完成
      this.loading = false
      // 列表数据
      this.images = res.data.data.results
      // 总条数
      this.total = res.data.data.total_count
    }
  }
}
</script>

<style scoped lang='less'>
// 素材列表
.img-list {
  padding-top: 20px;
  .img-item {
    width: 150px;
    height: 120px;
    border: 1px dashed #ddd;
    display: inline-block;
    margin-right: 20px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
    &.selected::after {
      // .img-item 的后伪元素
      // &符号 less语法，连接符，连接 上一级选择和当前的选择器。
      // 此时不加&：.img-item ::after{}  解析后：后代选择器
      // 加上&符后：.img-item::after{}   解析后：交集选择器
      // .img-item.selected::after{} 满足这个选择器样式生效
      // 当你想选中效果：给.img-item加上selected类即可。
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3) url(../assets/selected.png) no-repeat
        center/ 50px auto;
    }
  }
}
// 组件容器
.my-image {
  display: inline-block;
  margin-right: 20px;
}
// 图片按钮
.img_btn {
  width: 150px;
  height: 150px;
  border: 1px dashed #ddd;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
