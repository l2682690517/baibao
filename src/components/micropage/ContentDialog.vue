<template>
  <div>
    <el-dialog :width="dialogSize"  :visible.sync="dialogVisible" @close="closeCallback">
      <div class="content">
        <div>
          <el-form ref="form" :model="formData" :rules="rules" label-width="80px">
            <el-form-item label="背景图" prop="cover" :required="true">
              <div class="bg-wrapper">
                <div>
                  <div class="upload-image">
                    <img class="uploaded-image" v-if="formData.cover" :src="formData.cover"
                         @click="showUploadCoverDialog">
                    <i class="add-icon el-icon-plus" @click="showUploadCoverDialog"
                       v-if="!formData.cover && (formData.tp !== 6 || formData.product_list.length === 0)"></i>
                  </div>
                  <div class="image-bottom-wrapper">
                    <div class="input-tip">建议宽度750像素</div>
                    <div class="change-image-action" @click="showUploadCoverDialog">更换背景图</div>
                  </div>
                </div>
                <div class="product-list-grid" v-if="formData.tp === 6">
                  <product-grid :dataList="formData.product_list" :columnCount="formData.column_count"></product-grid>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="内容" prop="tp" :required="true">
              <el-radio v-for="item in allTypes" class="radio" v-model="formData.tp" :label="item.id" :key="item.id">
                {{item.name}}
                <el-select v-model="formData.column_count" v-if="item.id === 6">
                  <el-option
                    v-for="item in productColumnCountOptions"
                    :key="item.val"
                    :label="item.text"
                    :value="item.val">
                  </el-option>
                </el-select>
              </el-radio>
            </el-form-item>
            <template v-if="formData.tp === $options.TP_DISCOUNT">
              <el-form-item label="折扣" prop="actId" :required="true">
                <el-select v-model="formData.actId" placeholder="请选择">
                  <el-option
                    v-for="item in allActivities.data"
                    :key="String(item.id)"
                    :label="item.name"
                    :value="String(item.id)">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
            <template v-if="formData.tp === $options.TP_TAG">
              <el-form-item label="标签" prop="tagId" :required="true">
                <el-select v-model="formData.tagId" placeholder="请选择">
                  <el-option-group
                    v-for="group in allTagGroups.data"
                    :key="group.id"
                    :label="group.name">
                    <el-option
                      v-for="item in group.tags"
                      :key="`${item.id}`"
                      :label="item.name"
                      :value="`${item.id}`">
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
            </template>
            <template v-if="formData.tp === $options.TP_PRODUCT">
              <el-form-item label="商品" prop="prodId" :required="true">
                <el-button type="primary" size="small" @click="chooseProduct">选择商品</el-button>
                <div class="product" v-if="currentProduct && currentProduct.id">
                  <div class="icon-wrapper"><img :src="currentProduct.images[0]" class="img-responsive"></div>
                  <div class="desc"><span class="title">{{currentProduct.name}}</span><span
                    class="price">¥{{currentProduct.original_price}}</span>
                  </div>
                </div>
              </el-form-item>
            </template>
            <template v-if="formData.tp === $options.TP_LINK">
              <el-form-item label="链接" prop="url" :required="true">
                <el-input v-model="formData.url" class="url"></el-input>
                <span class="input-tip">
              需要以 http:// 或 https:// 开头
          </span>
              </el-form-item>
            </template>
          </el-form>
        </div>
        <div class="choose-product-wrapper" v-show="isChooseProductVisible">
          <div class="add-product-bar">
            <el-button type="primary" size="small" @click="chooseProductList">添加商品</el-button>
          </div>
          <div class="product-list">
            <draggable v-model="formData.product_list" :options='{handle: ".handler"}'>
              <div class="product-list-item" v-for="(item,index) in formData.product_list" :key="item.id">
                <div class="handler">&#9776;</div>
                <div class="cover" v-lazy:background-image="item.cover || item.images[0]"></div>
                <div class="desc">
                  <div class="title single-line">
                    {{ item.name }}
                  </div>
                  <div class="price">
                    ¥{{item.original_price}}
                  </div>
                </div>
                <div class="action single-line">
                  <el-button type="danger" size="small" @click="deleteProductItem(index)">删除</el-button>
                </div>
              </div>
            </draggable>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
    <choose-product-dialog ref="dlgSingleChooseProduct" @choose="chooseProductCompleted"></choose-product-dialog>
    <choose-product-dialog ref="dlgMultipleChooseProduct" :mode="1"
                           @choose="chooseProductListCompleted"></choose-product-dialog>
    <upload-image-dialog ref="dlgUploadCover" :max="1" tip="建议宽度750像素"
                         @uploadCompleted="uploadCoverCompleted"></upload-image-dialog>
  </div>
</template>

<script>

  import Draggable from 'vuedraggable'
  import UploadImageDialog from 'src/common/widgets/UploadImageDialog'
  import ProductGrid from 'src/components/common/product-grid/Index.vue'
  import DiscountApi from 'src/api/discount'
  import ProductApi from 'src/api/product'
  import TagApi from 'src/api/tag'
  import ChooseProductDialog from 'src/components/common/choose-product-dialog/Index'
  import { TP_EMPTY, TP_PRODUCT, TP_DISCOUNT, TP_TAG, TP_LINK, TP_PRODUCT_LIST } from 'src/utils/micro-page-util'

  export default {
    TP_EMPTY,
    TP_PRODUCT,
    TP_DISCOUNT,
    TP_TAG,
    TP_LINK,
    TP_PRODUCT_LIST,
    components: {
      UploadImageDialog,
      ChooseProductDialog,
      Draggable,
      ProductGrid
    },
    data () {
      const validateProdId = (rule, value, callback) => {
        if (this.formData.prodId === 0) {
          callback(new Error('请选择商品'))
          return
        }
        callback()
      }
      return {
        loading: false,
        dialogVisible: false,
        imageUrl: '',
        currentProduct: {},
        formData: {
          id: 0,
          cover: '',
          tp: TP_EMPTY,
          actId: '',
          prodId: 0,
          tagId: '',
          url: '',
          content: '',
          product: null,
          discount: null,
          tag: null,
          product_list: [],
          column_count: 1
        },
        rules: {
          cover: [
            {required: true, message: '请选择封面图', trigger: 'blur'}
          ],
          actId: [
            {required: true, message: '请选择折扣', trigger: 'change'}
          ],
          tagId: [
            {required: true, message: '请选择标签', trigger: 'change'}
          ],
          prodId: [
            {validator: validateProdId, trigger: 'blur'}
          ],
          url: [
            {type: 'url', message: '请输入完整、正确的网址，以 http:// 或 https:// 开头', trigger: 'blur'},
            {required: true, message: '请输入网址', trigger: 'blur'}
          ]
        },
        allTypes: [
          {
            id: TP_EMPTY,
            name: '无'
          }, {
            id: TP_PRODUCT,
            name: '单个商品'
          }, {
            id: TP_DISCOUNT,
            name: '折扣'
          }, {
            id: TP_TAG,
            name: '标签'
          }, {
            id: TP_LINK,
            name: '链接'
          }, {
            id: TP_PRODUCT_LIST,
            name: ''
          }
        ],
        allActivities: {},
        allTagGroups: {},
        productColumnCountOptions: [
          {
            text: '商品列表(1列)',
            val: 1
          },
          {
            text: '商品列表(2列)',
            val: 2
          },
          {
            text: '商品列表(3列)',
            val: 3
          }
        ]
      }
    },
    computed: {
      dialogSize () {
        if (this.formData.tp === TP_PRODUCT_LIST) {
          return '80%'
        } else {
          return '50%'
        }
      },
      isChooseProductVisible () {
        if (this.formData.tp === TP_PRODUCT_LIST) {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      show (microPageItem) {
        this.originData = microPageItem
        if (!microPageItem) {
          this.formData = {
            id: 0,
            cover: '',
            tp: TP_EMPTY,
            actId: '',
            prodId: 0,
            tagId: '',
            url: '',
            content: '',
            product: null,
            discount: null,
            tag: null,
            product_list: [],
            column_count: 1
          }
        } else {
          this.formData = {
            id: microPageItem.id,
            cover: microPageItem.cover,
            tp: microPageItem.tp,
            actId: microPageItem.tp === TP_DISCOUNT ? microPageItem.content : '',
            prodId: microPageItem.tp === TP_PRODUCT ? parseInt(microPageItem.content) : 0,
            tagId: microPageItem.tp === TP_TAG ? microPageItem.content : '',
            url: microPageItem.tp === TP_LINK ? microPageItem.content : '',
            content: microPageItem.content,
            product: null,
            discount: null,
            tag: null,
            product_list: microPageItem.product_list ? microPageItem.product_list.slice() : [],
            column_count: microPageItem.column_count
          }
        }
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      prepareContent () {
        switch (this.formData.tp) {
          case TP_DISCOUNT:
            const act = this.allActivities.data.find((item) => {
              return item.id === parseInt(this.formData.actId)
            })
            if (act) {
              this.formData.content = `${act.id}`
              this.formData.discount = act
              return true
            }
            return false
          case TP_PRODUCT:
            if (this.currentProduct && this.currentProduct.id) {
              this.formData.content = `${this.currentProduct.id}`
              this.formData.product = this.currentProduct
              return true
            }
            return false
          case TP_LINK:
            if (this.formData.url) {
              this.formData.content = this.formData.url
              return true
            }
            return false
          case TP_TAG:
            const tagId = this.formData.tagId
            for (let group of (this.allTagGroups.data || [])) {
              for (let item of (group.tags || [])) {
                if (item.id === parseInt(tagId)) {
                  this.formData.content = `${item.id}`
                  this.formData.tag = item
                  return true
                }
              }
            }
            return false
          case TP_EMPTY:
            this.formData.content = ''
            return true
          case TP_PRODUCT_LIST:
            let pidList = []
            for (let item of (this.formData.product_list || [])) {
              pidList.push(item.id)
            }
            if (pidList.length > 0) {
              this.formData.content = pidList.join(',')
              return true
            }
            return false
        }
        return false
      },
      create (module) {
      },
      update (module) {
      },
      submitForm () {
        this.$refs.form.validate(async (validFrom) => {
          if (validFrom) {
            const result = this.prepareContent()
            if (!result) {
              this.$message({
                showClose: true,
                message: '创建失败',
                type: 'error'
              })
              return
            }
            if (this.originData) {
              Object.assign(this.originData, this.formData)
            }
            this.$emit('submit', !this.originData ? {...this.formData} : null)
            this.hide()
          }
        })
      },
      closeCallback () {
        this.$refs.form && this.$refs.form.resetFields()
      },
      chooseProduct () {
        this.$refs.dlgSingleChooseProduct.show()
      },
      chooseProductCompleted (item) {
        this.formData.prodId = item.id
      },
      chooseProductList () {
        this.$refs.dlgMultipleChooseProduct.show(this.formData.product_list)
      },
      chooseProductListCompleted (items) {
        this.formData.product_list = items
      },
      deleteProductItem (index) {
        this.formData.product_list.splice(index, 1)
      },
      async getProduct () {
        if (this.formData.prodId) {
          try {
            const resData = await ProductApi.getItem(this.formData.prodId)
            this.currentProduct = resData.data
          } catch (e) {
            this.$myErrorHandler.handle(this, e)
          }
        } else {
          this.currentProduct = {}
        }
      },
      async getDiscountItems () {
        try {
          const resResult = await DiscountApi.getSimpleItems()
          this.allActivities = resResult.data
        } catch (e) {
          this.$myErrorHandler.handle(this, e)
        }
      },
      getEditItem () {
//        if (this.mode === MODE_EDIT) {
//          try {
//            const id = this.$route.params.id
//            const editItem = this.customsPages.find((item) => {
//              return item.id === parseInt(id)
//            })
//            Object.assign(this.formData, editItem)
//            if (this.formData.actId) {
//              this.formData.actId = String(this.formData.actId)
//            }
//          } catch (e) {
//            this.$myErrorHandler.handle(this, e)
//          }
//        }
      },
      getTagGroupList () {
        TagApi.getTagGroupList().then((res) => {
          this.allTagGroups = res.data
        })
          .catch((err) => {
            this.$myErrorHandler.handle(this, err, '查询标签失败')
          })
      },
      showUploadCoverDialog () {
        this.$refs.dlgUploadCover.show()
      },
      uploadCoverCompleted (images) {
        if (images.length !== 1) {
          this.$message({
            message: '最多可以上传1张图',
            type: 'error',
            showClose: true
          })
          return
        }
        images.forEach((item) => {
          this.formData.cover = item.ossUrl
        })
      }
    },
    watch: {
      'formData.prodId' (newVal, oldVal) {
        this.getProduct()
      }
    },
    async mounted () {
      await this.getDiscountItems()
      this.getEditItem()
      this.getTagGroupList()
    }
  }
</script>

<style lang="scss" scoped>

  .content {
    display: flex;

    & > div {
      flex: 1;
    }
  }

  .image-bottom-wrapper {
    width: 250px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .change-image-action {
      color: #20a0ff;
      font-size: 12px;
      cursor: pointer;
    }
  }

  .choose-product-wrapper {
    padding-left: 10px;
    margin-left: 5px;
    border-left: solid 1px $light-gray;
    display: flex;
    flex-direction: column;

    .add-product-bar {
      padding-bottom: 10px;
    }

    .product-list {
      flex: 1;

      max-height: 380px;
      overflow-y: auto;
    }
  }

  .product {
    display: flex;
    padding: 5px;

    align-items: center;
    border: solid 1px #ddd;
    margin-top: 8px;
    margin-bottom: 8px;
    width: 300px;

    .icon-wrapper {
      flex: 0 0 60px;
      width: 60px;
      height: 60px;
    }

    .desc {
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 5px;
      padding-right: 5px;

      .title {
        display: block;
        font-size: 14px;
        line-height: 18px;
        width: 210px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .price {
        display: block;
        margin-top: 5px;
        font-size: 14px;
        line-height: 18px;
      }

    }

  }

  .url {
    width: 300px;
    margin-right: 5px;
  }

  $image-width: 250px;
  $image-height: 250px;

  .bg-wrapper {
    position: relative;
    width: $image-width;
    height: $image-height;
  }

  .upload-image {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    width: $image-width;
    height: $image-height;

    .uploaded-image {
      width: $image-width;
      height: $image-height;
      display: block;
      cursor: pointer;
    }

    .add-icon {
      font-size: 28px;
      color: #8c939d;
      width: $image-width;
      height: $image-height;
      cursor: pointer;
      line-height: $image-height;
      text-align: center;
    }

  }

  .product-list-grid {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  .product-list-item {
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
      width: 50px;
      height: 50px;
      margin-left: 20px;
      background-size: cover;
    }

    .desc {
      margin-left: 20px;
      padding-right: 20px;
      width: 300px;
      font-size: 14px;
      color: #1f2d3d;

      .title {
        display: block;
        font-size: 14px;
        line-height: 18px;
      }

      .price {
        display: block;
        margin-top: 5px;
        font-size: 14px;
        line-height: 18px;
      }
    }
    .remark {
      margin-left: 20px;
      padding-right: 20px;
      width: 250px;
      font-size: 14px;
      color: #1f2d3d;
    }
  }

</style>
