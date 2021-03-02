<template>
  <div class="list">
    <el-table :data="allServiceTag" row-key="id" border :show-header="false" v-loading="loading">
      <el-table-column label="" prop="name" width="199">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">{{scope.row.name}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <edit-dialog ref="dlgEdit" @created="refresh" @updated="refresh"></edit-dialog>
  </div>
</template>

<script>
  import * as ServiceTagApi from 'src/api/servicetag'
  import EditDialog from './Edit'

  export default {
    components: {
      EditDialog
    },
    data() {
      return {
        loading: false
      }
    },
    computed: {
      allServiceTag() {
        return this.$store.state.servicetag.allServiceTag
      }
    },
    methods: {
      async refresh() {
        try {
          this.loading = true
          await ServiceTagApi.getList()
          this.loading = false
        } catch (e) {
          this.loading = false
          this.$myErrorHandler.handle(this, e)
        }
      },
      async del(row) {
        this.$confirm('确认要删除?', '提示').then(async () => {
          try {
            this.loading = true
            await ServiceTagApi.delItem(row.id)
            this.refresh()
          } catch (e) {
            this.loading = false
            this.$myErrorHandler.handle(this, e)
          }
        }, () => {
        })
      },
      create() {
        this.$refs.dlgEdit.show(EditDialog.MODE_CREATE)
      },
      edit(row) {
        this.$refs.dlgEdit.show(EditDialog.MODE_EDIT, row.id)
      }
    },
    activated() {
      this.refresh()
    }
  }
</script>

<style lang="less" scoped>

  .list {
    width: 300px;
    padding-top: 20px;
  }

</style>
