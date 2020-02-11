<template>
  <div class="container-article">
    <!-- 筛选区域 -->
    <el-card>
      <!-- 面包屑 -->
      <div slot="header">
        <!-- 自己面包屑组件 -->
        <my-bread>素材管理</my-bread>
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
          <el-select v-model="filterData.channel_id" placeholder="请选择">
            <el-option
              v-for="item in channelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
            <!-- label 选项文字  value 选项的值 当你选择某个选项后，该选项的值提供v-model -->
          </el-select>
        </el-form-item>
        <el-form-item label="日期：">
          <el-date-picker
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 筛选结果 -->
    <my-test>
      <!-- slot="up" 指定插槽名称 -->
      <!-- slot-scope 指定插槽作用域数据（绑定在slot标签上的所有数据）名称 -->
      <!-- data 是变量名，规范变量名：scope 作用域插槽数据 -->
      <!-- <div slot="up" slot-scope="scope">上面内容 {{scope.age}}{{scope.gender}}{{scope.msg}}</div> -->
      <!-- v-slot:插槽名称="作用域插槽数据名称"  固定格式 -->
      <!-- v-slot can only be used on components or <template>. 只能在组件或template中使用 -->
      <template v-slot:up="scope">
        上面内容 {{scope.age}}{{scope.gender}}{{scope.msg}}
      </template>
      <div slot="down">下面内容</div>
    </my-test>
  </div>
</template>

<script>
import MyTest from '@/components/my-test'
import MyBread from '@/components/my-bread'
export default {
  components: { MyTest, MyBread },
  // 注意：组件名称不能和原生标签重名
  name: 'app-article',
  data () {
    return {
      // 声明筛选条件数据，筛选条件数据提交给后台，数据的字段名称，由后台接口决定。
      // 筛选数据是由多个表单元素组成，需要收集所有数据，应该使用对象来进行绑定
      filterData: {
        // 当字段的值null，axios请求不会提交，代表不传
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null
      },
      // 频道下拉选项数据
      channelOptions: [
        { label: '前端', value: 1 },
        { label: '数据库', value: 2 }
      ],
      // 日期范围数据 [起始日期,结束日期]
      // 但是选择完成日期范围后，可以根据这个数据给 begin_pubdate end_pubdate 赋值。
      dateArr: []
    }
  }
}
</script>

<style scoped lang='less'></style>
