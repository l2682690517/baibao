<template lang="pug">
  div
    el-form(ref="form", labelWidth!="100px", :model="formData", :rules="rules")
      el-form-item(label="微页面名称", prop="name")
        el-input.name(v-model="formData.name", :maxlength="20", placeholder="最多20个字")
      el-form-item(label="备注", prop="sys_remark")
        el-input.remark(v-model="formData.sys_remark", :maxlenth="50", placeholder="最多50个字")
        div.description 备注用户不可见
      el-form-item(labelWidth="0")
        draggable(v-model!="formData.items", :options!="{handle: '.handler'}")
          div.item(v-for!="(item,index) in formData.items", key!="item.id")
            div.handler &#9776;
            div.cover-wrapper
              div.cover(v-lazy:background-image!="item.cover")
              div.product-icon
                item-icon-preview(v-if!="item.tp === 6", :model="item")
            div.name.single-line  {{showItemName(item)}}
            div.action
              el-button(size="mini", type="primary", @click!="editItem(item)") 编辑
              el-button(size="mini", type="danger", @click!="delItem(item, index)") 删除
      el-form-item(labelWidth="0", prop="items")
        el-button(type="primary", size="mini", icon="el-icon-plus", @click="createItem") 添加内容
      el-form-item(labelWidth="0")
        el-button(type="primary", @click="submit", :loading="loading") 提 交
        el-button(type="success", @click="preview") 预 览
    content-dialog(ref="dlgContent", @submit="editContentComplete")
    preview-dialog(ref="dlgPreview")

</template>

<script>
  import Draggable from 'vuedraggable'
  import ContentDialog from './ContentDialog'
  import ItemIconPreview from './ItemIconPreview.vue'
  import { TP_EMPTY, TP_PRODUCT, TP_DISCOUNT, TP_TAG, TP_LINK, TP_PRODUCT_LIST } from 'src/utils/micro-page-util'
  import * as MicroPageApi from 'src/api/micropage'
  import PreviewDialog from './preview/Index.vue'

  export default {
    components: {
      Draggable,
      ContentDialog,
      PreviewDialog,
      ItemIconPreview
    },
    data () {
      const validatItems = (rule, value, callback) => {
        if (!this.formData.items || this.formData.items.length === 0) {
          callback(new Error('请选择折扣商品"'))
          return
        }
        callback()
      }
      return {
        loading: false,
        formData: {
          id: 0,
          name: '',
          sys_remark: '',
          items: []
        },
        rules: {
          name: [
            {required: true, message: '微页面名称必填', trigger: 'blur'},
            {max: 20, message: '最大20个字符', trigger: 'blur'}
          ],
          items: [
            {validator: validatItems, trigger: 'change', message: '请添加内容'}
          ],
          sys_remark: [
            {max: 50, message: '最大50个字符', trigger: 'blur'}
          ]
        },
        deleteItems: []
      }
    },
    computed: {
      isEdit () {
        return this.$route.name === 'EditMicroPage'
      }
    },
    methods: {
      async getEditItem () {
        if (this.isEdit) {
          try {
            const resResult = await MicroPageApi.getItem(parseInt(this.$route.params.id))
            this.formData = resResult.data
          } catch (e) {
            this.$myErrorHandler.handle(this, e)
          }
        }
      },
      createItem () {
        this.$refs.dlgContent.show()
      },
      editItem (item) {
        this.$refs.dlgContent.show(item)
      },
      delItem (item, index) {
        if (item.id) {
          this.deleteItems.push(item)
        }
        this.formData.items.splice(index, 1)
      },
      editContentComplete (content) {
        if (content) {
          this.formData.items.push(content)
        }
      },
      showItemName (item) {
        switch (item.tp) {
          case TP_EMPTY: {
            return '无跳转'
          }
          case TP_PRODUCT: {
            return `商品：${item.product ? item.product.name : ''}`
          }
          case TP_TAG: {
            return `标签：${item.tag ? item.tag.name : ''}`
          }
          case TP_DISCOUNT: {
            return `折扣：${item.discount ? item.discount.name : ''}`
          }
          case TP_LINK: {
            return `${item.content}`
          }
          case TP_PRODUCT_LIST: {
            return `商品列表(${item.column_count}列): ${item.product_list.length}个商品`
          }
        }
        return ''
      },
      async submit () {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            try {
              if (!this.isEdit) {
                await MicroPageApi.create(this.formData)
              } else {
                this.formData.deleteItems = this.deleteItems
                await MicroPageApi.update(this.$route.params.id, this.formData)
              }
              this.$router.back()
            } catch (e) {
              this.$myErrorHandler.handle(this, e)
            } finally {
              this.loading = false
            }
          }
        })
      },
      preview () {
        this.$refs.dlgPreview.show(this.formData)
      }
    },
    async mounted () {
      this.getEditItem()
    }
  }
</script>

<style lang="scss" scoped>

  .el-input.name {
    width: 300px;
  }

  .el-input.remark {
    width: 400px;
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
    width: 560px;

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

    .cover-wrapper {
      position: relative;
      margin-left: 20px;
      width: 70px;
      height: 70px;
      .cover {
        position: absolute;
        background-size: cover;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }

      .product-icon {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }

    }

    .name {
      margin-left: 20px;
      padding-right: 20px;
      width: 250px;
      font-size: 14px;
      color: #1f2d3d;
    }
    .remark {
      margin-left: 20px;
      padding-right: 20px;
      width: 250px;
      font-size: 14px;
      color: #1f2d3d;
    }
  }

  .description {
    color: #999999;
    font-size: 12px;
  }

</style>
