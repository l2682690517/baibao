<template>
  <div class="list-wrapper">
    <div>
      <el-table :data="dataList.data" row-key="id" border
                v-loading="loading" @sort-change="sortChanged"
                element-loading-text="加载中">
        <el-table-column label="折扣名称" width="160">
          <template slot-scope="scope">
            <div>
                {{scope.row.name}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="80">
          <template slot-scope="scope">
            {{scope.row.status | discountState}}
          </template>
        </el-table-column>
        <el-table-column label="折扣商品">
          <template slot-scope="scope">
                <div class="discount-icon" v-for="(item, index) in scope.row.items"
                      v-if="index < 3 && item.product && item.product.images">
                  <div>
                    <div  class="cover" v-lazy:background-image="item.product.cover || item.product.images[0]">
                      <div v-if="_getProdStatusName(item.product)">{{_getProdStatusName(item.product)}}</div>
                    </div>
                  </div>
                </div>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" width="120" prop="start_time" sortable="custom" >
          <template slot-scope="scope">
            <div>{{scope.row.start_time | datetime}}</div>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" width="120" >
          <template slot-scope="scope">
            <div>{{scope.row.end_time | datetime}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="255">
          <template slot-scope="scope">
            <el-button size="mini"  :type="scope.row.sec_kill ? 'success' : ''"  @click="handleSecKill(scope.row)">{{_getSecKillText(scope.row)}}</el-button>
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" @click="handleDel(scope.row.id)" type="danger">删除</el-button>
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
  import LoadPagerData from '@/mixins/LoadPagerData'
  import DiscountApi from '@/api/discount'
  import ProductFormUtil from '../../utils/productFormUtil'

  export default {
    mixins: [LoadPagerData],
    methods: {
      getQueryApi(params) {
        return DiscountApi.getList(params)
      },
      _getProdStatusName(prod) {
        return ProductFormUtil.getProdTagName(prod)
      },
      handleDel(id) {
        this.$confirm('删除此折扣？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          DiscountApi.del(id).then((res) => {
            this.loading = false
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.loadDataList()
          })
        }).catch(() => {
        })
      },
      handleEdit(discount) {
        this.$router.push({
          name: 'EditDiscount',
          params: {
            id: discount.id
          }
        })
      },
      _getSecKillText(item) {
        return !item.sec_kill ? '参加秒杀' : '取消秒杀'
      },
      handleSecKill(item) {
        this.loading = true
        let seckill = !item.sec_kill
        DiscountApi.updateSecKill(item.id, seckill).then((res) => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          item.sec_kill = seckill
        }).catch((err) => {
          this.loading = false
          this.$myErrorHandler.handle(this, err)
        })
      }
    },
    mounted() {
      this.$eventBus.on('createdDiscount', () => {
        console.log('createdDiscount')
        this.currentPage = 1
      })
    }
  }
</script>

<style lang="less" scoped>

  .name {
    display: inline-block;
    padding: 2px 5px;
    margin-top: 5px;
    margin-bottom: 5px;
    border: solid 1px #ddd;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis
  }
  .discount-icon {
    display: inline-block;
    vertical-align: middle;
    width: 50px;
    height: 50px;
    margin: 10px 5px;
  }
  .cover {
    text-align: center;
    width: 50px;
    height: 50px;
    background-size: cover;
    background-repeat: no-repeat;
    div{
      height: 20px;
      width: 40px;
      position:absolute;
      bottom:10px;
      padding:0px;
      margin:0px 5px;
      background: #ffffff;
      border:solid 1px #888888;
      font-size: 10px;
      line-height: 20px;
      border-radius:3px;
    }
  }
</style>
