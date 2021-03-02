<template>
  <div>
    <el-form ref="form" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="类型" prop="put_tp" :required="true">
        <el-radio class="radio" v-model="formData.put_tp" :label="2" :key="formData.put_tp" :disabled="isDisabled">
          手动发放
        </el-radio>
        <el-radio class="radio" v-model="formData.put_tp" :label="1" :key="formData.put_tp" :disabled="isDisabled">
          系统发放
        </el-radio>
        <el-radio class="radio" v-model="formData.put_tp" :label="3" :key="formData.put_tp" :disabled="isDisabled">
          定向发放
        </el-radio>
        <el-radio class="radio" v-model="formData.put_tp" :label="4" :key="formData.put_tp" :disabled="isDisabled">
          详情页领券
        </el-radio>
      </el-form-item>
      <el-form-item label="分享设置" prop="share" :required="true" v-if="formData.put_tp === $options.PUT_TYPE_MANUAL">
        <div>
          <el-checkbox class="radio" v-model="formData.share" :label="1" :key="formData.share" disabled>
            允许分享
          </el-checkbox>
        </div>
        <div>{{shareText}}</div>
      </el-form-item>
      <el-form-item label="发放时机" prop="put_point" :required="true" v-if="formData.put_tp === $options.PUT_TYPE_SYSTEM">
        <el-radio class="radio" v-model="formData.put_point" :label="$options.PUT_POINT_ORDER_COUNT"
                  :key="formData.put_point"
                  :disabled="isDisabled">
          {{$options.getFriendlyNameOfPutPoint($options.PUT_POINT_ORDER_COUNT)}}
        </el-radio>
        <el-radio class="radio" v-model="formData.put_point" :label="$options.PUT_POINT_ORDER_AMOUNT"
                  :key="formData.put_point"
                  :disabled="isDisabled">
          {{$options.getFriendlyNameOfPutPoint($options.PUT_POINT_ORDER_AMOUNT)}}
        </el-radio>
        <el-radio class="radio" v-model="formData.put_point" :label="$options.PUT_POINT_NEW_USER"
                  :key="formData.put_point"
                  :disabled="isDisabled">
          {{$options.getFriendlyNameOfPutPoint($options.PUT_POINT_NEW_USER)}}
        </el-radio>
        <el-radio class="radio" v-model="formData.put_point" :label="$options.PUT_POINT_OPEN_SHOP"
                  :key="formData.put_point"
                  :disabled="isDisabled">
          {{$options.getFriendlyNameOfPutPoint($options.PUT_POINT_OPEN_SHOP)}}
        </el-radio>
        <el-radio class="radio" v-model="formData.put_point" :label="$options.PUT_POINT_SHOP_BIND_MOBILE"
                  :key="formData.put_point"
                  :disabled="isDisabled">
          {{$options.getFriendlyNameOfPutPoint($options.PUT_POINT_SHOP_BIND_MOBILE)}}
        </el-radio>
      </el-form-item>
      <el-form-item label="发放总量" prop="put_total" v-if="formData.put_tp === $options.PUT_TYPE_MANUAL">
        <span class="input">
                <el-input v-model="formData.put_total" :disabled="isDisabled"></el-input>
          </span>
        <span class="input-tip">输入0表示无限制</span>
      </el-form-item>
      <!--消费相关-->
      <el-form-item label="消费时限" prop="orderTickRange" :required="true"
                    v-if="formData.put_tp == $options.PUT_TYPE_SYSTEM &&
                    (formData.put_point === $options.PUT_POINT_ORDER_AMOUNT || formData.put_point === $options.PUT_POINT_ORDER_COUNT)">
        <el-date-picker
          ref="timePicker"
          :picker-options="timePickerOptions"
          v-model="formData.orderTickRange"
          type="daterange"
          placeholder="选择消费时限"
          align="right"
          :editable="false"
          :disabled="isDisabled"
          @change="timePickerChange">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="累计消费" prop="order_n" :required="true"
                    v-if="formData.put_tp == $options.PUT_TYPE_SYSTEM &&
                    (formData.put_point === $options.PUT_POINT_ORDER_AMOUNT || formData.put_point === $options.PUT_POINT_ORDER_COUNT)">
        <span class="input">
                <el-input v-model="formData.order_n" :disabled="isDisabled"></el-input>
        </span>
        <span>{{formData.put_point === $options.PUT_POINT_ORDER_AMOUNT ? '元' : '次'}}</span>
      </el-form-item>
      <!--消费相关,结束-->
      <hr/>
      <el-form-item label="名称" prop="name">
        <el-input
          class="name-input"
          placeholder="最多10个字"
          v-model="formData.name"
          :maxlength="10">
        </el-input>
      </el-form-item>
      <el-form-item label="面值" prop="amount">
        <div>
          <span class="input">
                <el-input v-model="formData.amount" :disabled="isDisabled"></el-input>
          </span>
          <span>元</span>
        </div>
      </el-form-item>
      <el-form-item label="使用门槛" prop="full_amount">
        <div>
          <span class="full">满</span>
          <span class="input">
                <el-input v-model="formData.full_amount" :disabled="isDisabled"></el-input>
          </span>
          <span>元</span>
          <span class="input-tip">输入0表示无限制</span>
        </div>
      </el-form-item>
      <el-form-item label="每人发放" prop="quota" :required="true">
        <div>
          <el-select class="num-select" v-model="formData.quota" placeholder="请选择" :disabled="isDisabled">
            <el-option
              v-for="item in 10"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="有效期" prop="expiry">
        <div class="expiry">
          <el-radio class="radio" v-model="formData.expiry_tp" :label="1" :disabled="isDisabled">
            <span class="full">
            固定日期</span>
            <el-date-picker
              ref="timePicker"
              :picker-options="timePickerOptions"
              v-model="formData.tickRange"
              type="daterange"
              placeholder="选择有效期"
              align="right"
              :editable="false"
              :disabled="isDisabled || formData.expiry_tp !== 1"
              @change="timePickerChange">
            </el-date-picker>
          </el-radio>
        </div>
        <div class="expiry">
          <el-radio class="radio" v-model="formData.expiry_tp" :label="2" :disabled="isDisabled">
            <span class="full">领券后</span> <span class="input expiryday"> <el-input class="expiryday" :maxlength="3"
                                                                                   v-model="formData.expiry_day"
                                                                                   :disabled="isDisabled || formData.expiry_tp !== 2"></el-input></span><span>天失效 </span>
            <span class="input-tip">输入1~180之间的整数</span>
          </el-radio>

        </div>
      </el-form-item>
      <el-form-item label="适用商品" prop="range_tp" :required="true">
        <div>
          <el-radio class="radio" v-model="formData.range_tp" :label="1" :disabled="isDisabled">
            全部商品
          </el-radio>
          <el-radio class="radio" v-model="formData.range_tp" :label="3" :disabled="isDisabled">
            指定商品
          </el-radio>
        </div>
        <div>
          <product-list ref="productList" :originalInclude="formData.product_list"
                        :excludePidList="formData.exclude_pid_list"
                        :originalExclude="formData.exclude_product_list" :type="formData.range_tp"
                        :mode="mode"></product-list>
        </div>
      </el-form-item>
      <el-form-item label="备注">
        <div>
          <span class="input-remark">
                <el-input v-model="formData.sys_remark" :maxlength="50"></el-input>
          </span>
          <span>{{formData.sys_remark.length}}/50</span>
        </div>
        <div>备注内容用户不可见</div>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" @click="$router.back()">取 消</el-button>
        <el-button size="medium" type="primary" @click="submit()" :loading="loading">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {checkIsMoney, convertYuanToFen} from 'src/utils/moneyUtil'
  import {
    getFriendlyNameOfPutPoint,
    PUT_POINT_OPEN_SHOP, PUT_POINT_SHOP_BIND_MOBILE, PUT_POINT_NEW_USER, PUT_POINT_ORDER_AMOUNT, PUT_POINT_ORDER_COUNT,
    RANGE_TYPE_PRODUCT, PUT_TYPE_MANUAL, PUT_TYPE_SYSTEM
  } from 'src/constants/voucher'
  import ProductList from './ProductList'
  import * as VoucherApi from 'src/api/voucher'
  import {generateFormDataFromVoucher} from 'src/utils/voucherFormUtil'
  import {getNowDateTick} from 'src/utils/dateTimeUtil'

  const MODE_DEFAULT = 0
  const MODE_EDIT = 1

  export default {
    MODE_DEFAULT,
    MODE_EDIT,
    getFriendlyNameOfPutPoint,
    PUT_POINT_OPEN_SHOP,
    PUT_POINT_SHOP_BIND_MOBILE,
    PUT_POINT_NEW_USER,
    PUT_POINT_ORDER_AMOUNT,
    PUT_POINT_ORDER_COUNT,
    PUT_TYPE_MANUAL,
    PUT_TYPE_SYSTEM,
    props: {
      mode: {
        type: Number,
        default: MODE_DEFAULT
      }
    },

    components: {
      ProductList
    },

    data() {
      const validateOrderN = (rule, value, callback) => {
        if (this.formData.order_n) {
          if (this.formData.put_point === PUT_POINT_ORDER_AMOUNT) {
            if (checkIsMoney(this.formData.order_n)) {
              const fen = convertYuanToFen(this.formData.order_n)
              if (fen < 0) {
                callback(new Error('请输入适合的数字'))
                return
              }
            } else {
              callback(new Error('请输入适合的数字'))
            }
          } else if (this.formData.put_point === PUT_POINT_ORDER_COUNT) {
//            console.log(111, this.formData.order_n, parseInt(this.formData.order_n))
            let reg = /(^[0-9]([0-9]+)?$)/
            if (reg.test(this.formData.order_n)) {
              if (parseInt(this.formData.order_n) < 0) {
                callback(new Error('请输入适合的数字'))
                return
              }
              callback()
            } else {
              callback(new Error('请输入适合的数字'))
            }
          }
        }
        callback()
      }

      const validateAmount = (rule, value, callback) => {
        if (this.formData.amount) {
          if (checkIsMoney(this.formData.amount)) {
            const fen = convertYuanToFen(this.formData.amount)
            if (fen < 0) {
              callback(new Error('请输入适合的数字'))
              return
            } else if (fen > 1000000) {
              callback(new Error('不能大于10000'))
              return
            }
          } else {
            callback(new Error('请输入适合的数字'))
          }
        }
        callback()
      }

      const validateFullAmount = (rule, value, callback) => {
        if (this.formData.full_amount) {
          if (checkIsMoney(this.formData.full_amount)) {
            const fullFen = convertYuanToFen(this.formData.full_amount)
            if (fullFen < 0) {
              callback(new Error('请输入适合的数字"'))
              return
            }
            if (fullFen === 0) {
              callback()
              return
            }
          } else {
            callback(new Error('请输入适合的数字'))
            return
          }
        }
        callback()
      }

      const validateExpiry = (rule, value, callback) => {
        if (this.formData.expiry_tp !== 1 && this.formData.expiry_tp !== 2) {
          callback(new Error('该选项不可为空'))
        } else if (this.formData.expiry_tp === 1) {
          let tickRange = this.formData.tickRange
          if (tickRange.length < 2 || !tickRange[0] || !tickRange[1]) {
            callback(new Error('请选择有效期'))
          } else {
            if (this.mode === MODE_DEFAULT && tickRange[0].getTime() < getNowDateTick()) {
              callback(new Error('有效期起止时间需要大于当前日期'))
              return
            }
            callback()
          }
        } else if (this.formData.expiry_tp === 2) {
          let days = this.formData.expiry_day
          let reg = /(^[0-9]([0-9]+)?$)/
          if (reg.test(days)) {
            if (parseInt(days) < 1 || parseInt(days) > 180) {
              callback(new Error('请输入1~180之间的整数'))
              return
            }
            callback()
          } else {
            callback(new Error('请输入1~180之间的整数'))
          }
        }
      }

      const validateOrderTickRange = (rule, value, callback) => {
        if (!(this.formData.put_tp === PUT_TYPE_SYSTEM && (this.formData.put_point === PUT_POINT_ORDER_AMOUNT || this.formData.put_point === PUT_POINT_ORDER_COUNT))) {
          callback()
          return
        }

        let tickRange = this.formData.orderTickRange
        if (tickRange.length < 2 || !tickRange[0] || !tickRange[1]) {
          callback(new Error('请选择消费时限'))
        } else {
          callback()
        }
      }

      const validateChoosePids = (rule, value, callback) => {
        if (this.formData.range_tp === RANGE_TYPE_PRODUCT && this.$refs.productList.getChooseIds().length <= 0) {
          callback(new Error('请选择商品'))
          return
        }
        callback()
      }

      const validatePutTotal = (rule, value, callback) => {
        if (this.formData.put_total) {
          let reg = /(^[0-9]([0-9]+)?$)/
          if (reg.test(this.formData.put_total)) {
            if (parseInt(this.formData.stock) < 0) {
              callback(new Error('不能小于0'))
              return
            }
            callback()
          } else {
            callback(new Error('请输入适合的数字'))
          }
        }
        callback()
      }

      return {
        loading: false,
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {max: 10, message: '最大10个字符', trigger: 'blur'}
          ],
          amount: [
            {required: true, message: '请输入面值', trigger: 'blur'},
            {validator: validateAmount, trigger: 'blur'}
          ],
          full_amount: [
            {required: true, message: '请输入使用门槛', trigger: 'blur'},
            {validator: validateFullAmount, trigger: 'blur'}
          ],
          expiry: [
            {validator: validateExpiry, trigger: 'change'}
          ],
          range_tp: [
            {validator: validateChoosePids, trigger: 'blur'}
          ],
          put_total: [
            {required: true, message: '请输入发放总量', trigger: 'blur'},
            {validator: validatePutTotal, trigger: 'blur'}
          ],
          orderTickRange: [
            {validator: validateOrderTickRange, trigger: 'change'}
          ],
          order_n: [
            {required: true, message: '请输入发放门槛', trigger: 'blur'},
            {validator: validateOrderN, trigger: 'blur'}
          ]
        },
        formData: {
          put_tp: 2,
          name: '',
          put_point: this.$options.PUT_POINT_ORDER_AMOUNT,
          put_total: '',
          amount: '',
          full_amount: '',
          quota: 1,
          tickRange: [],
          range_tp: 1,
          exclude_product_list: [],
          product_list: [],
          exclude_pid_list: [],
          share: true,
          expiry_tp: 1,
          expiry_day: '',
          sys_remark: '',
          orderTickRange: [], // 消费时限
          order_n: '' // 消费N元或N单
        },
        timePickerOptions: {
          shortcuts: [{
            text: '最近三天',
            onClick(picker) {
              const start = new Date(Date.now() - 3600 * 1000 * 24 * 2)
              const end = new Date()
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近七天',
            onClick(picker) {
              const start = new Date(Date.now() - 3600 * 1000 * 24 * 6)
              const end = new Date()
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const start = new Date(Date.now() - 3600 * 1000 * 24 * 29)
              const end = new Date()
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    },

    computed: {
      isDisabled() {
        return this.mode === MODE_EDIT
      },
      shareText() {
        return this.formData.share ? '平台首页不可见' : '平台首页可见'
      }
    },

    methods: {
      timePickerChange(val) {
      },
      async create() {
        await VoucherApi.create(this.formData, this.$refs.productList.getChooseIds())
        this.$message({
          message: '创建成功',
          showClose: true,
          type: 'success'
        })
        this.$router.back()
      },
      async update() {
        await VoucherApi.update(parseInt(this.$route.params.id), this.formData, this.$refs.productList.getChooseIds())
        this.$message({
          message: '更新成功',
          showClose: true,
          type: 'success'
        })
        this.$router.back()
      },
      submit() {
        this.$refs.form.validate(async (validFrom) => {
          if (validFrom) {
            this.$confirm('确认提交?', '提示').then(async () => {
              this.loading = true
              try {
                if (this.mode === MODE_DEFAULT) {
                  await this.create()
                } else {
                  await this.update()
                }
                this.loading = false
              } catch (e) {
                this.$myErrorHandler.handle(this, e)
                this.loading = false
              }
            }).catch(() => {
            })
          }
        })
      },
      async getEditItem() {
        if (this.mode === MODE_EDIT) {
          try {
            const resResult = await VoucherApi.getItem(parseInt(this.$route.params.id))
            this.formData = generateFormDataFromVoucher(resResult.data)
          } catch (e) {
            this.$myErrorHandler.handle(this, e)
          }
        }
      }
    },
    async mounted() {
      this.getEditItem()
    }
  }
</script>

<style lang="scss" scoped>

  .name-input {
    display: inline-block;
    width: 220px;
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

  .full {
    margin-right: 5px;
  }

  .num-select {
    width: 80px;
  }

  .expiry {
    margin-bottom: 10px;
    .expiryday {
      margin-right: 10px;
      width: 60px;
    }
  }
</style>
