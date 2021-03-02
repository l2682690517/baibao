<template>
  <div class="list-wrapper">
    <div>
      <el-table :data="dataList.data" @sort-change="sortChanged" border row-key="id"
                v-loading="loading"
                element-loading-text="加载中">
        <el-table-column label="ID" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="店铺名称">
          <template slot-scope="scope">
            <div class="info-wrapper">
              <div class="icon" :class="{default:!scope.row.logo}" v-lazy:background-image="scope.row.logo">
              </div>
              <el-tooltip :content="scope.row.name">
                <div class="name">
                  {{scope.row.name}}
                </div>
              </el-tooltip>

            </div>
          </template>
        </el-table-column>
        <el-table-column label="销售额" prop="sale" sortable="custom" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.sale | price}}</span>
          </template>
        </el-table-column>
        <el-table-column label="总收入" prop="income" sortable="custom" width="100">
          <template slot-scope="scope">
            <router-link v-if="scope.row.acc" :to="{ name:'shopIncome', params: {id: scope.row.id}}">
              <el-button type="text" size="mini">{{scope.row.acc.income | price}}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="余额" prop="balance" sortable="custom" width="95">
          <template slot-scope="scope">
            <span v-if="scope.row.acc">{{scope.row.acc.balance | price}}</span>
          </template>
        </el-table-column>
        <el-table-column label="已提现" prop="cashed" sortable="custom" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.acc">{{scope.row.acc.cashed | price}}</span>
          </template>
        </el-table-column>
        <el-table-column label="已邀请" prop="invite_num" sortable="custom" width="90">
          <template slot-scope="scope">
            <el-button type="text" @click="_searchInvite(scope.row.id)">{{scope.row.invite_num}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="邀请人" :show-overflow-tooltip="true" width="130">
          <template slot-scope="scope">
            <el-button type="text" @click="_search(scope.row)">{{scope.row.from_name}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <div v-if="getShopStatusInColumn(scope.row).text">
              <el-tag :type="getShopStatusInColumn(scope.row).type">{{ getShopStatusInColumn(scope.row).text }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="等级" prop="level" sortable="custom" width="80">
          <template slot-scope="scope">
            {{ getShopLevelName(scope.row)}}
          </template>
        </el-table-column>
        <el-table-column label="关注" width="65">
          <template slot-scope="scope">
            <el-icon name="circle-check" v-if="scope.row.follow"></el-icon>
          </template>
        </el-table-column>
        <el-table-column label="付费日期" prop="pt" sortable="custom" width="120">
          <template slot-scope="scope">
            <span>{{scope.row.pt | date}} </span>
          </template>
        </el-table-column>
        <el-table-column label="开店/升级日期" prop="pt" sortable="custom" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.pt | date}} </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-dropdown>
              <el-button type="primary">
                操作<i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <router-link :to="{ name:'orderIndex', query: {spid: scope.row.id}}">
                  <el-dropdown-item style="color: black">销量</el-dropdown-item>
                </router-link>
                <el-dropdown-item @click.native="toggleSub(scope.row)" :disabled="isShowClosed(scope.row)">
                  <span> {{scope.row.sub ? '关闭下线注册' : '开放下线注册'}}</span></el-dropdown-item>
                <el-dropdown-item @click.native="toggleStatus(scope.row)" :disabled="isShowClosed(scope.row)">
                  {{_getStatusTxt(scope.row)}}
                </el-dropdown-item>
                <el-dropdown-item @click.native="closeShop(scope.row)" :disabled="isShowClosed(scope.row)">
                  {{_getShopCloseTxt(scope.row)}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
    <close-shop-dialog ref="dlgCloseShop" @refresh="refresh"></close-shop-dialog>
  </div>
</template>

<script>
  import LoadPageData from '../../mixins/LoadPagerData'
  import ShopApi from '../../api/shop'
  import CloseShopDialog from './CloseShopDialog'

  export default {
    mixins: [LoadPageData],
    components: {
      CloseShopDialog
    },
    props: {
      queryParams: {
        type: Object,
        default: () => {
          return {
            mentor: '',
            name: '',
            id: '',
            first: '',
            from: '',
            sort: 'pt',
            order: 'desc',
            up: ''
          }
        }
      }
    },
    data () {
      return {}
    },
    methods: {
      _search (row) {
        let params = {
          mentor: '',
          name: '',
          id: row.from_id,
          first: '',
          from: '',
          start: '',
          end: '',
          sort: 'pt',
          order: 'desc',
          trial: '-1',
          up: ''
        }
        this.$emit('searchFrom', params)
      },
      getQueryApi (params) {
        return ShopApi.getList(params)
      },
      export () {
        ShopApi.getList(Object.assign({export: 1}, this.queryParams))
      },
      toggleSub (shop) {
        ShopApi.updateShopSub(shop.id, !shop.sub)
        shop.sub = !shop.sub
      },
      _getStatusTxt (shop) {
        if (shop.status === 2) {
          return '禁用'
        } else if (shop.status === 3) {
          return '激活'
        }
        return '启用'
      },
      _activeShop (shop) {
        ShopApi.activeShop(shop.id)
          .then((res) => {
            shop.status = 2
          })
          .catch((err) => {
            this.$myErrorHandler.handle(this, err, '失败')
          })
      },
      _enabledShop (shop) {
        let targetstatus = shop.status === 2 ? 4 : 2
        ShopApi.enabledShop(shop.id, targetstatus)
          .then((res) => {
            shop.status = targetstatus
          })
          .catch((err) => {
            this.$myErrorHandler.handle(this, err, '失败')
          })
      },
      toggleStatus (shop) {
        let txt = this._getStatusTxt(shop)
        this.$confirm(txt + '？', '提示', ({
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })).then(() => {
          if (shop.status === 3) {
            this._activeShop(shop)
          } else {
            this._enabledShop(shop)
          }
        }).catch(() => {})
      },
      _searchInvite (from) {
        let model = {
          mentor: '',
          name: '',
          id: '',
          first: '',
          from: from,
          start: '',
          end: '',
          sort: 'pt',
          order: 'desc',
          trial: '-1',
          up: ''
        }
        this.$emit('submit', model)
      },
      getTotal () {
        this.$emit('total', this.dataListTotal)
      },
      _getShopCloseTxt (shop) {
        if (shop.status === 5) {
          return '已关闭'
        }
        return '关店'
      },
      getShopStatusInColumn (shop) {
        const status = {}
        if (shop.status === 5) {
          status.text = '已关闭'
          status.type = 'gray'
        } else {
          if (shop.trial) {
            status.text = '试用'
            status.type = 'success'
          } else if (shop.upgrade) {
            status.text = '已升级'
            status.type = 'primary'
          }
        }
        return status
      },
      getShopLevelName (shop) {
        switch (shop.level) {
          case 1:
            return '青橙'
          case 2:
            return '美橙'
          case 3:
            return '金橙'
          default:
            return ''
        }
      },
      closeShop (shop) {
        if (shop.status !== 5) {
          this.$refs.dlgCloseShop.show(shop)
        }
      },
      isShowClosed (shop) {
        return shop.status === 5
      },
      refresh () {
        this.loadDataList()
      }
    },
    updated () {
      this.getTotal()
    }
  }
</script>

<style lang="less" scoped>
  .list-wrapper {
    margin-top: 20px;

    .from-wrapper {
      a {
        color: #4aa9e4;
        text-decoration: underline;
      }
    }

    .info-wrapper {
      display: flex;
      align-items: center;
      padding-top: 5px;
      padding-bottom: 5px;

      .icon {
        width: 35px;
        height: 35px;
        margin-right: 10px;
        background-size: cover;
        border-radius: 50%;

        &.default {
          background-image: url("~@/assets/img/dianpu_img.png") !important;
        }
      }

      .name {
        flex: 1;
        line-height: 24px;
        text-overflow: ellipsis;
        word-break: break-all;
        overflow: hidden;
        white-space: nowrap;
      }
    }

    .control-wrapper {
      margin-top: 10px;
    }

    .remark {
      position: relative;
      margin-top: 10px;
      margin-bottom: 10px;
      padding: 5px;
      border: solid 1px #ddd;
      border-radius: 5px;
      min-height: 50px;

      .title {
        font-size: 14px;
      }

      .edit {
        position: absolute;
        right: 10px;
        bottom: 0;
      }
    }

    .pager-wrapper {
      text-align: center;
    }
    .btn-status {
      margin-left: 0px;
    }
  }

  .menu-item {
    font-size: 14px;
    color: inherit;
  }
</style>
