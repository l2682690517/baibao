<template>
  <el-dialog title="发货" :visible.sync="dialogVisible" width="40%" @open="_openCallback">
    <el-form class="choose-express-form" ref="formChooseExpress" v-loading="loading" :model="form" :rules="rules">
      <el-form-item prop="ids" v-if="isShowProductList">
        <div>
          <div>
            <span class="section-title">商品:</span>
          </div>
          <div class="product-list">
            <el-table :data="orderItems" row-key="id" border
                      @selection-change="_handleSelectionChange">
              <el-table-column
                type="selection"
                width="55"
                :selectable="checkSelectable">
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <order-item-cell :orderItem="scope.row"></order-item-cell>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form-item>
      <el-form-item prop="express">
        <span class="section-title">物流公司:</span>
        <el-select class="input" v-model="form.express" placeholder="请选择">
          <el-option
            v-for="item in expresses"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="order">
        <span class="section-title">快递单号:</span>
        <el-input class="input" v-model="form.order" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="_submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import OrderItemCell from './OrderItemCell'
  import OrderApi from '../../../api/order'

  const MODE_CREATE = 0
  const MODE_EDIT = 1

  export default {
    MODE_CREATE,
    MODE_EDIT,
    components: {
      OrderItemCell
    },
    data() {
      const validateIds = (rule, value, callback) => {
        if (this.form.ids) {
          if (this.form.ids.length === 0) {
            callback(new Error('请选择商品'))
            return
          }
        }
        callback()
      }
//      const validateExpress = (rule, value, callback) => {
//        if (this.form.ids) {
//          if (this.form.express === 0) {
//            callback(new Error('请选择快递'))
//            return
//          }
//        }
//        callback()
//      }
      return {
        mode: MODE_CREATE,
        dialogVisible: false,
        loading: false,
        form: {
          ids: [],
          express: 0,
          order: ''
        },
        rules: {
          ids: [
            {validator: validateIds, trigger: 'blur'}
          ]
// ,
//          express: [
//            {validator: validateExpress, trigger: 'blur'}
//          ],
//          order: [
//            {required: true, message: '请输入快递单号', trigger: 'blur'}
//          ]
        },
        id: 0,
        originalSelected: [],
        orderItems: [],
        expresses: [{
          label: '顺丰快递',
          value: 0
        }, {
          label: '顺丰快递',
          value: 1
        }, {
          label: '顺丰快递',
          value: 2
        }]
      }
    },
    computed: {
      isShowProductList() {
        return this.mode === MODE_CREATE
      }
    },
    methods: {
      show(mode = MODE_CREATE, id) {
        this.id = id
        this.mode = mode
        this.dialogVisible = true
      },
      hide() {
        this.dialogVisible = false
      },
      _submit() {
        this.$refs.formChooseExpress.validate((valid) => {
          if (valid) {
            this._deliver()
          }
        })
      },
      async _deliver() {
        try {
          this.loading = true
          await OrderApi.deliver(this.id, this.form.ids)
          this.loading = false
          this.hide()
          this.$message({
            showClose: true,
            message: '发货成功',
            type: 'info'
          })
          this.$emit('submit')
        } catch (err) {
          this.$myErrorHandler.handle(this, err)
          this.loading = false
        }
      },
      _openCallback() {
        this.$nextTick(async () => {
          try {
            this.loading = true
            const res = await OrderApi.getChildItems(this.id)
            this.orderItems = res.data.data
            this.originalSelected = this.orderItems.filter((item) => {
              return item.dev_status === 1
            }).map(item => {
              return item.id
            })

            this.loading = false
          } catch (err) {
            this.$myErrorHandler.handle(this, err)
            this.loading = false
          }
        })
      },
      _handleSelectionChange(val) {
        let ids = []
        if (val) {
          val.forEach((item) => {
            ids.push(item.id)
          })
        }
        this.form.ids = ids
      },
      checkSelectable(row, index) {
        return (this.originalSelected.indexOf(row.id) === -1)
      }
    }
  }
</script>

<style lang="less" scoped>
  .product-list {
    margin-top: 5px;
  }

  .input {
    width: 200px;
  }


</style>

<style lang="less">
  .choose-express-form .el-checkbox .is-disabled {
    visibility: hidden;
  }
</style>
