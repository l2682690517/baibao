<template>
  <div class="list-wrapper">
    <div>
      <el-table :data="dataList.data" @sort-change="sortChanged" border row-key="id"
                v-loading="loading"
                element-loading-text="加载中">
        <el-table-column label="ID" prop="id" :min-width="50">
        </el-table-column>
        <el-table-column label="名称" prop="name" :min-width="100">
        </el-table-column>
        <el-table-column label="面值" :min-width="120" prop="amount" sortable="custom">
          <template slot-scope="scope">
            <div>
              {{amountText(scope.row)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="领券限制" :min-width="100">
          <template slot-scope="scope">
            <div>{{putTypeText(scope.row)}}</div>
            <div>{{putPointText(scope.row)}}</div>
            <div>每人{{scope.row.quota}}张</div>
          </template>
        </el-table-column>
        <el-table-column label="有效期" :min-width="130">
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
        <el-table-column label="发券" :min-width="130" prop="user_count" sortable="custom">
          <template slot-scope="scope">
            <div>人数：{{scope.row.user_count}}</div>
            <div>发券：{{scope.row.total_count}}</div>
            <div>剩余：{{scope.row.put_total === 0 ? '无限' : scope.row.put_total - scope.row.total_count}}</div>
          </template>
        </el-table-column>
        <el-table-column label="已用券" prop="use_count" :width="100" sortable="custom">
        </el-table-column>
        <el-table-column label="操作" :width="280">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editItem(scope.row)">编辑</el-button>
            <el-button :type="scope.row.put_status === $options.PUT_STATUS_RUNNING ? 'primary' : 'danger'" size="mini"
                       @click="changeStatus(scope.row)">
              {{scope.row.put_status === $options.PUT_STATUS_RUNNING ? '停止发放' : '恢复发放'}}
            </el-button>
            <el-button type="primary" size="mini" @click="showShareUrl(scope.row)" v-if="_canShare(scope.row)">显示链接
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
  import ShortUrlApi from 'src/api/shorturl'
  import { convertFenToYuan } from 'src/utils/moneyUtil'
  import {
    getFriendlyNameOfPutPoint,
    getFriendlyNameOfPutType,
    PUT_STATUS_RUNNING,
    PUT_STATUS_STOPPED,
    PUT_TYPE_MANUAL
  } from 'src/constants/voucher'

  export default {
    PUT_STATUS_RUNNING,
    mixins: [LoadPageData],
    data () {
      return {}
    },
    computed: {},
    methods: {
      getQueryApi (params) {
        return VoucherApi.getList(params)
      },
      amountText (voucher) {
        if (voucher.full_amount === 0) {
          return `立减${convertFenToYuan(voucher.amount)}`
        } else {
          return `满${convertFenToYuan(voucher.full_amount)}减${convertFenToYuan(voucher.amount)}`
        }
      },
      _canShare(item) {
        return item.share && item.put_tp === PUT_TYPE_MANUAL
      },
      putPointText (voucher) {
        return getFriendlyNameOfPutPoint(voucher.put_point)
      },
      putTypeText (voucher) {
        return getFriendlyNameOfPutType(voucher.put_tp)
      },
      changeStatus (row) {
        const confirmText = row.put_status === PUT_STATUS_RUNNING ? '停止发放?' : '恢复发放?'
        this.$confirm(confirmText).then(async () => {
          let targetStatus
          if (row.put_status === PUT_STATUS_RUNNING) {
            targetStatus = PUT_STATUS_STOPPED
          } else {
            targetStatus = PUT_STATUS_RUNNING
          }
          try {
            this.loading = true
            await VoucherApi.updatePutStatus(row.id, targetStatus)
            this.loadDataList()
          } catch (e) {
            this.loading = false
            this.$myErrorHandler.handle(this, e)
          }
        }).catch(() => {})
      },
      editItem (row) {
        this.$router.push({
          name: 'EditVoucher',
          params: {
            id: row.id
          }
        })
      },
      showShareUrl (row) {
        this.loading = true
        ShortUrlApi.getShortUrl(row.share_url)
          .then((res) => {
            let data = res.data
            this.loading = false
            const h = this.$createElement
            this.$msgbox({
              title: '微页面链接',
              closeOnClickModal: false,
              message: h('div', null, [
                h('div', null, data.short_url),
                h('div', {style: 'margin-top: 10px'}, '请达人点击使用，直接转发此链接无效')
              ]),
              confirmButtonText: '知道了'
            })
          })
          .catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err)
          })
      }
    }
  }
</script>

<style lang="less" scoped>

  .list-wrapper {
    margin-top: 20px;

    .control-wrapper {
      margin-top: 10px;
    }

    .pager-wrapper {
      text-align: center;
    }
  }


</style>

