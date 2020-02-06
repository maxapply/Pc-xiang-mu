<template>
  <!-- 全屏容器 -->
  <div class='container-login'>
    <!-- 卡片 -->
    <el-card class="my-card">
      <img src="../../assets/logo_index.png" alt="">
      <!-- 表单 -->
      <el-form :model="loginForm">
        <el-form-item>
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="loginForm.code" placeholder="请输入验证码" style="width:240px;margin-right:8px"></el-input>
          <el-button>发送验证码</el-button>
        </el-form-item>
        <el-form-item>
          <!-- :value="true" 选中复选框不能进行修改  必须同意 -->
          <el-checkbox :value="true">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'app-login',
  data () {
    return {
      // 表单对应的数据对象
      loginForm: {
        mobile: '',
        code: ''
      }
    }
  }
}
</script>

<style scoped lang='less'>
.container-login{
  width: 100%;
  height: 100%;
  // 设置我的容器绝对定位  依赖窗口的高度和宽度
  position: absolute;
  top: 0;
  left: 0;
  background: url(../../assets/login_bg.jpg) no-repeat;
  // 让背景图等比例缩放 去铺满容器
  background-size: cover;
  .my-card{
    width: 400px;
    height: 350px;
    transform: translate(-50%,-60%);
    position: absolute;
    left: 50%;
    top: 50%;
    img{
      width: 200px;
      display: block;
      margin: 0 auto 20px
    }
  }
}
</style>
