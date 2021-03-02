<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item>自定义首页</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="tool-bar">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="create">添加</el-button>
      <span class="showAll"><el-checkbox  v-model="showAll">未上线内容</el-checkbox></span>
    </div>
    <div>
      <draggable v-model="dataList" :options='{handle: ".handler"}'>
        <div class="item " v-for="item in dataList" :key="item.id" v-if="showItem(item)">
          <div class="handler">&#9776;</div>
          <div class="cover" v-lazy:background-image="item.cover"></div>
          <div class="name">
            <div class="single-line">{{showName(item)}}</div>
            <div class="show-date" v-if="item.show_tp === 2">上线时间：{{item.show_start}}-{{item.show_end}}</div>
          </div>
          <div class="action">
            <el-button size="mini" type="info" @click="showUrl(item)">链接</el-button>
            <el-button size="mini" type="primary" @click="editItem(item)">编辑</el-button>
            <el-button size="mini" type="danger" @click="delItem(item)">删除</el-button>
          </div>
        </div>
      </draggable>
    </div>
    <div class="bottom-bar">
      <el-button type="primary" size="mini" :disabled="cmsdisabled" @click="submit()">提交</el-button>
      <el-button type="primary" size="mini" icon="el-icon-view" @click="preview()">预览</el-button>
    </div>
    <preview-dialog ref="dlgPreview" :dataList="dataList"></preview-dialog>
  </div>
</template>

<script>
  import Draggable from 'vuedraggable'
  import * as CustomPageApi from 'src/api/custompage'
  import ShortUrlApi from 'src/api/shorturl'
  import {
    getFriendlyModuleType,
    TYPE_MODULE_ACTIVITY,
    TYPE_MODULE_PRODUCT,
    TYPE_MODULE_URL,
    TYPE_MODULE_TAG
  } from 'src/utils/cmsUtil'
  import * as types from '../../store/types'
  import PreviewDialog from 'src/components/custompage/PreviewDialog'
  import Vue from 'vue'

  export default {
    components: {
      Draggable,
      PreviewDialog
    },
    data () {
      return {
        cmsdisabled: true,
        showAll: false
      }
    },
    computed: {
      dataList: {
        get () {
          return this.$store.getters.customsPages
        },
        set (newValue) {
          this.$store.commit(types.UPDATE_ALL_CUSTOM_PAGE_DATA, newValue)
        }
      }
    },
    watch: {
      dataList: {
        handler: function (newVal, oldVal) {
          if (oldVal.length !== 0) {
            this.cmsdisabled = false
          }
        },
        deep: true
      }
    },
    methods: {
      create () {
        this.$router.push({
          name: 'createCustompage'
        })
      },
      showName (mod) {
        return `${getFriendlyModuleType(mod.type)}: ${mod.name}`
      },
      delItem (item) {
        this.$confirm('确定要删除?').then(async () => {
          try {
            CustomPageApi.deleteItem(item.id)
            this.$message({
              message: '本地缓存已更新',
              type: 'info',
              showClose: true
            })
          } catch (e) {
            this.$myErrorHandler.handle(this, e)
          }
        }).catch(() => {})
      },
      editItem (item) {
        this.$router.push({
          name: 'editCustompage',
          params: {
            id: item.id
          }
        })
      },
      async showUrl (item) {
        let shareUrl = `${window.location.origin}/s/?qr=1#/0/`
        switch (item.type) {
          case TYPE_MODULE_ACTIVITY:
            shareUrl += `act/${item.actId}`
            break
          case TYPE_MODULE_PRODUCT:
            shareUrl += `goods/${item.prodId}`
            break
          case TYPE_MODULE_TAG:
            shareUrl += `tag/${item.tagId}`
            break
          case TYPE_MODULE_URL:
            shareUrl = item.url
            break
        }
        if (item.type !== TYPE_MODULE_URL) {
          try {
            this.loading = true
            const resUrl = await ShortUrlApi.getShortUrl(shareUrl)
            shareUrl = resUrl.data.short_url
          } catch (err) {
            this.$myErrorHandler.handle(this, err)
          } finally {
            this.loading = false
          }
        }
        this.$msgbox({
          title: '链接',
          closeOnClickModal: false,
          message: `${shareUrl}`,
          confirmButtonText: '知道了'
        })
      },
      async submit () {
        try {
          this.loading = true
          await CustomPageApi.updateRawDataList(this.dataList)
          this.cmsdisabled = true
          this.loading = false
          this.$message({
            showClose: true,
            message: '提交服务器成功',
            type: 'success'
          })
        } catch (e) {
          this.loading = false
          this.$myErrorHandler.handle(this, e)
        }
      },
      preview () {
        this.$refs.dlgPreview.show()
      },
      showItem (item) {
        if (this.showAll) {
          return true
        }
        if (item.show_tp === 0 || item.show_tp === 1) {
          return true
        }
        try {
          const startCt = new Date(item.show_start).getTime()
          const endCt = new Date(item.show_end).getTime()
          const nowCt = new Date().getTime()
          if (nowCt >= startCt && nowCt <= endCt) {
            return true
          } else {
            return false
          }
        } catch (ex) {
          console.log('ex', ex)
          return true
        }
      }
    },
    async activated () {
      const result = await CustomPageApi.getList(false)
      const oldMt = this.$store.state.custompage.mt
      if (result.mt !== oldMt) {
        this.$confirm('服务器数据已更新，需要更新本地缓存', '提示')
          .then(() => {
            this.$store.commit(types.UPDATE_ALL_CUSTOM_PAGE, result)
            this.cmsdisabled = true
            this.loading = false
          })
          .catch((err) => {
          })
      }
    },
    async beforeRouteEnter (to, from, next) {
      if (!Vue.$store.state.custompage.customsPages) {
        await CustomPageApi.getList()
      }
      next((vm) => {
      })
    }
  }
</script>

<style lang="scss" scoped>

  .tool-bar {
    margin-bottom: 20px;
  }

  .bottom-bar {
    margin: 20px 0px 20px 0px;
  }

  .showAll {
    margin-left: 10px;
  }

  .item {
    display: flex;
    align-items: center;
    padding-left: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 20px;
    overflow: hidden;
    border-left: 1px solid #dfe6ec;
    border-right: 1px solid #dfe6ec;
    border-bottom: 1px solid #dfe6ec;
    width: 750px;

    &:first-child {
      border-top: 1px solid #dfe6ec;
    }

    .handler {
      display: inline-block;
      color: #20a0ff;
      width: 20px;
      font-size: 20px;
      cursor: move;
    }

    .cover {
      width: 100px;
      height: 60px;
      margin-left: 20px;
      background-size: cover;
    }

    .name {
      margin-left: 20px;
      padding-right: 20px;
      width: 350px;
      font-size: 14px;
      color: #1f2d3d;

      .show-date {
        margin-top: 8px;
      }
    }
  }

</style>
