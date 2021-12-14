<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础功能</el-breadcrumb-item>
      <el-breadcrumb-item>线上管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 用户列表区域 -->
      <el-table :data="onlineList" border stripe>
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
          label="用户名"
          prop="username"
          min-width="70"
          align="center"
        ></el-table-column>
        <el-table-column
          header-align="center"
          label="真实姓名"
          prop="personName"
          min-width="70"
          align="center"
        ></el-table-column>
        <el-table-column
          header-align="center"
          label="邮箱"
          prop="email"
          min-width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          header-align="center"
          label="电话"
          prop="mobile"
          min-width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          label="角色"
          prop="roleList"
          show-overflow-tooltip
          header-align="center"
          min-width="250"
          align="center"
          :filters="roles"
          :filter-method="filterTag"
        >
          <template slot-scope="scope">
            <el-tag
              type="primary"
              v-for="item in scope.row.roleList"
              :key="item.id"
              size="mini"
              >{{ item }}</el-tag
            >
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
          label="最后登录日期"
          prop="lastLoginTime"
          header-align="center"
          align="center"
          width="145"
        >
          <template v-slot="scope">
            {{ scope.row.lastLoginTime | dateFormat }}
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
              content="强退"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-s-release"
                size="medium"
                @click="downLine(scope.row.id)"
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
import { mapActions } from 'vuex'
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
      onlineList: [],
      total: 0
    }
  },
  methods: {
    ...mapActions(['selectRoleList']),
    async downLine (id) {
      const { data: res } = await this.$http.put('/user/downLine/' + id)
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.$message.success('强制下线成功')
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
    filterTag (value, row) {
      return row.roleList.indexOf(value) !== -1
    },
    async getData () {
      const { data: res } = await this.$http.get('/user/findOnlineUser', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.onlineList = res.data.onlineUsers.list
      this.total = res.data.onlineUsers.total
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.roleList = this.$store.getters.showRoleList
      this.roles = []
      this.roleList.forEach(item => {
        this.t = { text: item.roleName, value: item.roleName }
        this.roles.push(this.t)
      })
    }
  },
  created () {
    this.selectRoleList()
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
