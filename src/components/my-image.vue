<template>
  <div class="my-image">
    <!-- 图片按钮 -->
    <div class="img_btn" @click="openDialog()">
      <img src="../assets/default.png" alt />
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
        <el-tab-pane label="上传图片" name="upload">2</el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
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
      selectedImageUrl: null
    }
  },
  methods: {
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
