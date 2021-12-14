<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统功能</el-breadcrumb-item>
      <el-breadcrumb-item>广播 / 公告</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-form
            ref="messageFormRef"
            :model="messageForm"
            label-width="100px"
          >
            <el-form-item label="广播内容">
              <el-input
                type="textarea"
                v-model="messageForm.content"
              ></el-input>
            </el-form-item>
            <el-form-item label="发送离线用户">
              <el-switch v-model="messageForm.offline" active-color="#13ce66">
              </el-switch>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="onSubmit">发布广播</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      messageForm: {
        content: '',
        offline: false
      }
    }
  },
  methods: {
    async onSubmit () {
      const { data: res } = await this.$http.post(
        '/sys-message/sendMessage',
        this.messageForm
      )
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.messageForm = {}
      this.$message.success('广播成功')
    }
  },
  created () {}
}
</script>
<style lang="less" scoped>
.permission {
  display: flex;
  .el-tag {
    flex: 1;
    margin: 0 70px 5px;
    text-align: center;
    font-size: 14px;
  }
}
</style>
