<template>
  <div class="sku-wrap">
    <div class="sku-container">
      <el-row class="sku-header">
        <el-col class="header-item spec">规格</el-col>
        <el-col class="header-item price">价格</el-col>
        <el-col class="header-item stock">库存</el-col>
        <el-col class="header-item code">编码</el-col>
        <el-col class="header-item weight">重量(kg)</el-col>
        <el-col class="header-item pic">图片</el-col>
        <el-col class="header-item del">&nbsp;</el-col>
      </el-row>
      <el-row v-for="(item, index) in realSkus" :key="item.id">
        <el-col class="sku-content spec">
          <el-form-item label="" :prop="'skus.' + index + '.spec'" :rules="rules.spec">
            <el-input size="small" v-model="item.spec">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="sku-content price">
          <el-form-item label="" :prop="'skus.' + index + '.price'" :rules="rules.price">
            <el-input size="small" v-model="item.price">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="sku-content stock">
          <el-form-item label="" :prop="'skus.' + index + '.stock'" :rules="rules.stock">
            <el-input size="small" v-model="item.stock">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="sku-content code">
          <el-form-item label="" :prop="'skus.' + index + '.code'" :rules="rules.code">
            <el-input size="small" v-model="item.code">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="sku-content weight">
          <el-form-item label="" :prop="'skus.' + index + '.weight'" :rules="rules.weight">
            <el-input size="small" v-model="item.weight">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="sku-content pic">
          <el-form-item prop="image">
            <img class="sku-img" v-if="item.image" :src="item.image" @click="showUploadSkuDialog(item, index)">
            <el-button v-else icon="el-icon-plus"
                       @click="showUploadSkuDialog(item, index)"
            ></el-button>
          </el-form-item>
        </el-col>
        <el-col class="sku-content del">
          <el-button class="delete-btn" size="small" type="danger" icon="el-icon-delete"
                     @click="_deleteSku(item, index)"
          ></el-button>
        </el-col>
      </el-row>
    </div>
    <el-row class="input-tip" v-if="prod.discount_item">折后价:{{prod.discount_item.seckill_price}} 元</el-row>
    <upload-image-dialog ref="dlgskuUpload" :max="1" tip="建议尺寸128*128像素"
                         @uploadCompleted="uploadSkuCompleted"></upload-image-dialog>

  </div>
</template>

<script>
  import Vue from 'vue'
  import UploadImageDialog from 'src/common/widgets/UploadImageDialog'
  import ProductFromUtil from '../../utils/productFormUtil'

  export default {
    components: {
      UploadImageDialog
    },
    props: {
      prod: {
        type: Object
      },
      list: {
        type: Array
      },
      fid: {
        type: String
      }
    },
    data () {
      const validateWeight = (rule, value, callback) => {
        this.tp = 1
        this.list.forEach((i) => {
          if (i.id === parseInt(this.fid)) {
            this.tp = i.tp
          }
        })
        if (this.tp === 2) {
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
        } if (this.tp === 1) {
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
      const validatePrice = (rule, value, callback) => {
        if (value) {
          let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
          if (reg.test(value)) {
            if (parseFloat(value) <= 0) {
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
        if (value) {
          let reg = /(^[0-9]([0-9]+)?$)/
          if (!reg.test(value)) {
            callback(new Error('请输入正确的库存'))
          }
        }
        callback()
      }
      return {
        tp: 0,
        rules: {
          spec: [
            {required: true, message: '请输入规格', trigger: 'blur'},
            {min: 0, max: 30, message: '长度最大30个字符', trigger: 'blur'}
          ],
          price: [
            {required: true, message: '请输入价格', trigger: 'blur'},
            {validator: validatePrice, trigger: 'blur'}
          ],
          stock: [
            {required: true, message: '请输入库存', trigger: 'blur'},
            {validator: validateStock, trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入编码', trigger: 'blur'}
          ],
          image: [],
          weight: [
            {validator: validateWeight, trigger: 'blur'}
          ]
        },
        currentItem: {}
      }
    },
    computed: {
      realSkus () {
        return ProductFromUtil.getRealSkuArr(this.prod.skus)
      }
    },
    methods: {
      _skuItemName (index) {
        return `skuForm${index}`
      },
      _deleteSku (item, index) {
        const currentItem = item
        if (item.id === 0) {
          this.prod.skus.splice(index, 1)
        } else {
          Vue.set(item, 'del', true)
        }
        if (this.prod.skus.findIndex(
            (item) => {
              return !item.del
            }) === -1) {
          this.$emit('del-last-sku', currentItem)
        }
      },
      showUploadSkuDialog (item, index) {
        this.currentItem = item
        this.$refs.dlgskuUpload.show()
      },
      uploadSkuCompleted (images) {
        if (images.length !== 1) {
          this.$message({
            message: '最多可以上传1张图',
            type: 'error',
            showClose: true
          })
          return
        }
        images.forEach((item) => {
          this.currentItem.image = item.ossUrl
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .sku-wrap {
    overflow: hidden;
    overflow-x: auto; /* 1 */
    -webkit-backface-visibility: hidden;
    white-space: nowrap;
    .sku-container {
      width: 840px;
      .sku-header {
        background-color: #eef1f6;

        .header-item {
          border-left: 1px solid #dbdcdf;
          border-top: 1px solid #dbdcdf;
          border-bottom: 1px solid #dbdcdf;
          text-align: center;

          &:last-child {
            border-right: 1px solid #dbdcdf;
          }
        }

      }

      .sku-content {
        padding: 10px;
        height: 70px;
        border-left: 1px solid #dbdcdf;
        border-bottom: 1px solid #dbdcdf;
        text-align: center;

        &:last-child {
          border-right: 1px solid #dbdcdf;
        }
        .sku-img {
          height: 40px;
          width: 50px;
          cursor: pointer;
          vertical-align: middle
        }
        .delete-btn {
          width: 20px;
          height: 20px;
          padding: 0;
        }
      }

      .spec {
        width: 170px;
      }
      .price {
        width: 120px;
      }
      .stock {
        width: 120px;
      }
      .code {
        width: 170px;
      }
      .weight {
        width: 120px;
      }
      .pic {
        width: 70px;
      }
      .del {
        width: 70px;
      }
    }
  }
</style>
