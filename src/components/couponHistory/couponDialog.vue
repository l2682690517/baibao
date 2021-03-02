<template>
  <el-dialog title="定向发券" :visible.sync="dialogVisible" width="80%">
    <div class="couponDlg">
      <el-table stripe height="350" :data="voucherList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="80"></el-table-column>
        <el-table-column prop="name" label="名称" width="240"></el-table-column>
        <el-table-column prop="amount" label="面值" width="200">
          <template slot-scope="scope">
            <div>
              {{amountText(scope.row)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="领券限制" width="200">
          <template slot-scope="scope">
            <div>{{putTypeText(scope.row)}}</div>
            <div>{{putPointText(scope.row)}}</div>
            <div>每人{{scope.row.quota}}张</div>
          </template>
        </el-table-column>
        <el-table-column label="有效期">
          <template slot-scope="scope">
            <div v-if="scope.row.expiry_tp === 1">
              <div>{{scope.row.start_tick | date}} ~  {{scope.row.end_tick | date}}</div>
              <div v-if="scope.row.end_tick < new Date().getTime()">已过期</div>
            </div>
            <div v-if="scope.row.expiry_tp === 2">
              <div>领券后{{scope.row.expiry_day}}天失效</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="button-div">
      <el-button size="small" class="button" type="primary" @click="showData()">发券</el-button>
      <el-button size="small" class="button" type="" @click="hide()">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {convertFenToYuan} from 'src/utils/moneyUtil'
  import {
    getFriendlyNameOfPutPoint,
    getFriendlyNameOfPutType
  } from 'src/constants/voucher'

  export default {
    props: {
      voucherList: {
        type: Array
      },
      total: {
        type: Number
      }
    },
    components: {},
    data() {
      return {
        dialogVisible: false,
        multipleSelection: []
      }
    },
    computed: {},
    methods: {
      getVoucherId() {
        let voucherId = this.multipleSelection.map((i) => {
          return i.id
        })
        voucherId = voucherId.join()
        return voucherId
      },
      putPointText(voucher) {
        return getFriendlyNameOfPutPoint(voucher.put_point)
      },
      putTypeText(voucher) {
        return getFriendlyNameOfPutType(voucher.put_tp)
      },
      amountText(voucher) {
        if (voucher.full_amount === 0) {
          return `立减${convertFenToYuan(voucher.amount)}`
        } else {
          return `满${convertFenToYuan(voucher.full_amount)}减${convertFenToYuan(voucher.amount)}`
        }
      },
      showData() {
        if (this.multipleSelection.length === 0) {
          this.$message.error('请选择优惠券')
        } else {
          this.$confirm('发放人数：' + this.total + '人， 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let id = this.getVoucherId()
            let params = {
              voucher_ids: id,
              put_out_voucher: 1,
              total: this.total
            }
            this.$emit('submit', params)
            this.dialogVisible = false
            this.$message({
              type: 'success',
              message: '提交成功!'
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      show() {
        this.dialogVisible = true
      },
      hide() {
        this.dialogVisible = false
      }
    }
  }
</script>


<style lang="less" scoped>
  .couponDlg {
    width: 950px;
    margin: auto;
    border: 1px solid #e6ebf5;

  }
  .button-div {
    width: 20%;
    margin: 20px auto 0 auto;
  }
  .button {
    width: 40%;
  }
</style>
