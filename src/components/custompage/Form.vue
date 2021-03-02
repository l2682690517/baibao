<template>
  <div>
    <el-form ref="form" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="封面图" prop="cover" :required="true">
        <div class="upload-image">
          <img class="uploaded-image" v-if="formData.cover" :src="formData.cover" @click="showUploadCoverDialog">
          <i v-else class="add-icon el-icon-plus" @click="showUploadCoverDialog"></i>
        </div>
        <div class="input-tip">建议尺寸750像素宽</div>
      </el-form-item>
      <el-form-item label="内容" prop="type" :required="true">
        <el-radio v-for="item in allTypes" class="radio" v-model="formData.type" :label="item.id" :key="item.id">
          {{item.name}}
        </el-radio>
      </el-form-item>
      <template v-if="formData.type === 1">
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
      <template v-if="formData.type === 4">
        <el-form-item label="标签" prop="tagId" :required="true">
          <el-select v-model="formData.tagId" placeholder="请选择">
            <el-option-group
              v-for="group in allTagGroups.data"
              :key="group.id"
              :label="group.name">
              <el-option
                v-for="item in group.tags"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
      </template>
      <template v-if="formData.type === 2">
        <el-form-item label="商品" prop="prodId" :required="true">
          <el-button type="primary" size="mini" @click="chooseProduct">选择商品</el-button>
          <div class="product" v-if="currentProduct && currentProduct.id">
            <div class="icon-wrapper"><img :src="currentProduct.images[0]" class="img-responsive"></div>
            <div class="desc"><span class="title">{{currentProduct.name}}</span><span
              class="price">¥{{currentProduct.original_price}}</span>
            </div>
          </div>
        </el-form-item>
      </template>
      <template v-if="formData.type === 3">
        <el-form-item label="标题" prop="name">
          <el-input class="title" v-model="formData.name" :maxlength="20" placeholder="最多20个字"></el-input>
          <span class="input-tip">
              从客户端分享到应用外时显示此标题
          </span>
        </el-form-item>
        <el-form-item label="链接" prop="url" :required="true">
          <el-input v-model="formData.url" class="url"></el-input>
          <span class="input-tip">
              需要以 http:// 或 https:// 开头
          </span>
        </el-form-item>
      </template>
      <el-form-item label="上线时间" prop="show_tp" :required="true">
        <el-radio v-model="formData.show_tp" :label="1">长期</el-radio>
        <el-radio v-model="formData.show_tp" :label="2">
          <date-time-tool-bar placeholder="选择上线时间" v-model="chooseDate"></date-time-tool-bar>
        </el-radio>
      </el-form-item>
      <el-form-item>
        <el-button @click="$router.back()">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="loading">确 定</el-button>
      </el-form-item>
    </el-form>
    <choose-product-dialog ref="dlgChooseProduct" @choose="chooseProductCompleted"></choose-product-dialog>
    <upload-image-dialog ref="dlgUploadCover" :max="1" tip="建议尺寸750像素宽"
                         @uploadCompleted="uploadCoverCompleted"></upload-image-dialog>
  </div>
</template>

<script>

  import UploadImageDialog from 'src/common/widgets/UploadImageDialog'
  import {
    TYPE_MODULE_ACTIVITY,
    TYPE_MODULE_PRODUCT,
    TYPE_MODULE_URL,
    TYPE_MODULE_TAG,
    generateModuleOfActivity,
    generateModuleOfProduct,
    generateModuleOfUrl,
    generateModuleOfTag
  } from 'src/utils/cmsUtil'
  import DiscountApi from 'src/api/discount'
  import ProductApi from 'src/api/product'
  import * as CustomPageApi from 'src/api/custompage'
  import TagApi from 'src/api/tag'
  import ChooseProductDialog from 'src/components/common/choose-product-dialog/Index.vue'
  import {mapState} from 'vuex'
  import DateTimeToolBar from 'src/common/widgets/DateTimeToolBar.vue'

  const MODE_CREATE = 0
  const MODE_EDIT = 1

  export default {
    MODE_CREATE,
    MODE_EDIT,
    components: {
      UploadImageDialog,
      ChooseProductDialog,
      DateTimeToolBar
    },
    props: {
      mode: {
        type: Number,
        default: 0
      }
    },
    data() {
      const validateProdId = (rule, value, callback) => {
        if (this.formData.prodId === 0) {
          callback(new Error('请选择商品'))
          return
        }
        callback()
      }
      const valiateName = (rule, value, callback) => {
        if (value) {
          const str = value.replace(/^\s+|\s+$/g, '')
          if (str.length <= 0) {
            callback(new Error('标题必填'))
            return
          }
        }
        callback()
      }
      const validateShowTp = (rule, value, callback) => {
        if (value !== 1 && value !== 2) {
          callback(new Error('请选择上线时间'))
          return
        }
        if (value === 2) {
          if (!this.chooseDate || this.chooseDate.length !== 2) {
            callback(new Error('请选择上线时间'))
            return
          }
        }
        callback()
      }
      return {
        loading: false,
        imageUrl: '',
        currentProduct: {},
        chooseDate: [],
        formData: {
          id: 0,
          title: '',
          cover: '',
          width: 0,
          height: 0,
          type: TYPE_MODULE_ACTIVITY,
          actId: '',
          prodId: 0,
          url: '',
          tagId: '',
          show_tp: 0
        },
        rules: {
          cover: [
            {required: true, message: '请选择封面图', trigger: 'blur'}
          ],
          actId: [
            {required: true, message: '请选择折扣', trigger: 'change'}
          ],
          prodId: [
            {validator: validateProdId, trigger: 'blur'}
          ],
          url: [
            {type: 'url', message: '请输入完整、正确的网址，以 http:// 或 https:// 开头', trigger: 'blur'},
            {required: true, message: '请输入网址', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '标题必填', trigger: 'blur'},
            {max: 20, message: '最大20个字符', trigger: 'blur'},
            {validator: valiateName, trigger: 'blur'}
          ],
          show_tp: [
            {validator: validateShowTp, message: '请选择上线时间', trigger: 'change'}
          ]
        },
        allTypes: [
          {
            id: TYPE_MODULE_ACTIVITY,
            name: '折扣'
          }, {
            id: TYPE_MODULE_TAG,
            name: '标签'
          }, {
            id: TYPE_MODULE_PRODUCT,
            name: '单个商品'
          }, {
            id: TYPE_MODULE_URL,
            name: '链接'
          }
        ],
        allActivities: {},
        allTagGroups: {}
      }
    },
    computed: {
      ...mapState({
        customsPages: state => state.custompage.customsPages
      })
    },
    methods: {
      getName() {
        switch (this.formData.type) {
          case TYPE_MODULE_ACTIVITY:
            const act = this.allActivities.data.find((item) => {
              return item.id === parseInt(this.formData.actId)
            })
            if (!act) {
              throw new Error('找不到折扣')
            }
            return act ? act.name : ''
          case TYPE_MODULE_PRODUCT:
            const name = this.currentProduct && this.currentProduct.id ? this.currentProduct.name : ''
            if (!name) {
              throw new Error('找不到商品')
            }
            return name
          case TYPE_MODULE_URL:
            return this.formData.name
          case TYPE_MODULE_TAG:
            const tagId = this.formData.tagId
            for (let group of (this.allTagGroups.data || [])) {
              for (let item of (group.tags || [])) {
                if (item.id === parseInt(tagId)) {
                  return item.name
                }
              }
            }
            throw new Error('找不到标签')
        }
      },
      create(module) {
        try {
          module.id = new Date().getTime()
          this.loading = true

          CustomPageApi.create(module)
          this.loading = false
          this.$message({
            showClose: true,
            message: '本地缓存已更新',
            type: 'info'
          })
          this.$router.back()
        } catch (e) {
          this.loading = false
          this.$myErrorHandler.handle(this, e)
        }
      },
      update(module) {
        try {
          this.loading = true
          CustomPageApi.updateItem(module)
          this.loading = false
          this.$message({
            showClose: true,
            message: '本地缓存已更新',
            type: 'info'
          })
          this.$router.back()
        } catch (e) {
          this.loading = false
          this.$myErrorHandler.handle(this, e)
        }
      },
      submitForm() {
        this.$refs.form.validate(async (validFrom) => {
          if (validFrom) {
            let name
            try {
              name = this.getName()
              if (!name) {
                this.$message({
                  showClose: true,
                  message: '创建失败',
                  type: 'error'
                })
                return
              }
            } catch (ex) {
              this.$message({
                showClose: true,
                message: ex.message,
                type: 'error'
              })
              return
            }
            let module
            switch (this.formData.type) {
              case TYPE_MODULE_ACTIVITY:
                module = generateModuleOfActivity(this.formData.id, name, this.formData.cover, this.formData.width, this.formData.height, this.formData.actId, this.formData.show_tp, this.chooseDate)
                break
              case TYPE_MODULE_PRODUCT:
                module = generateModuleOfProduct(this.formData.id, name, this.formData.cover, this.formData.width, this.formData.height, this.formData.prodId, this.formData.show_tp, this.chooseDate)
                break
              case TYPE_MODULE_URL:
                module = generateModuleOfUrl(this.formData.id, name, this.formData.cover, this.formData.width, this.formData.height, this.formData.url, this.formData.show_tp, this.chooseDate)
                break
              case TYPE_MODULE_TAG:
                module = generateModuleOfTag(this.formData.id, name, this.formData.cover, this.formData.width, this.formData.height, this.formData.tagId, this.formData.show_tp, this.chooseDate)
                break
            }
            if (!module) {
              this.$message({
                showClose: true,
                message: '创建失败',
                type: 'error'
              })
              return
            }
            if (this.mode === MODE_CREATE) {
              this.create(module)
            } else {
              this.update(module)
            }
          }
        })
      },
      chooseProduct() {
        this.$refs.dlgChooseProduct.show()
      },
      chooseProductCompleted(item) {
        this.formData.prodId = item.id
      },
      async getProduct() {
        if (this.formData.prodId) {
          try {
            const resData = await ProductApi.getItem(this.formData.prodId)
            this.currentProduct = resData.data
          } catch (e) {
            this.$myErrorHandler.handle(this, e)
          }
        }
      },
      async getDiscountItems() {
        try {
          const resResult = await DiscountApi.getSimpleItems()
          this.allActivities = resResult.data
        } catch (e) {
          this.$myErrorHandler.handle(this, e)
        }
      },
      getEditItem() {
        if (this.mode === MODE_EDIT) {
          try {
            const id = this.$route.params.id
            const editItem = this.customsPages.find((item) => {
              return item.id === parseInt(id)
            })
            Object.assign(this.formData, editItem)
            if (this.formData.actId) {
              this.formData.actId = String(this.formData.actId)
            }
            if (this.formData.show_start && this.formData.show_end) {
              this.chooseDate = [this.formData.show_start, this.formData.show_end]
            } else {
              this.chooseDate = []
            }
            console.log('formData', this.formData)
          } catch (e) {
            this.$myErrorHandler.handle(this, e)
          }
        }
      },
      getTagGroupList() {
        TagApi.getTagGroupList().then((res) => {
          this.allTagGroups = res.data
        })
          .catch((err) => {
            this.$myErrorHandler.handle(this, err, '查询标签失败')
          })
      },
      showUploadCoverDialog() {
        this.$refs.dlgUploadCover.show()
      },
      uploadCoverCompleted(images) {
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
          this.formData.width = item.size.width
          this.formData.height = item.size.height
        })
      }
    },
    watch: {
      'formData.prodId'(newVal, oldVal) {
        this.getProduct()
      }
    },
    async mounted() {
      await this.getDiscountItems()
      this.getEditItem()
      this.getTagGroupList()
    }
  }
</script>

<style lang="scss" scoped>

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

  .title {
    width: 300px;
    margin-right: 5px;
  }

  .upload-image {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    width: 375px;
    height: 225px;

    .uploaded-image {
      width: 375px;
      height: 225px;
      display: block;
      cursor: pointer;
    }

    .add-icon {
      font-size: 28px;
      color: #8c939d;
      width: 375px;
      height: 225px;
      cursor: pointer;
      line-height: 225px;
      text-align: center;
    }

  }

</style>
