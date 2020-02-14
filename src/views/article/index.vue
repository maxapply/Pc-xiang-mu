<template>
  <div class="container-article">
    <!-- 筛选区域 -->
    <el-card>
      <!-- 面包屑 -->
      <div slot="header">
        <!-- 自己面包屑组件 -->
        <my-bread>内容管理</my-bread>
      </div>
      <!-- 表单 -->
      <el-form label-width="80px" size="small">
        <el-form-item label="状态：">
          <el-radio-group v-model="filterData.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道：">
          <!-- 使用自己封装组件 -->
          <my-channel v-model="filterData.channel_id"></my-channel>
          <!-- <my-channel :value="filterData.channel_id" @input="filterData.channel_id=$event"></my-channel> -->
        </el-form-item>
        <el-form-item label="日期：">
          <el-date-picker
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="search()" type="primary">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 结果区域 -->
    <el-card style="margin-top:20px">
      <div slot="header">根据筛选条件共查询到 {{total}} 条结果：</div>
      <!-- 表格 -->
      <el-table :data="articles">
        <el-table-column label="封面">
          <!-- cover:{type:'',images:[]} 取第一张图片进行预览-->
          <template slot-scope="scope">
            <el-image :src="scope.row.cover.images[0]" style="width:150px;height:100px">
              <div slot="error">
                <img src="../../assets/error.gif" style="width:150px;height:100px" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status===0" type="info">草稿</el-tag>
            <el-tag v-if="scope.row.status===1">待审核</el-tag>
            <el-tag v-if="scope.row.status===2" type="success">审核通过</el-tag>
            <el-tag v-if="scope.row.status===3" type="warning">审核失败</el-tag>
            <el-tag v-if="scope.row.status===4" type="danger">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="pubdate"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button @click="toEditArticle(scope.row.id)" plain type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="delArticle(scope.row.id)" plain type="danger" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- total 指定总条数 -->
      <!-- page-size 设置每一页显示多少条，默认是10条 -->
      <!-- cyrrent-page 指定当前是第几页 -->
      <!-- current-change 是事件  pager 是函数 -->
      <el-pagination
        style="margin-top:20px"
        background
        layout="prev, pager, next"
        @current-change="pager"
        :current-page="filterData.page"
        :page-size="filterData.per_page"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  // 注意：组件名称不能和原生标签重名
  name: 'app-article',
  data () {
    return {
      articles: [],
      total: 0,
      // 声明筛选条件数据，筛选条件数据提交给后台，数据的字段名称，由后台接口决定。
      // 筛选数据是由多个表单元素组成，需要收集所有数据，应该使用对象来进行绑定
      filterData: {
        // 当字段的值null，axios请求不会提交，代表不传
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null,
        page: 1,
        per_page: 20
      },
      // 频道下拉选项数据
      channelOptions: [],
      // 日期范围数据 [起始日期,结束日期]
      // 但是选择完成日期范围后，可以根据这个数据给 begin_pubdate end_pubdate 赋值。
      dateArr: []
    }
  },
  created () {
    // this.getChannelOptions()
    this.getArticles()
  },
  methods: {
    // 删除文章
    delArticle (id) {
      // 确认框
      this.$confirm('亲，您是否要删除该篇文章?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 删除请求
        try {
          // 13911111111 账号是测试账号，无法删除数据。
          await this.$http.delete(`articles/${id}`)
          this.$message.success('删除成功')
          this.getArticles()
        } catch (e) {
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },
    // 去编辑文章
    toEditArticle (id) {
      this.$router.push(`/publish?id=${id}`)
    },
    // 频道改变后
    // changeChannel () {
    //   if (this.filterData.channel_id === '') {
    //     this.filterData.channel_id = null
    //   }
    // },
    // 筛选逻辑
    search () {
      this.filterData.page = 1
      this.getArticles()
    },
    // 选择日期范围
    changeDate (dateArr) {
      // 默认参数 dateArr [起始日期,结束日期]  日期默认是Date类型
      // 但是后台需要的数据 字符串类型  例如：2010-01-01
      // 赋值之前：对dateArr中的日期进行格式的转换
      // 文档：可受 value-format 控制，通过这个数据指定组件产生的日期格式 yyyy-MM-dd
      // 当使用组件的 清空功能，也会触发changeDate函数，改变成null === dateArr
      if (dateArr) {
        this.filterData.begin_pubdate = dateArr[0]
        this.filterData.end_pubdate = dateArr[1]
      } else {
        this.filterData.begin_pubdate = null
        this.filterData.end_pubdate = null
      }
    },
    // 分页切
    pager (newPage) {
      // 修改参数
      this.filterData.page = newPage
      this.getArticles()
    },
    // // 获取频道数据
    // async getChannelOptions () {
    //   // 发请求获取频道数据
    //   const res = await this.$http.get('channels')
    //   // res = {data:{message:'',data:{channels:[// 频道数组 ]}}}
    //   // this.channelOptions = [{id,name}]  数据格式
    //   this.channelOptions = res.data.data.channels
    // },
    // 获取文章数据
    async getArticles () {
      // post('地址','请求体数据')
      // 如果是get请求，如何传递参数对象 get('地址',{params:'get对象参数'})
      const res = await this.$http.get('articles', { params: this.filterData })
      this.articles = res.data.data.results
      // 设置总条数
      this.total = res.data.data.total_count
    }
  }
}
</script>

<style scoped lang='less'></style>
