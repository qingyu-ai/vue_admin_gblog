<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>仪表盘</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="15">
        <el-col :span="12">
          <div class="table" style="background-color: #18b5f9">
            <el-row type="flex" justify="space-between" align="middle">
              <el-col :span="3">
                <div class="round">
                  <i class="el-icon-edit ic"></i>
                </div>
              </el-col>
              <el-col :span="3">
                <span>发表了</span>
                <h3 v-text="article"></h3>
                <span>篇文章</span>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="table" style="background-color: #7e53c5 ">
            <el-row type="flex" justify="space-between" align="middle">
              <el-col :span="3">
                <div class="round">
                  <i class="el-icon-s-custom ic"></i>
                </div>
              </el-col>
              <el-col :span="3">
                <span>创建了</span>
                <h3 v-text="user"></h3>
                <span>个用户</span>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <div style="margin-top: 15px;">
        <el-row :gutter="15">
          <el-col :span="12">
            <div class="table" style="background-color: #28b969 ">
              <el-row type="flex" justify="space-between" align="middle">
                <el-col :span="3">
                  <div class="round">
                    <i class="el-icon-chat-dot-round ic"></i>
                  </div>
                </el-col>
                <el-col :span="3">
                  <span>收到了</span>
                  <h3 v-text="comment"></h3>
                  <span>条评论</span>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="table" style="background-color: #6d8ada">
              <el-row type="flex" justify="space-between" align="middle">
                <el-col :span="3">
                  <div class="round">
                    <i class="el-icon-set-up ic"></i>
                  </div>
                </el-col>
                <el-col :span="3">
                  <span>提供了</span>
                  <h3 v-text="category"></h3>
                  <span>种分类</span>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      user: 0,
      article: 0,
      comment: 0,
      category: 0
    }
  },
  methods: {},
  async created () {
    const { data: user } = await this.$http.get('commonAdmin/userCount')
    this.user = user.data
    const { data: article } = await this.$http.get('commonAdmin/articleCount')
    this.article = article.data
    const { data: category } = await this.$http.get('commonAdmin/categoryCount')
    this.category = category.data
    const { data: comment } = await this.$http.get('commonAdmin/commentCount')
    this.comment = comment.data
  }
}
</script>
<style lang="less" scoped>
.round {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 1px solid #ffffff;
  text-align: center;
  box-sizing: border-box;
  margin-left: 25px;
  background: rgba(0, 0, 0, 0.2);
}
.table {
  height: 180px;
  border-radius: 8px;
}
.el-row {
  height: 100%;
}
.el-col span {
  font-size: 18px;
}
.el-col h3 {
  margin: 0;
  font-size: 30px;
}
.ic {
  font-size: 45px;
  line-height: 80px;
  color: #eee;
}
</style>
