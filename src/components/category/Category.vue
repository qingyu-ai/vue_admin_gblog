<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础功能</el-breadcrumb-item>
      <el-breadcrumb-item>线上管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input
            v-model="insertFrom.title"
            placeholder="请输入分类名"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-input-number
            v-model="insertFrom.sort"
            :min="1"
            :max="10"
            label="排序"
          ></el-input-number>
        </el-col>
        <el-col :span="5"
          ><el-button type="primary" @click="insertCategory"
            >添加分类</el-button
          ></el-col
        >
      </el-row>
      <el-table :data="categories" border stripe>
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
          label="分类名"
          prop="title"
          min-width="70"
          align="center"
        ></el-table-column>
        <el-table-column
          header-align="center"
          label="排序"
          prop="sort"
          min-width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          label="创建日期"
          prop="createTime"
          header-align="center"
          align="center"
        >
          <template v-slot="scope">
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column
          label="更新时间"
          prop="modifyTime"
          header-align="center"
          align="center"
        >
          <template v-slot="scope">
            {{ scope.row.updateTime | dateFormat }}
          </template>
        </el-table-column>

        <el-table-column label="操作" header-align="center" align="center">
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
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
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
                @click="deleteCategory(scope.row.id)"
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
    <!-- 修改分类模态框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="resEditDialogVisible"
    >
      <el-form :model="editForm" ref="editFormRef" label-width="70px">
        <el-form-item label="分类名">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number
            v-model="editForm.sort"
            :min="1"
            :max="10"
            label="排序"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      article: {},
      queryInfo: {
        pageSize: 5,
        pageNum: 1
      },
      insertFrom: {
        sort: 1,
        title: ''
      },
      editForm: {},
      categories: [],
      total: 0,
      editDialogVisible: false
    }
  },
  methods: {
    editCategory () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.put(
          '/category/updateCategory/',
          {
            id: this.editForm.id,
            name: this.editForm.name,
            sort: this.editForm.sort
          }
        )
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        }
        this.editDialogVisible = false
        this.getData()
        this.$message.success('更新分类成功')
      })
    },
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('/category/categoryById/' + id)
      if (res.code !== 200) {
        return this.$message.error('信息获取失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    resEditDialogVisible () {
      this.$refs.editFormRef.resetFields()
      this.editDialogVisible = false
    },
    async deleteCategory (id) {
      const { data: res } = await this.$http.delete(
        '/category/deleteCategory/' + id
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
      const { data: res } = await this.$http.get(
        '/commonAdmin/selectCategories',
        {
          params: this.queryInfo
        }
      )
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.categories = res.data.list
      this.total = res.data.total
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
    },

    async insertCategory () {
      const formData = new FormData()
      formData.append('title', this.insertFrom.title)
      formData.append('sort', this.insertFrom.sort)

      const { data: res } = await this.$http.post(
        '/category/insertCategory',
        formData
      )
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.$message.success('添加成功')
      this.insertFrom = {}
      this.getData()
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
