<template>
  <div class="list">
    <el-table :data="$store.state.servicetaggroup.allServiceTagGroup" row-key="id" border :show-header="false"
              v-loading="loading">
      <el-table-column label="" prop="name">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">{{scope.row.name}}</el-button>
        </template>
      </el-table-column>

      <el-table-column label="" prop="">
        <template slot-scope="scope">
          <span>{{scope.row.selected_count}}款商品</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100px">
        <template slot-scope="scope">
          <div>
            <el-button size="mini" type="danger" @click="del(scope.row)"
                       v-if="scope.row.selected_count === 0">删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <edit-dialog ref="dlgEdit" @created="refresh" @updated="refresh"></edit-dialog>
  </div>
</template>

<script>
  import * as ServiceTagGroupApi from 'src/api/servicetaggroup'
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
    computed: {},
    methods: {
      async refresh() {
        try {
          this.loading = true
          await ServiceTagGroupApi.getList()
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
            await ServiceTagGroupApi.delItem(row.id)
            this.refresh()
          } catch (e) {
            this.loading = false
            this.$myErrorHandler.handle(this, e)
          }
        }).catch(() => {

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
    width: 430px;
    padding-top: 20px;
  }

</style>
