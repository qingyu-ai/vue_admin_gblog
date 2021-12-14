<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础功能</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图  -->
    <el-card>
      <el-row :gutter="5">
        <el-col :span="3">
          <!-- 搜索 -->
          <el-input
            placeholder="请输入id"
            v-model="queryInfo.id"
            clearable
            @clear="getUserList"
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <!-- 搜索 -->
          <el-input
            placeholder="请输入真实姓名"
            v-model="queryInfo.personName"
            clearable
            @clear="getUserList"
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-input
            placeholder="请输入用户名"
            v-model="queryInfo.username"
            clearable
            @clear="getUserList"
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-input
            placeholder="请输入电话"
            v-model="queryInfo.mobile"
            clearable
            @clear="getUserList"
          >
          </el-input>
        </el-col>

        <el-col :span="1">
          <el-button
            icon="el-icon-search"
            circle
            @click="getUserList"
          ></el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
        <el-col :span="2">
          <a id="linkUrl" @click="exportExcel" title="下载">
            <el-button type="primary">导出表格</el-button>
          </a>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
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
          label="状态"
          prop="status"
          header-align="center"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              inactive-color="#ff4949"
              active-color="#13ce66"
              @change="userStateChange(scope.row)"
            ></el-switch>
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
              content="修改"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
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
    <!-- 添加模态框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      @open="openAddFrom()"
      width="50%"
      @close="resAddForm()"
    >
      <!-- 内容主题区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="姓名" prop="personName">
          <el-input v-model="addForm.personName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            v-model="addForm.roleList"
            placeholder="不选默认为普通员工"
            multiple
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户模态框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="resEditDialogVisible"
    >
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="真实姓名">
          <el-input v-model="editForm.personName" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClose"
    >
      <div>
        <p>当前用户：{{ userInfo.personName }}</p>
        <p>当前角色：{{ userInfo.roleList }}</p>
        <p>
          分配新角色：

          <el-select
            v-model="selectedRoleId"
            placeholder="不选默认为普通员工"
            multiple
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data () {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法邮箱'))
    }
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确手机号'))
    }
    return {
      queryInfo: {
        pageNum: 1,
        pageSize: 5,
        selectedRoleId: []
      },
      status: true,
      selectedRoleId: [],
      roleList: [],
      userInfo: {},
      userList: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        personName: '',
        email: '',
        mobile: '',
        roleList: ''
      },
      roles: [],
      setRoleDialogVisible: false,
      addFormRules: {
        personName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          { min: 3, max: 10, message: '真实姓名在3-10之间', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名在3-10之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码在6-16之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {}
    }
  },
  created () {
    this.selectRoleList()
    this.getUserList()
  },
  methods: {
    ...mapActions(['selectRoleList']),
    async exportExcel () {
      const link = document.getElementById('linkUrl')
      const fileName = '用户数据表'
      link.href =
        `http://www.hmetao.cn:9002/hmetao_blog/user/excel/exportExcel?token=${JSON.parse(window.localStorage.getItem('token'))}&fileName=` + fileName
      link.click()
    },
    filterTag (value, row) {
      return row.roleList.indexOf(value) !== -1
    },
    openAddFrom () {
      this.roleList = this.$store.getters.showRoleList
    },
    async getUserList () {
      const { data: res } = await this.$http.get('/user/findUserList', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        return this.$message.error('获取失败')
      }
      this.userList = res.data.list
      this.total = res.data.total
      this.roleList = this.$store.getters.showRoleList
      this.roles = []
      this.roleList.forEach(item => {
        this.t = { text: item.roleName, value: item.roleName }
        this.roles.push(this.t)
      })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getUserList()
      console.log(newPage)
    },
    async userStateChange (userInfo) {
      const { data: res } = await this.$http.put(
        `/user/updateStatus/${userInfo.id}/${userInfo.status}`
      )
      if (res.code !== 200) {
        userInfo.status = !userInfo.status
        return this.$message.error(res.msg)
      }
      this.$message.success('更新成功')
    },
    resAddForm () {
      this.addForm.roleList = ''
      this.$refs.addFormRef.resetFields()
    },
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post(
          '/user/insertUser',
          this.addForm
        )
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        }
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('/user/userInfoById/' + id)
      if (res.code !== 200) {
        return this.$message.error('信息获取失败')
      }
      this.editForm = res.data.user
      this.editDialogVisible = true
    },
    resEditDialogVisible () {
      this.$refs.editFormRef.resetFields()
      this.editDialogVisible = false
    },
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.put('/user/updateUser/', {
          id: this.editForm.id,
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        }
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('更新用户成功')
      })
    },
    async removeUserById (id) {
      // 弹框
      const res = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 如果点击取消则返回cancel
      // 如果点去确定返回confirm
      if (res !== 'confirm') {
        return this.$message('已经取消删除')
      }
      const { data: user } = await this.$http.delete('/user/deleteUser/' + id)
      if (user.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    },
    async setRole (UserInfo) {
      this.userInfo = UserInfo
      this.roleList = this.$store.getters.showRoleList
      this.setRoleDialogVisible = true
    },
    async saveRoleInfo () {
      const { data: res } = await this.$http.put('/user/updateUserRoleList', {
        roleList: this.selectedRoleId,
        id: this.userInfo.id
      })
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.$message.success('更新用户成功')
      this.getUserList()
      this.setRoleDialogVisible = false
      this.roleList = ''
    },
    setRoleDialogClose () {
      this.selectedRoleId = ''
      this.userInfo = ''
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 3px 10px;
  text-align: center;
}
</style>
