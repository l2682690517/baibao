<template>
  <div>
    <el-form ref="form" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="商品图片" prop="images" required>
        <form-image-item v-model="formData.images" :max="5"></form-image-item>
      </el-form-item>
      <el-form-item label="列表图片">
        <form-image-item v-model="formData.covers" :showMax="false"></form-image-item>
      </el-form-item>
      <el-form-item label="分享图">
        <form-image-item v-model="formData.shareImages" :max="9" tip="一旦上传，多图分享和生成二维码图片时，将使用此字段图"></form-image-item>
      </el-form-item>
      <el-form-item label="商品名称" prop="name">
        <el-input
          class="name-input"
          type="textarea"
          :maxlength="50"
          :autosize="{ minRows: 1, maxRows: 2}"
          resize="none"
          placeholder="请输入内容"
          v-model="formData.name">
        </el-input>
      </el-form-item>
      <el-form-item label="吊牌价格" prop="tag_price">
        <div>
          <span class="input">
                <el-input v-model="formData.tag_price"></el-input>
          </span>
          <span>元</span>
        </div>
      </el-form-item>
      <el-form-item v-if="!_hasRealSku(formData.skus)" label="商品价格" prop="price">
        <div>
          <span class="input">
                <el-input v-model="formData.price"></el-input>
          </span>
          <span>元</span>
        </div>
        <div class="input-tip" v-if="formData.discount_item">
          折后价:{{formData.discount_item.seckill_price}} 元
        </div>
      </el-form-item>
      <el-form-item v-if="!_hasRealSku(formData.skus)" label="商品库存" prop="stock">
        <div>
          <span class="input">
            <el-input v-model="formData.stock">
            </el-input>
          </span>
          <span>件</span>
        </div>
      </el-form-item>
      <el-form-item v-if="!_hasRealSku(formData.skus)" label="商品编码" prop="code">
        <div>
          <span class="input">
            <el-input v-model="formData.code">
            </el-input>
          </span>
          <span class="input-tip">
            注意：此编码不能重复，且必须首先在ERP系统上架，否则将无法发货
          </span>
        </div>
      </el-form-item>
      <el-form-item v-if="!_hasRealSku(formData.skus)" label="重量" prop="weight">
        <span class="input">
          <el-input v-model="formData.weight">
          </el-input>
        </span>
        <span>
            kg
        </span>
      </el-form-item>
      <el-form-item v-show="_hasRealSku(formData.skus)" label="商品规格">
        <edit-sku-comp ref="skuComp" :prod="formData" :list="freightList" :fid="radioFid" @del-last-sku="_delLastSku"/>
      </el-form-item>
      <el-row style="margin-bottom: 10px;padding-left: 85px">
        <el-col :span="24">
          <el-button @click="_createNewSku" type="primary" size="small" icon="el-icon-plus">添加商品规格</el-button>
        </el-col>
      </el-row>
      <el-form-item label="达人供货价" prop="sp_price">
        <div>
          <span class="input">
            <el-input v-model="formData.sp_price">
            </el-input>
          </span>
          <span>元</span>
        </div>
      </el-form-item>
      <el-form-item label="商品分类" prop="topCateId" :required="true">
        <el-select v-model="formData.topCateId" clearable placeholder="请选择分类" @change="_cateChange">
          <el-option
            v-for="item in allCategory"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品子分类" prop="subCateId" :required="true" v-if="hashSubCategory(formData.topCateId)">
        <el-radio v-for="item in allsubCategory" class="radio" v-model="formData.subCateId" :label="item.id"
                  :key="item.id">
          {{item.name}}
        </el-radio>
      </el-form-item>
      <el-form-item label="配送区域" prop="delivery_region_id">
        <div>
          <el-select v-model="formData.delivery_region_id" clearable placeholder="请选择">
            <el-option
              v-for="item in dregionList"
              :key="item.id"
              :label="item.name"
              :value="String(item.id)">
            </el-option>
          </el-select>
          <span class="input-tip">商品将限于所选配送地区，并在商品详情中自动显示限区说明</span>
        </div>
      </el-form-item>
      <el-form-item label="商品设置" prop="isNeedIdno">
        <el-checkbox v-model="formData.isNeedIdno">清关商品</el-checkbox>
        <span class="input-tip">
            购买清关商品时需要消费者提供真实姓名和身份证，系统校验后才能进行付款
        </span>
      </el-form-item>
      <el-form-item label="运费模板" prop="fid">
        <el-radio v-model="radioFreight" label="0">包邮</el-radio>
        <el-radio v-model="radioFreight" label="1">运费模板</el-radio>
        <el-select v-model="radioFid" v-if="this.radioFreight!='0'" clearable placeholder="请选择">
          <el-option
            v-for="item in freightList"
            :key="item.id"
            :label="item.name"
            :value="String(item.id)">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="初始销量" prop="initialSale">
        <div>
          <span class="input">
            <el-input v-model="formData.initialSale">
            </el-input>
          </span>
          <span class="unit">件</span>
          <span class="input-tip">
              前台商品销量 将显示为 初始销量 + 实际销量
          </span>
        </div>
      </el-form-item>
      <el-form-item label="定时开售">
        <div>
          <el-date-picker :picker-options="pickerOptions" v-model="formData.sellTime" type="datetime"
                          format="yyyy-MM-dd HH:mm" placeholder="选择开售时间">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="商品标签" prop="tags">
        <div>
          <el-tag class="ptag" type="primary" v-for="item in formData.tags" :key="item.id">{{item.name}}</el-tag>
        </div>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="_chooseTag">选择标签</el-button>
      </el-form-item>
      <el-form-item label="商品描述" prop="detail">
        <div>
          <cms ref="cms" :content="detail" :showVideo="true"></cms>
        </div>
      </el-form-item>
      <el-form-item label="服务组合" prop="service_tag_group_id">
        <div>
          <el-select v-model="formData.service_tag_group_id" clearable placeholder="请选择">
            <el-option
              v-for="item in $store.state.servicetaggroup.allServiceTagGroup"
              :key="item.id"
              :label="item.name"
              :value="String(item.id)">
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="售后模板" prop="service_name">
        <div>
          <el-select v-model="formData.service_name" clearable placeholder="请选择">
            <el-option
              v-for="item in serviceList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="采购人" prop="buyer">
        <div>
          <span class="input">
            <el-input v-model="formData.buyer" :maxlength="10">
            </el-input>
          </span>
        </div>
      </el-form-item>
      <el-form-item label="备注" prop="sys_remark">
        <div>
          <span class="input-remark">
                <el-input v-model="formData.sys_remark" :maxlength="50"></el-input>
          </span>
          <span>{{formData.sys_remark.length}}/50</span>
        </div>
        <div style="color: #999999;font-size: 12px;">备注内容用户不可见
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="$router.back()">取 消</el-button>
        <el-button @click="_submitForm(true)" :loading="loading" v-show="publish">保存并上架</el-button>
        <el-button type="primary" @click="_submitForm(false)" :loading="loading">保 存</el-button>
      </el-form-item>
    </el-form>
    <choose-tag-dialog ref="chooseTagDialog" :origin="oraTags" @submit="_chooseTagComplete"></choose-tag-dialog>
  </div>
</template>

<script>
  import ChooseTagDialog from '../../components/tag/ChooseTagDialog'
  import EditSkuComp from './EditSkuComp'
  import ProductApi from '../../api/product'
  import TagApi from '../../api/tag'
  import CategoryApi from '../../api/category'
  import ServiceApi from 'src/api/service'
  import * as ServiceTagGroupApi from 'src/api/servicetaggroup'
  import * as DRegionApi from 'src/api/dregion'
  import { mapGetters } from 'vuex'
  import ProductFormUtil from '../../utils/productFormUtil'
  import FormImageItem from 'src/common/widgets/FormImageItem.vue'
  import Cms from 'src/components/cms/Index'
  import * as FreightApi from '../../api/freight'

  const MODE_EDIT = 0
  const MODE_CREATE = 1
  const MODE_COPY = 2

  export default {
    MODE_EDIT,
    MODE_CREATE,
    MODE_COPY,
    components: {
      ChooseTagDialog,
      EditSkuComp,
      Cms,
      FormImageItem
    },
    props: {
      mode: {
        type: Number,
        default: MODE_CREATE
      },
      editId: {
        type: Number,
        default: 0
      }
    },
    data () {
      const validateImages = (rule, value, callback) => {
        if (this.formData.images) {
          if (this.formData.images.length === 0) {
            callback(new Error('请选择商品图片'))
          } else if (this.formData.images.length > 5) {
            callback(new Error('最多只能选择5张图片'))
          }
        }
        callback()
      }
      const validatePrice = (rule, value, callback) => {
        if (this.formData.price) {
          let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
          if (reg.test(this.formData.price)) {
            if (parseFloat(this.formData.price) <= 0) {
              callback(new Error('价格必须大于0"'))
              return
            }
            callback()
          } else {
            callback(new Error('请输入正确的价格'))
          }
        }
        callback()
      }
      const validateStock = (rule, value, callback) => {
        if (this.formData.stock) {
          let reg = /(^[0-9]([0-9]+)?$)/
          if (!reg.test(this.formData.stock)) {
            callback(new Error('请输入正确的库存'))
          }
        }
        callback()
      }
      const validateSpPrice = (rule, value, callback) => {
        if (this.formData.sp_price) {
          let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
          if (reg.test(this.formData.sp_price)) {
            let fSp = parseFloat(this.formData.sp_price)
            if (fSp <= 0) {
              callback(new Error('达人供货价必须大于0'))
              return
            }
            const allPrice = ProductFormUtil.getAllPrice(this.formData)
            if (allPrice.length <= 0) {
              callback()
              return
            }
            if (fSp > Math.min.apply(null, allPrice)) {
              callback(new Error('达人供货价不能大于商品价格'))
              return
            }
            callback()
          } else {
            callback(new Error('请输入正确的价格'))
          }
        }
        callback()
      }
      const validateInitialSale = (rule, value, callback) => {
        if (this.formData.initialSale) {
          let reg = /(^[1-9]([0-9]+)?$)/
          if (reg.test(this.formData.initialSale)) {
            if (parseInt(this.formData.initialSale) < 0) {
              callback(new Error('初始销量不能小于0"'))
              return
            }
            callback()
          } else {
            callback(new Error('请输入正确的初始销量'))
          }
        }
        callback()
      }
      const validateCate = (rule, value, callback) => {
        if (!this.formData.topCateId) {
          callback(new Error('请选择商品分类'))
          return
        }
        callback()
      }
      const validateSubCate = (rule, value, callback) => {
        if (!this.formData.subCateId) {
          callback(new Error('请选择商品子分类'))
          return
        }
        callback()
      }
      const validateTagPrice = (rule, value, callback) => {
        if (this.formData.tag_price) {
          let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
          if (reg.test(this.formData.tag_price)) {
            let fTagPrice = parseFloat(this.formData.tag_price)
            if (fTagPrice < 0) {
              callback(new Error('吊牌价不能为负数"'))
              return
            }
            const allPrice = []
            if (this.formData.skus && this.formData.skus.length > 0) {
              this.formData.skus.forEach(item => {
                try {
                  if (item.price && !item.del) {
                    allPrice.push(parseFloat(item.price))
                  }
                } catch (err) {
                }
              })
            }
            if (allPrice.length <= 0) {
              if (this.formData.price) {
                try {
                  allPrice.push(parseFloat(this.formData.price))
                } catch (err) {
                }
              }
            }
            if (allPrice.length <= 0) {
              callback()
              return
            }
            if (fTagPrice < Math.min.apply(null, allPrice)) {
              if (allPrice.length > 1) {
                callback(new Error('吊牌价不能小于最低的SKU商品价格'))
              } else {
                callback(new Error('吊牌价不能小于商品价格'))
              }
              return
            }
            callback()
          } else {
            callback(new Error('请输入正确的吊牌价格'))
          }
        }
        callback()
      }
      const validateWeight = (rule, value, callback) => {
        this.freightTp = 1
        this.freightList.forEach((i) => {
          if (i.id === parseInt(this.radioFid)) {
            this.freightTp = i.tp
          }
        })
        if (this.freightTp === 2) {
          let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,3})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9]{1,2})?$)/
          if (reg.test(value)) {
            if (parseFloat(value) <= 0) {
              callback(new Error('重量必须大于零'))
              return
            }
            callback()
          } else {
            callback(new Error('请输入正确的重量'))
          }
        }
        if (this.freightTp === 1) {
          if (value !== '') {
            let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,3})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9]{1,2})?$)/
            if (reg.test(value)) {
              if (parseFloat(value) < 0) {
                callback(new Error('重量必须大于零'))
                return
              }
              callback()
            } else {
              callback(new Error('请输入正确的重量'))
            }
          }
        }
        callback()
      }
      return {
        loading: false,
        formData: {
          images: [],
          shareImages: [],
          name: '',
          price: '',
          weight: '',
          stock: '',
          code: '',
          sp_price: '',
          topCateId: null,
          subCateId: null,
          isNeedIdno: false,
          initialSale: '',
          detail: '',
          tags: [],
          skus: [],
          emptySku: null,
          service_name: '',
          service_tag_group_id: '',
          delivery_region_id: '',
          tag_price: '',
          covers: [],
          sellTime: null,
          buyer: '',
          discount_item: null,
          sys_remark: '',
          fid: '0'
        },
        fileHost: '',
        fileData: {},
        fileList: [],
        pickerOptions: {
          disabledDate (date) {
            const now = new Date()
            now.setDate(now.getDate() - 1)
            return date < now
          }
        },
        rules: {
          images: [
            {validator: validateImages, trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'},
            {max: 50, message: '最大50个字符', trigger: 'blur'}
          ],
          price: [
            {required: true, message: '请输入商品价格', trigger: 'blur'},
            {validator: validatePrice, trigger: 'blur'}
          ],
          stock: [
            {required: true, message: '请输入商品库存', trigger: 'blur'},
            {validator: validateStock, trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入商品编码', trigger: 'blur'}
          ],
          sp_price: [
            {required: true, message: '请输入达人供货价', trigger: 'blur'},
            {validator: validateSpPrice, trigger: 'blur'}
          ],
          topCateId: [
            {validator: validateCate, trigger: 'blur'}
          ],
          subCateId: [
            {validator: validateSubCate, trigger: 'blur'}
          ],
          initialSale: [
            {validator: validateInitialSale, trigger: 'blur'}
          ],
          tag_price: [
            {validator: validateTagPrice, trigger: 'blur'}
          ],
          buyer: [
            {max: 10, message: '最大10个字符', trigger: 'blur'}
          ],
          fid: [
            {required: true, message: '请选择运费', trigger: 'blur'}
          ],
          weight: [
            {validator: validateWeight, trigger: 'blur'}
          ]
        },
        detail: {
          data: []
        },
        serviceList: [],
        dregionList: [],
        allsubCategory: [],
        freightList: [],
        freightTp: 0,
        radioFreight: '0',
        radioFid: ''
      }
    },
    watch: {
      radioFid: function () {
        if (this.radioFreight !== '0') {
          this.formData.fid = this.radioFid
        }
      },
      radioFreight: function () {
        if (this.radioFreight === '0') {
          this.formData.fid = '0'
          this.radioFid = ''
        }
      }
    },
    computed: {
      publish () {
        return this.mode === MODE_CREATE || this.mode === MODE_COPY
      },
      ...mapGetters({
        allCategory: 'allCategory'
      }),
      title () {
        if (this.mode === MODE_EDIT) {
          return '编辑商品'
        } else {
          return '添加商品'
        }
      },
      oraTags () {
        return this.formData.tags ? [{tags: this.formData.tags}] : []
      }
    },
    methods: {
      loadNecessaryData () {
        this.getAllCategory()
        this.getAllTag()
        this.getAllService()
        this.getAllServiceTagGroup()
        this.getAllDRegion()
        this.getAllFreight()
        if (this.mode === MODE_EDIT || this.mode === MODE_COPY) {
          this.getEditProduct()
        }
      },
      async getAllFreight () {
        try {
          let res = await FreightApi.getList()
          this.freightList = res.data.data
        } catch (err) {
          this.$myErrorHandler.handle(this, err, '查询失败')
        }
      },
      getAllCategory () {
        CategoryApi.setStoreAllCategoryList()
          .then((res) => {
          })
          .catch((err) => {
            this.$myErrorHandler.handle(this, err, '查询分类失败')
          })
      },
      getAllTag () {
        TagApi.getTagGroupList()
          .then((res) => {
          })
          .catch((err) => {
            this.$myErrorHandler.handle(this, err, '查询标签失败')
          })
      },
      async getAllService () {
        try {
          const res = await ServiceApi.getList()
          this.serviceList = res.data
        } catch (err) {
          this.$myErrorHandler.handle(this, err, '查询失败')
        }
      },
      async getAllServiceTagGroup () {
        try {
          await ServiceTagGroupApi.getList()
        } catch (err) {
          this.$myErrorHandler.handle(this, err, '查询失败')
        }
      },
      async getAllDRegion () {
        try {
          const res = await DRegionApi.getList()
          this.dregionList = res.data.data
        } catch (err) {
          this.$myErrorHandler.handle(this, err, '查询失败')
        }
      },
      getEditProduct () {
        Promise.all([ProductApi.getItem(this.editId), ProductApi.getContent(this.editId)])
          .then(([resItem, resContent]) => {
            let resProduct = resItem.data
            this.formData = ProductFormUtil.generateFormDataFromProduct(resProduct)
            if (this.formData.fid === '0') {
              this.radioFreight = '0'
            } else {
              this.radioFreight = '1'
              this.radioFid = this.formData.fid
            }
            const resContentData = resContent.data
            if (!resContentData || !resContentData.data) {
              this.detail = {
                data: []
              }
            } else {
              this.detail = resContentData
            }
            this._syncOriginImages(resProduct)
            this._syncOriginCover(resProduct.cover)
            this._cateChange(this.formData.topCateId)
          })
          .catch((err) => {
            console.log('err', err)
            this.$myErrorHandler.handle(this, err)
          })
      },
      _syncOriginImages (prod) {
        if (prod.share_images) {
          let shareImages = []
          prod.share_images.forEach((item) => {
            shareImages.push({
              name: '',
              url: item,
              ossUrl: item
            })
          })
          this.formData.shareImages = shareImages
        }
        let newFileList = []
        prod.images.forEach((item) => {
          newFileList.push({
            name: '',
            url: item,
            ossUrl: item
          })
        })
        this.formData.images = newFileList
        this.fileList = newFileList
      },
      _syncOriginCover (cover) {
        if (cover) {
          this.formData.covers = [{name: '', url: cover, ossUrl: cover}]
        }
      },

      _chooseTag () {
        this.$refs.chooseTagDialog.show()
      },
      _chooseTagComplete (result) {
        this.formData.tags = result.component.chooseTags
        result.component.hide()
      },

      _createNewSku () {
        this.formData.skus.push({
          id: 0,
          spec: '',
          price: this.formData.skus.length === 0 ? this.formData.price : '',
          stock: this.formData.skus.length === 0 ? this.formData.stock : '',
          code: this.formData.skus.length === 0 ? this.formData.code : '',
          weight: this.formData.skus.length === 0 ? this.formData.weight : '',
          image: ''
        })
        if (this.formData.skus.length === 1) {
          this.formData.price = ''
          this.formData.stock = ''
          this.formData.code = ''
          this.formData.weight = ''
        }
      },
      _hasRealSku (skuArr) {
        return ProductFormUtil.hasRealSku(skuArr)
      },
      _delLastSku (item) {
        this.formData.price = item.price
        this.formData.stock = item.stock
        this.formData.code = item.code
        this.formData.weight = item.weight
      },

      _editorContentChanged (obj) {
        this.formData.detail = obj.content
      },
      // oneStep 保存并上架
      _submitForm (oneStep) {
        this.$refs.form.validate((validFrom) => {
          if (validFrom) {
            if (this.mode === MODE_EDIT) {
              this._updateProduct()
            } else {
              this._createdProduct(oneStep)
            }
          } else {
            for (const item of this.$refs.form.fields) {
              if (item.validateState === 'error' && item.validateMessage) {
                this.$message({
                  showClose: true,
                  message: item.validateMessage,
                  type: 'error'
                })
                break
              }
            }
          }
        })
      },
      async _createdProduct (oneStep) {
        this.loading = true
        try {
          const res = await ProductApi.create(this.formData)
          if (oneStep) {
            await ProductApi.updateStatus(res.data.id, 1)
          }
          await ProductApi.updateContent(res.data.id, this.detail)
          this.$message({
            showClose: true,
            message: '创建成功',
            type: 'info'
          })
          this.loading = false
          this.$emit('created', res.data)
          this.$eventBus.emit('createdProduct')
          this.$router.back()
        } catch (err) {
          this.loading = false
          this.$myErrorHandler.handle(this, err)
        }
      },
      async _updateProduct () {
        this.loading = true
        try {
          const res = await ProductApi.update(this.editId, this.formData)
          await ProductApi.updateContent(res.data.id, this.detail)
          this.loading = false
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'info'
          })
          this.$emit('updated')
          this.$router.back()
        } catch (err) {
          this.loading = false
          this.$myErrorHandler.handle(this, err)
        }
      },

      hashSubCategory (cateId) {
        let subcate = this.allCategory.find((item) => {
          return item.id === cateId
        })
        if (subcate && subcate.categorys && subcate.categorys.length > 0) {
          return true
        }
        return false
      },
      _cateChange (val) {
        let sub = this.allCategory.find((item) => {
          return item.id === val
        })
        if (sub) {
          this.allsubCategory = sub.categorys || []
        } else {
          this.allsubCategory = []
        }
        if (this.allsubCategory.length === 0) {
          this.formData.subCateId = null
        }
      }
    },
    mounted () {
      this.loadNecessaryData()
    }
  }
</script>

<style lang="less" scoped>

  .unit {
    margin-right: 5px;
  }

  .name-input {
    display: inline-block;
    width: 500px;
  }

  .input {
    display: inline-block;
    width: 150px;
    margin-right: 5px;
  }

  .input-remark {
    display: inline-block;
    width: 680px;
    margin-right: 5px;
  }

  .editor {
    max-width: 750px;
  }
</style>
