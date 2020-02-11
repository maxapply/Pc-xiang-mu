<template>
  <div class="container-article">
    <!-- 筛选区域 -->
    <el-card>
      <!-- 面包屑 -->
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <!-- :to="{ path: '/' }" 和 router-link to 属性一致  -->
          <!-- { path: '/' } 使用对象和  to="/"  作用一致 -->
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 表单 -->
      <el-form label-width="80px">
        <el-form-item label="状态："></el-form-item>
        <el-form-item label="频道："></el-form-item>
        <el-form-item label="日期："></el-form-item>
        <el-form-item></el-form-item>
      </el-form>
    </el-card>
    <!-- 筛选结果 -->
  </div>
</template>

<script>
export default {
  // 注意：组件名称不能和原生标签重名
  name: 'app-article'
}
</script>

<style scoped lang='less'></style>
