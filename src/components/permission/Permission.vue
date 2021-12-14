<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础功能</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-input
            v-model="addForm.name"
            placeholder="请输入权限名"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="addForm.path"
            placeholder="请输入权限地址"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addPermission">添加权限</el-button>
        </el-col>
      </el-row>
      <el-table :data="permissionList" border stripe>
        <el-table-column
          label="#"
          prop="id"
          min-width="70"
          show-overflow-tooltip
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          label="权限名"
          prop="name"
          min-width="70"
          show-overflow-tooltip
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          label="权限地址"
          prop="path"
          min-width="160"
          show-overflow-tooltip
          header-align="center"
          align="center"
        ></el-table-column>
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
          label="修改日期"
          prop="modifyTime"
          header-align="center"
          align="center"
          width="145"
        >
          <template v-slot="scope">
            {{ scope.row.modifyTime | dateFormat }}
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
              effect="dark"
              content="修改"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removePermissionById(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="selectQuery.pageNum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="selectQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 修改角色模态框 -->
    <el-dialog title="修改权限" :visible.sync="editDialogVisible" width="50%">
      <!-- 内容主题区域 -->
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="90px"
      >
        <el-form-item label="权限名" prop="name">
          <el-input
            v-model="editForm.name"
            placeholder="请输入权限名"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限地址" prop="path">
          <el-input
            v-model="editForm.path"
            placeholder="请输入权限地址"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPermission">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      editDialogVisible: false,
      permissionDialogVisible: false,
      selectQuery: {
        pageSize: 5,
        pageNum: 1
      },
      permissionData: [],
      addForm: {},
      editForm: {},
      permissionForm: {
        permissionIdList: []
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入权限名', trigger: 'blur' },
          { min: 2, max: 10, message: '权限名在2-10之间', trigger: 'blur' }
        ],
        path: [{ required: true, message: '请输入权限地址', trigger: 'blur' }]
      },
      permissionList: [],
      total: 0
    }
  },
  methods: {
    async removePermissionById (id) {
      // 弹框
      const res = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
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
        return this.$message('取消删除')
      }
      const { data: user } = await this.$http.delete(
        '/permission/deletePermission/' + id
      )
      if (user.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.$message.success('删除权限成功')
      this.getData()
    },
    async editPermission () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.put(
          '/permission/updatePermission',
          {
            id: this.editForm.id,
            name: this.editForm.name,
            path: this.editForm.path
          }
        )
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        }
        this.editDialogVisible = false
        this.getData()
        this.$message.success('更新成功')
      })
    },
    showEditDialog (row) {
      this.editDialogVisible = true
      this.editForm = row
    },
    async getData () {
      const { data: res } = await this.$http.get(
        '/permission/selectPermission',
        {
          params: this.selectQuery
        }
      )
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.permissionList = res.data.permissionList.list
      this.total = res.data.permissionList.total
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
    },
    handleSizeChange (newSize) {
      this.selectQuery.pageSize = newSize
      this.getData()
    },
    handleCurrentChange (newPage) {
      this.selectQuery.pageNum = newPage
      this.getData()
    },
    async addPermission () {
      if (this.addForm.name.trim() !== '' && this.addForm.name.trim() !== '') {
        const { data: res } = await this.$http.post(
          '/permission/insertPermission',
          this.addForm
        )
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        }
        this.$message.success('添加成功')
        this.getData()
        this.addForm = {}
      }
    },
    resAddForm () {
      this.$refs.addFormRef.resetFields()
      this.addForm = {}
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
