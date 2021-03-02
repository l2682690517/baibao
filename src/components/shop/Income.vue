<template>
  <div>
    <div class="breadcrumb">
      <el-breadcrumb >
        <el-breadcrumb-item :to="{ path: '/shop' }">达人</el-breadcrumb-item>
        <el-breadcrumb-item>收入</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <div class="shop">
        <span class="shop-icon"  :class="{default:!shop.logo}" v-lazy:background-image="shop.logo"></span>
        <span>{{shop.name}}</span>
      </div>
      <div>
        <el-table :data="dataList.data" @sort-change="sortChanged" border row-key="id" v-loading="loading"
                  element-loading-text="加载中">
          <el-table-column label="商品">
            <template slot-scope="scope">
              <div class="product-wrapper">
                <div class="icon" v-lazy:background-image="scope.row.img">
                </div>
                <div class="name">{{scope.row.name}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="备注" width="150">
            <template slot-scope="scope">
              <span>{{scope.row.remark}}</span>
            </template>
          </el-table-column>
          <el-table-column label="金额" width="150">
            <template slot-scope="scope">
              <span>{{scope.row.amount | price(false)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="时间" width="180">
            <template slot-scope="scope">
              <span>{{scope.row.ct | datetime}}</span>
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
  </div>
</template>

<script>
  import ShopApi from '../../api/shop'
  import LoadPageData from '../../mixins/LoadPagerData'

  export default {
    name: 'ShopIncome',
    mixins: [LoadPageData],
    data() {
      return {
        shopId: '',
        shop: {}
      }
    },
    methods: {
      getQueryApi(params) {
        return ShopApi.IncomeList(this.shopId, params)
      }
    },
    async created() {
      this.shopId = this.$route.params.id
      try {
        const res = await ShopApi.getItem(this.shopId)
        this.shop = res.data
      } catch (err) {
        this.$myErrorHandler.handle(this, err, '查询失败')
      }
    }
  }
</script>

<style lang="less" scoped>

  .product-wrapper {
    display: flex;
    align-items: center;
    padding-bottom: 5px;
    padding-top: 5px;

    .icon {
      width: 60px;
      height: 60px;
      margin-right: 10px;
      background-size: cover;
    }

    .name {
      flex: 1;
    }

  }

  .shop {
    display: flex;
    align-items: center;
    padding: 8px;
  }

  .shop-icon {
    display: inline-block;
    width: 40px;
    height: 40px;
    margin-right: 10px;
    border-radius: 50%;
    background-size: cover;

    &.default {
      background-image: url("~@/assets/img/dianpu_img.png") !important;
    }
  }


</style>
