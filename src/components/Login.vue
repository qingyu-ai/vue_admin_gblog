<template>
  <div class="login_container">
    <div class="login_Box">
      <!-- 头像 -->
      <div class="avatar_Box">
        <img src="../assets/logo.png" />
      </div>
      <!-- 表单 -->
      <el-form
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item label class="btns">
          <el-button type="primary" @click="login()">登录</el-button>
          <el-button type="info" @click="resetLoginForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="验证码"
      class=".el-dialog"
      :visible.sync="dialogVisible"
      width="30%"
      top="32vh"
      center
    >
      <div class="t">
        <slide-verify
          class="verify"
          ref="slideblock"
          @again="onAgain"
          @fulfilled="onFulfilled"
          @success="onSuccess"
          @fail="onFail"
          @refresh="onRefresh"
          :accuracy="accuracy"
          :slider-text="text"
          :imgs="imgList"
        ></slide-verify>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      dialogVisible: false,
      msg: '',
      text: '向右滑',
      // 精确度小，可允许的误差范围小；为1时，则表示滑块要与凹槽完全重叠，才能验证成功。默认值为5
      accuracy: 15,
      imgList: [
        'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=173105354,4176936206&fm=26&gp=0.jpg'
      ],
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 17, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 13, message: '长度在 3 到 13 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['setToken']),
    login () {
      this.dialogVisible = true
    },

    // 重置表单函数
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    onSuccess (times) {
      this.msg = `验证成功, 耗时${(times / 1000).toFixed(1)}s`
      this.$message.success(this.msg)
      this.dialogVisible = false
      const qs = require('qs')
      const data = qs.stringify({
        username: this.loginForm.username,
        password: this.loginForm.password
      })
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: result } = await this.$http.post('login', data)
        if (result.code !== 200) {
          this.$message.error(result.msg)
          return false
        } else {
          // window.sessionStorage.setItem('token', result.token)
          window.localStorage.setItem('token', JSON.stringify(result.token))
          this.setToken(result.token)
          this.$router.push('/home')
        }
      })
    },
    onFail () {
      this.msg = '验证不通过'
    },
    onRefresh () {
      this.msg = '点击了刷新小图标'
    },
    onFulfilled () {
      console.log('刷新成功啦！')
    },
    onAgain () {
      console.log('检测到非人为操作的哦！')
      this.msg = 'try again'
      // 刷新
      this.$refs.slideblock.reset()
    },
    handleClick () {
      // 父组件直接可以调用刷新方法
      this.$refs.slideblock.reset()
    }
  }
}
</script>
<style lang="less" scoped>
.el-dialog {
  text-align: center;
}
.btns {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.login_container {
  background-color: #487eb0;
  height: 100%;
  .login_Box {
    position: relative;
    width: 450px;
    height: 300px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #f1f2f6;
    border-radius: 8px;
    .avatar_Box {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 130px;
      height: 130px;
      border: 1px solid #eeeeee;
      border-radius: 50%;
      padding: 10px;
      overflow: hidden;
      box-shadow: 0 0 10px #dddddd;
      background-color: #f1f2f6;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #c7ecee;
      }
    }
  }
}

.verify {
  display: inline-block;
}
.t {
  text-align: center;
}
</style>
