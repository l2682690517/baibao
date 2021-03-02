<template lang="pug">
  div.list-wrapper
    div
      el-table(:showHeader="false", :data="dataList.data",border, row-key="id", v-loading="loading", element-loading-text="加载中")
        el-table-column(prop="name")
          template(slot-scope="scope")
            div {{scope.row.name}}
            div.remark {{scope.row.sys_remark}}
        el-table-column(:width="300")
          template(slot-scope="scope")
            el-button(type="primary", size="mini", @click="showItemUrl(scope.row)") 链接
            el-button(type="primary", size="mini", @click="editItem(scope.row)") 编辑
            el-button(type="primary", size="mini", @click="previewItem(scope.row)") 预览
            el-button(type="primary", size="mini", @click="deleteItem(scope.row)") 删除
    preview-dialog(ref="dlgPreview")

</template>

<script>
  import * as MicroPageApi from 'src/api/micropage'
  import ShortUrlApi from 'src/api/shorturl'
  import PreviewDialog from './preview/Index.vue'

  export default {
    components: {
      PreviewDialog
    },
    data () {
      return {
        loading: false,
        dataList: {}
      }
    },
    methods: {
      async loadDataList () {
        try {
          this.loading = true
          const resData = await MicroPageApi.getList()
          this.dataList = resData.data
        } catch (err) {
          this.$myErrorHandler.handle(this, err, '查询失败')
        } finally {
          this.loading = false
        }
      },
      editItem (row) {
        this.$router.push({
          name: 'EditMicroPage',
          params: {
            id: row.id
          }
        })
      },
      deleteItem (row) {
        this.$confirm('删除?', '提示').then(async () => {
          try {
            this.loading = true
            await MicroPageApi.del(row.id)
            await this.loadDataList()
          } catch (e) {
            this.$myErrorHandler.handle(this, e)
          } finally {
            this.loading = false
          }
        }).catch(() => {})
      },
      async previewItem (row) {
        try {
          const resData = await MicroPageApi.getItem(row.id)
          this.$refs.dlgPreview.show(resData.data)
        } catch (ex) {
          this.$myErrorHandler.handle(this, ex)
        }
      },
      showItemUrl (row) {
        this.loading = true

        ShortUrlApi.getShortUrl(row.share_url)
          .then((res) => {
            let data = res.data
            this.loading = false
            const h = this.$createElement
            this.$msgbox({
              title: '微页面链接',
              closeOnClickModal: false,
              message: h('div', null, [
                h('div', null, data.short_url),
                h('div', {style: 'margin-top: 10px'}, '请达人点击使用，直接转发此链接无效')
              ]),
              confirmButtonText: '知道了'
            })
          })
          .catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err)
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .list-wrapper {
    margin-top: 20px;
  }

  .remark {
    color: #999999;
    font-size: 12px;
  }
</style>

