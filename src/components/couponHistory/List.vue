<template>
  <div class="table_list">
    <el-table :data="dataList.data" @sort-change="sortChanged" border row-key="id"
              v-loading="loading"
              element-loading-text="加载中">
      <el-table-column label="发券时间" width="120">
        <template slot-scope="scope">
          {{getTime(scope.row.ct)}}
        </template>
      </el-table-column>
      <el-table-column label="发券条件" width="">
        <template slot-scope="scope">
          <div><p v-html="getText(scope.row)"></p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="发放人数" width="62">
        <template slot-scope="scope">
          <div>{{scope.row.total + '人'}}</div>
        </template>
      </el-table-column>
      <el-table-column :render-header="renderHeader" width="877">
        <template slot-scope="scope">
          <div class="relate_list">
            <el-table :data=scope.row.relate_list :show-header=false>
              <el-table-column label="券名称" prop="voucher.name" width="150"></el-table-column>
              <el-table-column label="面值" width="100">
                <template slot-scope="scope">
                  <div>
                    {{amountText(scope.row)}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="领券限制" width="80">
                <template slot-scope="scope">
                  <div>{{putTypeText(scope.row.voucher)}}</div>
                  <div>{{putPointText(scope.row.voucher)}}</div>
                  <div>每人{{scope.row.voucher.quota}}张</div>
                </template>
              </el-table-column>
              <el-table-column label="有效期" width="167">
                <template slot-scope="scope">
                  <div v-if="scope.row.voucher.expiry_tp === 1">
                    <div>{{scope.row.voucher.start_tick | date}} ~  {{scope.row.voucher.end_tick | date}}</div>
                    <div v-if="scope.row.voucher.end_tick < new Date().getTime()">已过期</div>
                  </div>
                  <div v-if="scope.row.voucher.expiry_tp === 2">
                    <div>领券后{{scope.row.voucher.expiry_day}}天失效</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="发送状态" width="80">
                <template slot-scope="scope">
                  <div>{{getStatus(scope.row)}}</div>
                </template>
              </el-table-column>
              <el-table-column label="总发送" width="80">
                <template slot-scope="scope">
                  <div>{{scope.row.voucher.total_count}}</div>
                </template>
              </el-table-column>
              <el-table-column label="已用" width="80">
                <template slot-scope="scope">
                  <div>{{scope.row.voucher.use_count}}</div>
                </template>
              </el-table-column>
              <el-table-column label="券状态" width="80">
                <template slot-scope="scope">
                  <div>{{getVoucherStatus(scope.row)}}</div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="50">
                <template slot-scope="scope">
                  <div v-if="scope.row.status === 3">
                  </div>
                  <div v-else>
                    <el-button type="text" size="mini" @click="drop(scope.row)">作废</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pager-wrapper" v-show="isEnabledPager">
      <el-pagination
        layout="total, prev, pager, next"
        :total="dataListTotal"
        :current-page="currentPage"
        :page-size="pageSize"
        @current-change="changePage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import LoadPageData from 'src/mixins/LoadPagerData'
  import * as VoucherApi from 'src/api/voucher'
  import { getText } from 'src/utils/couponHistory-until'
  import { convertFenToYuan } from 'src/utils/moneyUtil'
  import {
    HISTORY_TYPE_SHOP,
    HISTORY_TYPE_CUSTOMER,
    getFriendlyNameOfPutPoint,
    getFriendlyNameOfPutType
  } from 'src/constants/voucher'

  export default {
    props: {
      type: {}
    },
    components: {},
    mixins: [LoadPageData],
    data () {
      return {}
    },
    computed: {},
    watch: {},
    methods: {
      renderHeader (createElement, {_self}) {
        return createElement(
          'div',
          {
            'class': 'renderTableHead'
          },
          [
            createElement('span', {'style': 'padding-right: 110px !important;'}, ['券名称']
            ),
            createElement('span', {'style': 'padding-right: 75px !important;'}, ['面值']
            ),
            createElement('span', {
              'style': 'padding-right: 25px !important;'}, ['领券限制']
            ),
            createElement('span', {
              'style': 'padding-right: 125px !important;'}, ['有效期']
            ),
            createElement('span', {
              'style': 'padding-right: 25px !important;'}, ['发送状态']
            ),
            createElement('span', {
              'style': 'padding-right: 37px !important;'}, ['总发送']
            ),
            createElement('span', {
              'style': 'padding-right: 53px !important;'}, ['已用']
            ),
            createElement('span', {
              'style': 'padding-right: 37px !important;'}, ['券状态']
            ),
            createElement('span', {
              'style': 'padding-right: 37px !important;'}, ['操作']
            )
          ]
        )
      },
      getVoucherStatus (row) {
        if (row.status === 1) {
          return '有效'
        } else if (row.status === 2) {
          return '有效'
        } else if (row.status === 3) {
          return '已作废'
        }
      },
      drop (row) {
        this.$confirm('设为作废后，已领取但未使用该券的用户将不能再使用该券，确定将该券设为作废吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            await VoucherApi.dropVoucher(row)
            this.$message({
              message: '作废成功',
              showClose: true,
              type: 'success'
            })
          } catch (err) {
            this.$myErrorHandler.handle(this, err, '删除失败')
          }
          this.loadFirstPageDataList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      getStatus (row) {
        if (row.status === 1) {
          return '进行中'
        } else if (row.status === 2) {
          return '已完成'
        } else if (row.status === 3) {
          return '失败'
        }
      },
      getText (row) {
        let data = getText(row)
        return data
      },
      getTime (row) {
        let res = new Date(parseInt(row)).toLocaleString().replace(/:\d{1,2}$/, ' ')
        return res
      },
      amountText (voucher) {
        if (voucher.voucher.full_amount === 0) {
          return `立减${convertFenToYuan(voucher.voucher.amount)}`
        } else {
          return `满${convertFenToYuan(voucher.voucher.full_amount)}减${convertFenToYuan(voucher.voucher.amount)}`
        }
      },
      putPointText (voucher) {
        return getFriendlyNameOfPutPoint(voucher.put_point)
      },
      putTypeText (voucher) {
        return getFriendlyNameOfPutType(voucher.put_tp)
      },
      getQueryApi (params) {
        if (this.type === HISTORY_TYPE_SHOP) {
          let data = params
          data.tp = 1
          return VoucherApi.getVoucherHistory(data)
        } else if (this.type === HISTORY_TYPE_CUSTOMER) {
          let data = params
          data.tp = 2
          return VoucherApi.getVoucherHistory(data)
        }
      }
    }
  }
</script>


<style lang="less" scoped>
  .pager-wrapper {
    text-align: center;
  }


</style>

<style lang="less">
  .voucher {
    padding-right: 130px !important;
  }

  .table_list {
    .el-table {
      .cell {
        padding-left: 5px !important;
        padding-right: 0 !important;
      }
    }
  }

  .relate_list {
    .el-table::before {
      height: 0 !important;
    }
    .el-table {
      border: 0 !important;
      .el-table__row {
        border: 0 !important;
      }
      td {
        border: 0 !important;
        border-bottom: 0 !important;
      }
    }
  }
</style>
