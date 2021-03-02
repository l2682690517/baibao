<template>
  <div>
    <el-row v-for="(item, index) in items" :key="item.id">
      <el-col class="discount-content " :span="3">
        <div class="product-icon">
        <div  class="cover" v-lazy:background-image="item.product.cover || item.product.images[0]">
          <!--<img class="img-responsive" :src="item.product.cover || item.product.images[0]"/>-->
          <div v-if="_getProdStatusName(item.product)">{{_getProdStatusName(item.product)}}</div>
        </div>
        </div>
      </el-col>
      <el-col :span="6" class="discount-content">
        <div class="name">{{item.product.name}}</div>
      </el-col>
      <el-col :span="4" class="discount-content">
        <div>原价 {{item.product | originPrice}}</div>
        <div>达人利润<span v-if="item.product.ext">{{item.product | productProfit}}</span></div>
      </el-col>
      <el-col :span="4" class="discount-content">
        折扣
        <el-form-item label="" :error="disRateErrors[index]">
          <el-input size="mini" v-model="item.dis_rate" @blur="_blurDiscountRate(index)" style="width: 80%"></el-input>&nbsp;折
        </el-form-item>
      </el-col>
      <el-col :span="4" class="discount-content">
        折后价
        <el-form-item label="" :error="disPriceErros[index]">
          <el-input size="mini" v-model="item.seckill_price" @blur="_blurDiscountPrice(index)"
                    style="width: 80%"></el-input>&nbsp;元
        </el-form-item>
      </el-col>
      <el-col :span="3" class="discount-content">
        <el-button class="delete-btn" size="mini" type="danger" icon="delete"
                   @click="_delete(index)"
        >删除
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Vue from 'vue'
  import PriceUtil from '../../utils/priceUtil'
  import ProductFormUtil from '../../utils/productFormUtil'

  // 类型，0- 原始状态, 1-以价格为准，2-以折扣为准 ,
  const TP_BASE_ORIGIN = 0
  const TP_BASE_PRICE = 1
  const TP_BASE_DIS_RATE = 2

  export default {
    props: {
      items: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        rules: [],
        disRateErrors: [],
        disPriceErros: []
      }
    },
    methods: {
      _getProdStatusName(prod) {
        return ProductFormUtil.getProdTagName(prod)
      },
      batchSetDiscountRate(rate) {
        this.items.forEach((item, index) => {
          item.dis_rate = rate
          this._blurDiscountRate(index)
        })
      },

      batchSetDiscountPrice(targetPrice) {
        this.items.forEach((item, index) => {
          item.seckill_price = targetPrice
          this._blurDiscountPrice(index)
        })
      },

      validateAll(callback) {
        let isAllValid = true
        isAllValid = this._requireInputValue()
        if (!isAllValid) {
          callback(isAllValid)
          return
        }
        isAllValid = this._validateZeroSeckillPrice()
        if (!isAllValid) {
          callback(isAllValid)
          return
        }
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].tp === TP_BASE_ORIGIN) {
            isAllValid = false
          }
        }
        callback(isAllValid)
      },

      resetAllFields() {
        for (let i = 0; i < this.items.length; i++) {
          Vue.set(this.disRateErrors, i, '')
          Vue.set(this.disPriceErros, i, '')
        }
      },

      _delete(index) {
        this.items.splice(index, 1)
      },

      _requireInputValue() {
        let isAllValid = true
        for (let i = 0; i < this.items.length; i++) {
          if (!this.items[i].dis_rate) {
            Vue.set(this.disRateErrors, i, '请输入0.1~9.9之间的数字(最多一位小数)')
            isAllValid = false
          }
          if (!this.items[i].seckill_price) {
            Vue.set(this.disPriceErros, i, '请输入大于0的数字(限两件小数)')
            isAllValid = false
          }
        }
        return isAllValid
      },

      _validateZeroSeckillPrice() {
        let isAllValid = true
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].seckill_price === '0') {
            Vue.set(this.disPriceErros, i, '折后价格不能为0')
            isAllValid = false
          }
        }
        return isAllValid
      },

      _blurDiscountRate(index) {
        if (this._validateDiscountRate(index)) {
          this._updateDisItemByDiscountRate(index)
          // 强制加一条，对于折扣价格为0的验证
          if (this.items[index].seckill_price === '0') {
            Vue.set(this.disPriceErros, index, '折后价格不能为0')
          }
        } else {
          this._resetDisItem(index)
        }
      },

      _blurDiscountPrice(index) {
        if (this._validateDiscountPrice(index)) {
          const disItem = this.items[index]
          if (!PriceUtil.isInputDiscountRangePrice(disItem.product)) {
            this._updateDisItemByDiscountPrice(index)
          }
        } else {
          this._resetDisItem(index)
        }
      },

      _validateDiscountRate(index) {
        const disItem = this.items[index]
        const val = disItem.dis_rate
        const errMsg = PriceUtil.validateInputDiscountRate(val)
        Vue.set(this.disRateErrors, index, errMsg)
        if (errMsg === '') {
          return true
        } else {
          return false
        }
      },

      _validateDiscountPrice(index) {
        const disItem = this.items[index]
        const val = disItem.seckill_price
        if (PriceUtil.isInputDiscountRangePrice(disItem.product)) {
          const disRate = parseFloat(disItem.dis_rate)
          const errMsg = PriceUtil.validateInputDiscountRangePrice(disItem.product, disRate, val)
          Vue.set(this.disPriceErros, index, errMsg)
          if (errMsg === '') {
            return true
          } else {
            return false
          }
        } else {
          const errMsg = PriceUtil.validateInputDiscountPrice(disItem.product, val)
          Vue.set(this.disPriceErros, index, errMsg)
          if (errMsg === '') {
            return true
          } else {
            return false
          }
        }
      },

      _updateDisItemByDiscountRate(index) {
        const disItem = this.items[index]
        const disRate = parseFloat(disItem.dis_rate)
        disItem.tp = TP_BASE_DIS_RATE
        disItem.discount = disRate.mul(10)
        disItem.dis_rate = String(disRate)
        disItem.price = 0
        disItem.seckill_price = PriceUtil.getPriceForOutputByDiscount(disItem.product, disRate * 0.1)
        Vue.set(this.disRateErrors, index, '')
        Vue.set(this.disPriceErros, index, '')
      },

      _updateDisItemByDiscountPrice(index) {
        const disItem = this.items[index]
        const disPrice = parseFloat(disItem.seckill_price)
        disItem.tp = TP_BASE_PRICE
        disItem.discount = 0
        disItem.dis_rate = PriceUtil.getDiscountForOutputByPrice(disItem.product, disPrice.mul(100))
        disItem.price = disPrice.mul(100)
        disItem.seckill_price = String(disPrice)
        Vue.set(this.disRateErrors, index, '')
        Vue.set(this.disPriceErros, index, '')
      },

      _resetDisItem(index) {
        const disItem = this.items[index]
        disItem.tp = TP_BASE_ORIGIN
        disItem.discount = 0
        disItem.dis_rate = ''
        disItem.price = 0
        disItem.seckill_price = ''
      }
    }
  }
</script>

<style scoped lang="less">



  .discount-content {
    height: 90px;
    border-left: 1px solid #dbdcdf;
    border-bottom: 1px solid #dbdcdf;
    text-align: center;
    padding-left: 5px;
    padding-right: 5px;

    &:last-child {
      border-right: 1px solid #dbdcdf;
    }

    .name {
      overflow: hidden;
      width: 100%;
      height: 100%;
    }
    .product-icon {

        width: 70px;
        height: 70px;
        margin: 10px 5px;
    }
    .cover {
      text-align: center;
      width: 70px;
      height: 70px;
      background-size: cover;
      background-repeat: no-repeat;
      div{
        height: 24px;
        width: 60px;
        position:absolute;
        bottom:10px;
        padding:0px;
        margin:0px 5px;
        background: #ffffff;
        border:solid 1px #888888;
        font-size: 12px;
        line-height: 24px;
        border-radius:3px;
      }
    }
  }

  .delete-btn {
    margin-top: 35px;
  }

</style>
