<template>
  <div class="list">
    <div class="title">
      <el-button size="medium" type="primary" icon="el-icon-plus" @click="_create">添加</el-button>
    </div>
    <div>
      <el-table :data="dataList" border row-key="id"
                v-loading="loading"
                element-loading-text="加载中">
        <el-table-column label="名称" prop="name">
        </el-table-column>
        <el-table-column label="标题" >
          <template slot-scope="scope">
            <div>
              {{getTitle(scope.row)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190">
          <template slot-scope="scope">
            <div>
              <el-button size="mini" type="primary" icon="el-icon-edit"
                         @click="_edit(scope.row)">编辑
              </el-button>
              <el-button size="mini" type="primary" icon="el-icon-delete"
                         @click="_del(scope.row)">删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import AgreementApi from '../../api/agreement'

  export default {
    props: {
    },
    components: {
    },
    data() {
      return {
        loading: false,
        dataList: []
      }
    },
    computed: {
    },
    methods: {
      async loadDataList() {
        try {
          const res = await AgreementApi.getList()
          this.dataList = res
        } catch (err) {
          this.$myErrorHandler.handle(this, err, '查询失败')
        }
      },
      _parseItemJ(item) {
        return JSON.parse(item.j)
      },
      getTitle(item) {
        try {
          let j = this._parseItemJ(item)
          return j.data.title
        } catch (err) {
          return ''
        }
      },
      _create() {
        this.$router.push({
          name: 'CreateAgreement'
        })
      },
      _edit(item) {
        this.$router.push({
          name: 'EditAgreement',
          params: {
            name: item.name,
            item: item
          }
        })
      },
      _del(item) {
        this.$confirm('确认要删除?', '提示').then(async () => {
          try {
            this.loading = true
            await AgreementApi.delAgreementItem(item.name)
            this.loadDataList()
            this.loading = false
          } catch (e) {
            this.loading = false
            this.$myErrorHandler.handle(this, e)
          }
        }).catch(() => {

        })
      }
    }
  }
</script>

<style lang="less" scoped>

  .title {
    margin-bottom: 8px;
  }

  .item {
    height: 45px;
    line-height: 45px;
    overflow: hidden;
    border-left: 1px solid #dfe6ec;
    border-right: 1px solid #dfe6ec;
    border-bottom: 1px solid #dfe6ec;

    &:first-child {
      border-top: 1px solid #dfe6ec;
    }

    .link {
      border-bottom: 1px dashed #20a0ff;
      padding-right: 10px;
    }

    .handler {
      color: #20a0ff;
      font-size: 20px;
      width: 20px;
      cursor: move;
      padding-left: 10px;
      padding-right: 10px;

      &.hide {
        visibility: hidden;
      }

    }

  }

</style>
