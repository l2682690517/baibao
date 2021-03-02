<template>
  <div>
    <div v-loading="loading">
      <el-breadcrumb >
        <el-breadcrumb-item>管理员</el-breadcrumb-item>
      </el-breadcrumb>

        <el-form  :inline="true">
          <el-form-item label="用户名:">
            <el-input v-model="searchName" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="手机号:">
            <el-input v-model="searchMobile" placeholder=""></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="_search">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-form  :inline="true">
          <el-form-item >
            <el-button class="create" type="primary" icon="el-icon-plus" @click="_createSysUser">创建</el-button>
          </el-form-item>
        </el-form>

      <div>
        <el-table :data="sysUsers.data" border>
          <el-table-column label="用户名" prop="name">
          </el-table-column>
          <el-table-column label="手机号" prop="mobile">
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button size="mini" @click="_handleEdit(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.enabled" size="mini" type="danger" @click="_denySysUser(scope.row)">禁用</el-button>
              <el-button v-else size="mini" type="primary" @click="_allowSysUser(scope.row)">启用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper" v-show="sysUsers.total>searchForm.limit">
        <el-pagination
          layout="total, prev, pager, next"
          :total="sysUsers.total"
          :current-page=searchForm.page
          :page-size="searchForm.limit"
          @current-change="_changePage">
        </el-pagination>
      </div>
    </div>
    <edit-manager-dialog ref="editManagerDialog"
                         :mode="dialogMode"
                         :edit-id="currentEditId"
                         @updated="_updateSuccess"
                         @created="_createdSuccess">
    </edit-manager-dialog>
  </div>
</template>

<script>
  import SysUserApi from '../../api/sysuser'

  import EditManagerDialog from './EditSysUserDialog'

  export default {
    data() {
      return {
        loading: false,
        searchName: '',
        searchMobile: '',
        searchForm: {
          name: '',
          mobile: '',
          page: 1,
          limit: 10
        },
        sysUsers: {},
        dialogMode: EditManagerDialog.MODE_EDIT,
        currentEditId: 0
      }
    },
    components: {
      EditManagerDialog
    },
    methods: {
      _handleEdit(row) {
        this.dialogMode = EditManagerDialog.MODE_EDIT
        this.currentEditId = row.id
        this.$refs.editManagerDialog.show()
      },
      _search() {
        this.searchForm.name = this.searchName
        this.searchForm.mobile = this.searchMobile
        this._goFirstPageAndRefreshFormData()
      },
      _changePage (current) {
        this.searchForm.page = current
        this._refreshFormData()
      },
      _refreshFormData() {
        this.loading = true
        SysUserApi.getSysUserList(this.searchForm)
          .then((res) => {
            this.loading = false
            this.sysUsers = res.data
            this.searchName = this.searchForm.name
            this.searchMobile = this.searchForm.mobile
          })
          .catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err, '查询失败')
          })
      },
      _goFirstPageAndRefreshFormData() {
        if (this.searchForm.page === 1) {
          this._refreshFormData()
        } else {
          this.searchForm.page = 1
        }
      },
      _goLastPageAndRefreshFormData() {
        let targetPage = 1
        if (this.sysUsers && this.sysUsers.total) {
          targetPage = Math.ceil(this.sysUsers.total / this.searchForm.limit)
        }
        if (this.searchForm.page === targetPage) {
          this._refreshFormData()
        } else {
          this.searchForm.page = targetPage
        }
      },
      _createSysUser() {
        this.dialogMode = EditManagerDialog.MODE_CREATE
        this.$refs.editManagerDialog.show()
      },
      _updateSuccess() {
        this._refreshFormData()
      },
      _createdSuccess() {
        this._goFirstPageAndRefreshFormData()
      },
      _updateMangerPermission(managerData, isEnabled) {
        let msg = isEnabled ? `要启用'${managerData.name}', 是否继续?` : `要禁用'${managerData.name}', 是否继续?`
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          SysUserApi.enableManager(managerData.id, isEnabled)
            .then((res) => {
              this.loading = false
              managerData.enabled = isEnabled
              this.$message({
                type: 'success',
                message: '操作成功'
              })
            })
            .catch((err) => {
              this.loading = false
              this.$myErrorHandler.handle(this, err, '操作失败')
            })
        }).catch(() => {
        })
      },
      _allowSysUser(managerData) {
        this._updateMangerPermission(managerData, true)
      },
      _denySysUser(managerData) {
        this._updateMangerPermission(managerData, false)
      }
    },
    created() {
      this._refreshFormData()
    }
  }
</script>

<style scoped lang="less">
  .pager-wrapper {
    text-align: center;
    margin-top: 10px;
  }

</style>
