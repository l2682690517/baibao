<template>
  <div>
    <el-dialog :title="title" width="70%" :visible.sync="dialogVisible">
      <el-form ref="modelForm" label-width="100px" label-position="left" v-loading="loading" :model="model"
               :rules="rules">
        <el-form-item label="限时折扣名称" prop="name">
          <el-input v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="折扣持续时间" prop="end_time">
          <el-date-picker
            ref="timePicker"
            :picker-options="timePickerOptions"
            v-model="timeRange"
            type="datetimerange"
            placeholder="选择时间范围"
            align="right"
            :editable="false"
            :clearable="false"
            @change="_timePickerChange">
          </el-date-picker>
        </el-form-item>
        <el-form-item label-width="0">
          <el-row class="discount-item-header">
            <el-col :span="8">
              <div class="item-content-wrapper">
                <el-form-item prop="count" label-width="0">
                  <span>限购数量&nbsp;&nbsp;</span>
                  <el-input v-model="model.count" placeholder="不限"></el-input>
                  <span>&nbsp;件</span>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div v-show="model.items && model.items.length >= 2" class="item-content-wrapper">
                <el-form-item label-width="0" :error="batchDiscountRateError">
                  <span>批量设置&nbsp;&nbsp;</span>
                  <el-input v-model="batchDiscountRateText"
                            @blur="_batchSetDiscountRate"></el-input>
                  <span>&nbsp;&nbsp;折</span>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div v-show="model.items && model.items.length >= 2" class="item-content-wrapper">
                <el-form-item label-width="0" :error="batchDiscountPriceError">
                  <span>批量设置&nbsp;&nbsp;</span>
                  <el-input placeholder="折后价" v-model="batchDiscountPriceText"
                            @blur="_batchSetDiscountPrice"></el-input>
                  <span>&nbsp;&nbsp;元</span>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <edit-discount-items ref="discountItems" :items="model.items"></edit-discount-items>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="items" label-width="0">
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="_addProduct">添加打折商品</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="_submitForm">确 定</el-button>
      </div>
    </el-dialog>
    <add-product-dialog ref="dlgAddProduct" :originItems="model.items" @submit="_onChooseProduct"></add-product-dialog>
  </div>
</template>

<script>
  import EditDiscountItems from './EditDiscountItems'
  import AddProductDialog from './AddProductDialog'
  import DiscountApi from '../../api/discount'
  import PriceUtil from '../../utils/priceUtil'

  const MODE_EDIT = 0
  const MODE_CREATE = 1

  export default {
    MODE_EDIT,
    MODE_CREATE,

    components: {
      EditDiscountItems,
      AddProductDialog
    },
    props: {
      mode: {
        type: Number,
        default: MODE_EDIT
      },
      editId: {
        type: Number,
        default: 0
      }
    },
    data() {
      const validatCount = (rule, value, callback) => {
        if (this.model.count) {
          let reg = /(^[1-9]([0-9]+)?$)/
          if (reg.test(this.model.count)) {
            if (parseInt(this.model.count) <= 0) {
              callback(new Error('请输入正整数"'))
              return
            }
            callback()
            return
          } else {
            callback(new Error('请输入正整数'))
            return
          }
        }
        callback()
      }
      const validatItems = (rule, value, callback) => {
        if (!this.model.items || this.model.items.length === 0) {
          callback(new Error('请选择折扣商品"'))
          return
        }
        callback()
      }

      return {
        loading: false,
        dialogVisible: false,
        model: {
          name: '',
          start_time: 0,
          end_time: 0,
          count: '',
          items: []
        },
        rules: {
          name: [
            {required: true, message: '折扣名称必填', trigger: 'blur'},
            {max: 40, message: '长度最大40个字符', trigger: 'blur'}
          ],
          count: [
            {validator: validatCount, trigger: 'blur'}
          ],
          items: [
            {validator: validatItems, trigger: 'change'}
          ]
        },

        batchDiscountRateError: '',
        batchDiscountRateText: '',
        batchDiscountPriceError: '',
        batchDiscountPriceText: '',

        timeRange: [],
        timePickerOptions: {
          shortcuts: [{
            text: '最近三天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 3)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近七天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    },
    computed: {
      title() {
        if (this.mode === MODE_EDIT) {
          return '编辑限时折扣'
        } else {
          return '创建限时折扣'
        }
      }
    },
    watch: {
      dialogVisible: function (newVal, oldVal) {
        if (!newVal) {
          this.model = {
            name: '',
            start_time: 0,
            end_time: 0,
            count: '',
            items: []
          }
          this.$refs.modelForm.resetFields()
        } else {
          this._initPickerTimeRange()
          if (this.mode === MODE_EDIT) {
            this._initDiscountForm()
          }
        }
      }
    },
    methods: {
      show() {
        this.dialogVisible = true
      },
      hide() {
        this.dialogVisible = false
      },

      async _initDiscountForm() {
        try {
          const res = await DiscountApi.getItem(this.editId)
          this.model = {
            name: res.data.name,
            start_time: res.data.start_time,
            end_time: res.data.end_time,
            count: res.data.count === 0 ? '' : String(res.data.count),
            items: res.data.items
          }
          const start = new Date()
          const end = new Date()
          start.setTime(res.data.start_time)
          end.setTime(res.data.end_time)
          this.timeRange = [start, end]
        } catch (err) {
          this.$myErrorHandler.handle(this, err, '查询失败')
        }
      },

      _initPickerTimeRange() {
        const end = new Date()
        const start = new Date()
        end.setTime(start.getTime() + 3600 * 1000 * 24 * 3)
        this.timeRange = [start, end]
        this.model.start_time = start.getTime()
        this.model.end_time = end.getTime()
      },
      _timePickerChange() {
        if (this.timeRange.length === 0) {
          return
        }
        if (this.timeRange[1] < new Date()) {
          const start = this.timeRange[0]
          const end = new Date()
          end.setTime(new Date().getTime() + 3600 * 1000 * 24 * 3)
          this.timeRange = [start, end]
          this.$message({
            message: '已自动更正为将来的时间',
            showClose: true,
            type: 'info'
          })
        }
        this.model.start_time = this.timeRange[0].getTime()
        this.model.end_time = this.timeRange[1].getTime()
      },

      _addProduct() {
        this.$refs.dlgAddProduct.show()
      },
      _onChooseProduct(items) {
        this.model.items = items
      },

      _submitForm() {
        this.$refs.modelForm.validate((validFrom) => {
          this.$refs.discountItems.validateAll((validDiscount) => {
            if (validFrom && validDiscount) {
              if (this.mode === MODE_EDIT) {
                this._updateDiscount()
              } else {
                this._createdDiscount()
              }
            }
          })
        })
      },

      _createdDiscount() {
        this.loading = true
        DiscountApi.create(this.model)
          .then((res) => {
            this.loading = false
            this.$message({
              showClose: true,
              message: '创建成功',
              type: 'info'
            })
            this.$emit('created', res.data)
            this.hide()
          })
          .catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err)
          })
      },

      _updateDiscount() {
        this.loading = true
        DiscountApi.update(this.editId, this.model)
          .then((res) => {
            this.loading = false
            this.$message({
              showClose: true,
              message: '修改成功',
              type: 'info'
            })
            this.$emit('updated')
            this.hide()
          })
          .catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err)
          })
      },

      _batchSetDiscountRate() {
        if (!this.batchDiscountRateText) {
          this.batchDiscountRateError = ''
          return
        }
        const err = PriceUtil.validateInputDiscountRate(this.batchDiscountRateText)
        this.batchDiscountRateError = err
        if (!err) {
          this.$refs.discountItems.batchSetDiscountRate(this.batchDiscountRateText)
        }
      },
      _batchSetDiscountPrice() {
        if (!this.batchDiscountPriceText) {
          this.batchDiscountPriceError = ''
          return
        }
        const err = PriceUtil.validateInputDiscountPrice(null, this.batchDiscountPriceText)
        this.batchDiscountPriceError = err
        if (!err) {
          this.$refs.discountItems.batchSetDiscountPrice(this.batchDiscountPriceText)
        }
      }
    }
  }
</script>

<style scoped lang="less">

  .discount-item-header {
    padding: 10px;
    background: #ddd;
    height: 60px;

    .item-content-wrapper {
      text-align: center;

      .el-input {
        width: 100px;
      }
    }
  }


</style>
