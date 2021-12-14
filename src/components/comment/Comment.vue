<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章功能</el-breadcrumb-item>
      <el-breadcrumb-item>评论管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 用户列表区域 -->
      <el-table :data="commentList" border stripe>
        <el-table-column
          label="#"
          prop="id"
          min-width="70"
          show-overflow-tooltip
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          header-align="center"
          label="文章标题"
          prop="articleTitle"
          min-width="70"
          align="center"
        ></el-table-column>
        <el-table-column
          header-align="center"
          label="父评论"
          prop="pcomment"
          min-width="70"
          show-overflow-tooltip
          align="center"
        >
          <template scope="scope">
            <p v-html="scope.row.pcomment"></p>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          label="评论人"
          prop="fromUserName"
          min-width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          header-align="center"
          label="被评论人"
          prop="toUserName"
          min-width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          header-align="center"
          label="内容"
          prop="content"
          min-width="100"
          show-overflow-tooltip
          align="center"
        >
          <template scope="scope">
            <p v-html="scope.row.content"></p>
          </template>
        </el-table-column>
        <el-table-column
          label="创建日期"
          prop="createTime"
          header-align="center"
          align="center"
          min-width="145"
        >
          <template v-slot="scope">
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          min-width="180px"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeComment(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      queryInfo: {
        pageSize: 5,
        pageNum: 1
      },
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '角色名称在2-10之间', trigger: 'blur' }
        ],
        roleSign: [
          { required: true, message: '请输入角色标记', trigger: 'blur' },
          { min: 5, max: 30, message: '角色标记在5-30之间', trigger: 'blur' }
        ]
      },
      roles: [],
      commentList: [],
      total: 0
    }
  },
  methods: {
    async removeComment (id) {
      const { data: res } = await this.$http.delete(
        '/comment/deleteComment/' + id
      )
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.$message.success('删除成功')
      this.getData()
    },
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getData()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getData()
    },
    async getData () {
      const { data: res } = await this.$http.get('/comment/selectComments', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.commentList = res.data.comments.list
      this.total = res.data.comments.total
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      console.log(this.commentList)
    }
  },
  created () {
    this.getData()
  }
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
