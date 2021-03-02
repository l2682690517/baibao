<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="sta" v-loading="loading">
      <div class="row" v-for="(rowItem, key) in order">
        <div v-for="content in rowItem">
          <item :name="content.name" :value="content.value"></item>
        </div>
      </div>
      <div class="row">
        <div v-for="(rowItem, key) in shop">
            <item :name="rowItem.name" :value="rowItem.value" :link="rowItem.link"></item>
        </div>
      </div>
      <div class="row">
        <div v-for="content in shopMoney">
          <item :name="content.name" :value="content.value"></item>
        </div>
      </div>
      <div class="row">
        <div v-for="content in product">
          <item :name="content.name" :value="content.value"></item>
        </div>
      </div>
      <div class="row">
        <div v-for="content in last_month_profit">
          <item :name="content.name" :value="content.value"></item>
        </div>
      </div>
      <div class="row">
        <div v-for="content in month_profit">
          <item :name="content.name" :value="content.value"></item>
        </div>
      </div>
      <div class="row">
        <div v-for="content in profit">
          <item :name="content.name" :value="content.value"></item>
        </div>
      </div>
      <div class="row">
        <div v-for="content in refund">
          <item :name="content.name" :value="content.value"></item>
        </div>
      </div>
      <div class="row title" style="font-size: large">
        <el-radio-group v-model="topRadio">
          <el-radio-button label="amount">近期销售额冠军</el-radio-button>
          <el-radio-button label="sold">近期销量冠军</el-radio-button>
          {{topList}}
        </el-radio-group>
      </div>
      <div class="row">
        <div>
          <el-table :data="topList">
            <el-table-column label="日期" width="110" header-align="center">
              <template slot-scope="scope"><span>{{scope.row.date |date}}</span></template>
            </el-table-column>
            <el-table-column label="商品" header-align="center">
              <template slot-scope="scope">
                <div class="info">
                  <div class="icon" v-lazy:background-image="scope.row.product.cover ||scope.row.product.images[0]"></div>
                  <div class="name">
                    {{scope.row.product.name}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="销量" width="80" header-align="center">
              <template slot-scope="scope"><span>{{getShowCount(scope.row.count)}}</span></template>
            </el-table-column>
            <el-table-column label="销售额" width="120" header-align="center">
              <template slot-scope="scope"><span>{{getShowPrice(scope.row.sum)}}</span></template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Item from './Item.vue'
  import HomeApi from 'src/api/home'

  export default {
    components: {
      Item
    },
    data() {
      return {
        loading: null,
        topRadio: 'amount',
        order: {
          sum: {
            today: {
              name: '今日销售额',
              value: '0'
            },
            yesterday: {
              name: '昨日销售额',
              value: '0'
            },
            all: {
              name: '销售总额',
              value: '0'
            },
            month: {
              name: '本月销售额',
              value: '0'
            },
            preMonth: {
              name: '上月销售额',
              value: '0'
            }

          },
          count: {
            today: {
              name: '今日订单数',
              value: '0'
            },
            yesterday: {
              name: '昨日订单数',
              value: '0'
            },
            all: {
              name: '订单总数',
              value: '0'
            }
          },
          pct: {
            today: {
              name: '今日自购比例',
              value: ''
            },
            yesterday: {
              name: '昨日自购比例',
              value: ''
            },
            all: {
              name: '总体自购比例',
              value: ''
            }
          },
          user: {
            today: {
              name: '今日交易用户',
              value: ''
            },
            yesterday: {
              name: '昨日交易用户',
              value: ''
            },
            all: {
              name: '总体交易用户',
              value: ''
            }
          },
          shop: {
            today: {
              name: '今日开张店铺数',
              value: '0'
            },
            yesterday: {
              name: '昨日开张店铺数',
              value: '0'
            },
            all: {
              name: '开张店铺总数',
              value: '0'
            }
          }
        },
        shopMoney: {
          monthOpenAmount: {
            name: '本月开店费',
            value: '0'
          },
          lastMonthOpenAmount: {
            name: '上月开店费',
            value: '0'
          },
          openAmount: {
            name: '开店费总额',
            value: '0'
          }
        },
        shop: {
          yesterday: {
            name: '昨天开店',
            value: '0'
          },
          yesterdayNonTrial: {
            name: '昨天正式开店',
            value: '0'
          },
          all: {
            name: '开店总数',
            value: '0'
          },
          allNonTrial: {
            name: '正式开店总数',
            value: '0'
          },
          todayFirst: {
            name: '今日首次开张',
            value: '0',
            link: {
              name: 'shop',
              query: {'first': this.$options.filters.date(new Date())}
            }
          },
          yesterdayFirst: {
            name: '昨日首次开张',
            value: '0',
            link: {
              name: 'shop',
              query: {'first': this.$options.filters.date(new Date().getTime() - 1000 * 3600 * 24)}
            }
          }
        },
        product: {
          yesterdayNew: {
            name: '昨天上新',
            value: '0'
          },
          up: {
            name: '在售商品',
            value: '0'
          },
          outstock: {
            name: '缺货商品',
            value: '0'
          }
        },
        topSales: {amount: [], sold: []},
        refund: {
          lastMonthRefund: {
            name: '上月退款',
            value: '0'
          },
          lastMonthRecovery: {
            name: '上月追回利润',
            value: '0'
          }
        },
        profit: {
          yesterday: {
            name: '昨日总佣金',
            value: '0'
          },
          yesterday_sale: {
            name: '昨日销售佣金',
            value: '0'
          },
          yesterday_invite: {
            name: '昨日邀请奖励',
            value: '0'
          },
          yesterday_sell_group: {
            name: '昨日姐妹团奖励',
            value: '0'
          },
          yesterday_cpc: {
            name: '昨日CPC奖励',
            value: '0'
          },
          yesterday_extra: {
            name: '昨日其它奖励',
            value: '0'
          }
        },
        month_profit: {
          month: {
            name: '本月总佣金',
            value: '0'
          },
          month_sale: {
            name: '本月销售佣金',
            value: '0'
          },
          month_invite: {
            name: '本月邀请奖励',
            value: '0'
          },
          month_sell_group: {
            name: '本月姐妹团奖励',
            value: '0'
          },
          month_cpc: {
            name: '本月CPC奖励',
            value: '0'
          },
          month_extra: {
            name: '本月其它奖励',
            value: '0'
          }
        },
        last_month_profit: {
          last_month: {
            name: '上月总佣金',
            value: '0'
          },
          last_month_sale: {
            name: '上月销售佣金',
            value: '0'
          },
          last_month_invite: {
            name: '上月邀请奖励',
            value: '0'
          },
          last_month_sell_group: {
            name: '上月姐妹团奖励',
            value: '0'
          },
          last_month_cpc: {
            name: '上月CPC奖励',
            value: '0'
          },
          last_month_extra: {
            name: '上月其它奖励',
            value: '0'
          }
        }
      }
    },
    computed: {
      topList() {
        return this.topRadio === 'amount' ? this.topSales.amount : this.topSales.sold
      }
    },
    methods: {
      getShowPrice(num) {
        let val = num * 1.0 / 100
        if (val < 10000) {
          return `¥${val}`
        } else if (val > 100000000) {
          return `¥${(val / 100000000).toFixed(2)}亿`
        } else {
          return `¥${(val / 10000).toFixed(2)}万`
        }
      },
      getShowCount(num) {
        if (num < 10000) {
          return `${num}`
        } else if (num > 100000000) {
          return `${(num / 100000000).toFixed(2)}亿`
        } else {
          return `${(num / 10000).toFixed(2)}万`
        }
      }
    },
    async activated() {
      try {
        if (!this.loading && this.loading !== false) {
          this.loading = true
        }
        const res = await HomeApi.getHome()
        const orderRes = res.data.order
        Object.keys(this.order.sum).forEach((key) => {
          this.order.sum[key].value = this.getShowPrice(orderRes[key].sum)
        })
        Object.keys(this.order.count).forEach((key) => {
          this.order.count[key].value = this.getShowCount(orderRes[key].count)
        })
        Object.keys(this.order.pct).forEach((key) => {
          const obj = orderRes[key]
          this.order.pct[key].value = obj.count === 0 ? '--' : `${(obj.self * 100 / obj.count).toFixed(2)}%`
        })
        Object.keys(this.order.user).forEach((key) => {
          this.order.user[key].value = this.getShowCount(orderRes[key].user)
        })
        Object.keys(this.order.shop).forEach((key) => {
          this.order.shop[key].value = this.getShowCount(orderRes[key].shop)
        })

        const shopRes = res.data.shop
        Object.keys(this.shop).forEach((key) => {
          this.shop[key].value = this.getShowCount(shopRes[key])
        })
        Object.keys(this.shopMoney).forEach((key) => {
          this.shopMoney[key].value = this.getShowPrice(shopRes[key])
        })

        const productRes = res.data.product
        Object.keys(this.product).forEach((key) => {
          this.product[key].value = this.getShowCount(productRes[key])
        })

        const profitRes = res.data.profit
        Object.keys(this.profit).forEach((key) => {
          this.profit[key].value = this.getShowPrice(profitRes[key])
        })
        Object.keys(this.month_profit).forEach((key) => {
          this.month_profit[key].value = this.getShowPrice(profitRes[key])
        })
        Object.keys(this.last_month_profit).forEach((key) => {
          this.last_month_profit[key].value = this.getShowPrice(profitRes[key])
        })
        Object.keys(this.refund).forEach((key) => {
          this.refund[key].value = this.getShowPrice(profitRes[key])
        })

        if (productRes.top) {
          this.topSales = productRes.top
        }
        this.loading = false
      } catch (ex) {
        this.loading = false
        this.$myErrorHandler.handle(this, ex)
      }
    }
  }
</script>

<style lang="less" scoped>

  .sta {
    width: 780px;
    padding: 18px;
    padding-left: 30px;
  }

  .row {
    display: flex;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: solid 1px #dcdcdc;

    & > div {
      flex: 1;

      .name {
        font-size: 14px;
      }

      .value {
        font-size: 20px;
        margin-top: 8px;
      }
    }

    .row-col1 {
      flex: 1;
    }

    .row-col2 {
      flex: 2;
    }

  }

  .title {
    font-size: 14px;
    color: #888888;
  }

  .info {
    display: flex;
    align-items: center;
    padding-top: 5px;
    padding-bottom: 5px;

    .icon {
      width: 60px;
      height: 60px;
      margin-right: 10px;
      background-size: cover;
    }

    .name {
      flex: 1;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-height: 18px;
      max-height: 36px;
      text-overflow: ellipsis;
      word-break: break-all;
      overflow: hidden;
      margin-right: 15px;
      font-size: 15px;
      color: #666666;
    }
  }

</style>
