<template>
  <div class="list-wrapper">
    <div>
      <el-table :data="dataList.data" row-key="id" border @sort-change="sortChanged"
                @selection-change="handleSelectionChange"
                v-loading="loading"
                element-loading-text="加载中"
                :row-class-name="rowClassName">
        <el-table-column
          type="selection"
          width="62"
          v-if="mode === 0">
        </el-table-column>
        <el-table-column label="ID" prop="id" :width="80" :resizable="false">
        </el-table-column>
        <el-table-column :width="50" :resizable="false">
          <template slot-scope="scope">
            <div class="img-cover" v-lazy:background-image="scope.row.cover ? scope.row.cover : scope.row.images[0]">
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品" prop="name" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="价格" width="120" prop="price" sortable="custom">
          <template slot-scope="scope">
            <span> ¥{{scope.row.original_price}}</span>
          </template>
        </el-table-column>
        <el-table-column label="销量" prop="sold" width="90" sortable="custom">
        </el-table-column>
        <el-table-column label="转化率" prop="score" width="100" sortable="custom">
          <template slot-scope="scope">{{scope.row.pv ? `${(scope.row.sold * 100.0 / scope.row.pv).toFixed(1)}%` : ''}}
          </template>
        </el-table-column>
        <el-table-column label="PV" prop="pv" width="90" sortable="custom">
        </el-table-column>
        <el-table-column label="库存" prop="stock" width="90" sortable="custom">
          <template slot-scope="scope">
            {{totalStock(scope.row.skus)}}
            <el-icon name="circle-check" v-if="scope.row.ext.stock_sync"></el-icon>
          </template>
        </el-table-column>
        <el-table-column label="上架时间" prop="pt" width="170" sortable="custom">
          <template slot-scope="scope">{{scope.row.pt | datetime}}</template>
        </el-table-column>
        <!--<el-table-column label="置顶" prop="top_tick" width="90" sortable="custom">-->
        <!--<template scope="scope">{{scope.row.top_tick > 0 ? '是' : '否'}}</template>-->
        <!--</el-table-column>-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row>
              <el-col :span="10">
                <div v-if="hasRealSku(scope.row.skus)">
                  <el-table :data="scope.row.skus" :border="false">
                    <el-table-column label="规格" prop="spec">
                    </el-table-column>
                    <el-table-column label="价格" prop="price">
                      <template slot-scope="scope">
                        {{scope.row.price | price}}
                      </template>
                    </el-table-column>
                    <el-table-column label="销量" prop="sold">
                    </el-table-column>
                    <el-table-column label="库存" prop="stock">
                    </el-table-column>
                  </el-table>
                </div>
                <div v-else>没有扩展数据</div>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="" width="120">
          <template slot-scope="scope">
            <el-dropdown class="table-menu">
              <el-button type="primary">
                操作<i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="menu-item" v-if="scope.row.status === 1"
                                  @click.native="showShareUrl(scope.row)">推广链接
                </el-dropdown-item>

                <el-dropdown-item class="menu-item"  v-if="scope.row.status === 1"
                                  @click.native="downloadMinprogQr(scope.row.id)">
                  小程序码
                </el-dropdown-item>

                <el-dropdown-item class="menu-item" @click.native="handleEdit(scope.row)">编辑</el-dropdown-item>
                <el-dropdown-item class="menu-item" @click.native="handleCopyProduct(scope.row)">复制</el-dropdown-item>
                <el-dropdown-item class="menu-item" v-if="mode !== 3" @click.native="updateProductStatus(scope.row)">
                  {{scope.row.status === 1 ? '下架' : '上架'}}
                </el-dropdown-item>
                <el-dropdown-item class="menu-item" v-if="mode !== 3" @click.native="topProduct(scope.row)">
                  {{scope.row.top_tick === 0 ? '置顶' : '取消置顶'}}
                </el-dropdown-item>
                <el-dropdown-item class="menu-item" @click.native="handleTrash(scope.row)">
                  {{scope.row.trash ? '恢复' : '删除'}}
                </el-dropdown-item>
                <el-dropdown-item class="menu-item" @click.native="handleHide(scope.row)">
                  {{scope.row.ext.hide ? '恢复显示' : '隐藏'}}
                </el-dropdown-item>
                <el-dropdown-item class="menu-item" @click.native="handleSync(scope.row)">
                  {{scope.row.ext.stock_sync ? '暂停自动补货' : '恢复自动补货'}}
                </el-dropdown-item>
                <el-dropdown-item class="menu-item" @click.native="showPreview(scope.row)">预览</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="trash" v-if="!queryParams.trash">
      <router-link :to="{ name:'RecycleProduct'}">
        <el-button>回收站</el-button>
      </router-link>
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
    <preview-dialog ref="dlgPreview" :resources="resources"></preview-dialog>
  </div>
</template>

<script>
  import LoadPagerData from 'src/mixins/LoadPagerData'
  import ProductApi from '@/api/product'
  import ShortUrlApi from '@/api/shorturl'
  import PreviewDialog from 'src/components/cms/preview/PreviewDialog'
  import MinprogApi from 'src/api/minprog'

  const MODE_COMMON = 0
  // eslint-disable-next-line
  const MODE_SEARCH = 1

  const STATUS_UP = 1 // 上架
  const STATUS_DOWN = 2 // 下架

  export default {
    components: {
      PreviewDialog
    },
    mixins: [LoadPagerData],
    props: {
      queryParams: {
        type: Object,
        default: () => {
          return {
            sort: '',
            order: '',
            sku_code: '',
            trash: false,
            upStartDate: '',
            upEndDate: ''
          }
        }
      },
      mode: {
        type: Number,
        default: MODE_COMMON
      }
    },
    data () {
      return {
        resources: []
      }
    },
    methods: {
      getQueryApi (params) {
        return ProductApi.getList(params)
      },
      async showPreview (row) {
        let res = await ProductApi.getContent(row.id)
        this.resources = res.data.data
        console.log(this.resources)
        this.$refs.dlgPreview.show()
      },
      rowClassName (row, index) {
        if (!this.hasRealSku(row.skus)) {
          return 'hide-expand-column'
        }
        return ''
      },
      topButtonType (row) {
        return row.top_tick === 0 ? 'primary' : 'danger'
      },
      hasRealSku (skuArr) {
        if (!skuArr) {
          return false
        }
        if (skuArr.length > 1) {
          return true
        } else if (skuArr.length === 1) {
          if (skuArr[0].spec) {
            return true
          }
        }
        return false
      },
      totalStock (skuArr) {
        if (!skuArr) {
          return 0
        }
        let total = 0
        skuArr.forEach((item) => {
          total += item.stock
        })
        return total
      },

      handleSelectionChange (val) {
        let items = []
        if (val) {
          val.forEach((item) => {
            items.push(item)
          })
        }
        this.$emit('selectionChange', items)
      },
      handleEdit (product) {
        this.$router.push({
          name: 'EditProduct',
          params: {
            id: product.id,
            recycle: this.mode
          }
        })
      },
      handleHide (product) {
        const msg = product.ext.hide ? '恢复前端显示？' : '在前端隐藏？'
        this.$confirm(msg, product.ext.hide ? '显示' : '隐藏', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          ProductApi.updateHideStatus(product.id, !product.ext.hide)
            .then((res) => {
              this.loading = false
              this.loadDataList()
            })
            .catch((err) => {
              this.loading = false
              this.$myErrorHandler.handle(this, err, '操作失败')
            })
        }).catch(() => {
        })
      },
      handleSync (product) {
        const action = product.ext.stock_sync ? '暂停' : '恢复'
        const msg = `${action}自动补货?`
        this.$confirm(msg, action, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          ProductApi.updateSyncStatus(product.id, !product.ext.stock_sync)
            .then((res) => {
              this.loading = false
              this.loadDataList()
            })
            .catch((err) => {
              this.loading = false
              this.$myErrorHandler.handle(this, err, '操作失败')
            })
        }).catch(() => {
        })
      },
      handleTrash (product) {
        if (!product.trash) {
          this.$confirm('商品将一律成为下架状态', '删除商品？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.loading = true
            ProductApi.updateTrashStatus(product.id, true)
              .then((res) => {
                this.loading = false
                this.loadDataList()
              })
              .catch((err) => {
                this.loading = false
                this.$myErrorHandler.handle(this, err, '操作失败')
              })
          }).catch(() => {
          })
        } else {
          this.$confirm('恢复为下架商品？', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.loading = true
            ProductApi.updateTrashStatus(product.id, false)
              .then((res) => {
                this.loading = false
                product.trash = !product.trash
                this.loadDataList()
              })
              .catch((err) => {
                this.loading = false
                this.$myErrorHandler.handle(this, err, '操作失败')
              })
          }).catch(() => {
          })
        }
      },
      handleCopyProduct (product) {
        this.$router.push({
          name: 'CopyProduct',
          params: {
            id: product.id
          }
        })
      },
      updateProductStatus (product) {
        let targetStatus = product.status === STATUS_DOWN ? STATUS_UP : STATUS_DOWN
        let msg = targetStatus === STATUS_DOWN ? '下架商品' : '上架商品'
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          ProductApi.updateStatus(product.id, targetStatus)
            .then((res) => {
              this.loading = false
              product.status = targetStatus
              this.loadDataList()
            })
            .catch((err) => {
              this.loading = false
              this.$myErrorHandler.handle(this, err, '操作失败')
            })
        }).catch(() => {
        })
      },
      async topProduct (product) {
        try {
          await ProductApi.top(product.id)
          this.loadDataList()
        } catch (err) {
          this.$myErrorHandler.handle(this, err, '操作失败')
        }
      },
      showShareUrl (row) {
        this.loading = true
        ShortUrlApi.getShortUrl(row.share_url)
          .then((res) => {
            this.loading = false
            let data = res.data
            const h = this.$createElement
            this.$msgbox({
              title: '推广链接',
              closeOnClickModal: false,
              message: h('div', null, [
                h('div', {style: ''}, row.name),
                h('div', {style: 'margin-top: 10px;'}, (data.short_url)),
                h('div', {style: 'margin-top: 10px;'}, ('请达人点击使用，直接转发此链接无效'))
              ]),
              confirmButtonText: '知道了'
            })
          })
          .catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err)
          })
      },
      downloadMinprogQr(id) {
        var opt = {
          filename: 'product_' + id,
          scene: 'pid_' + id,
          path: 'pages/goodsdetail/index'
        }
        MinprogApi.downloadMinrogQr(opt)
      }
    },
    mounted () {
      this.$eventBus.on('createdProduct', () => {
        this.currentPage = 1
      })
    }
  }
</script>

<style lang="less" scoped>

  .img-cover {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: no-repeat center / 35px 35px;
  }

  .trash {
    text-align: right;
    margin-top: 10px;
  }

  .table-menu {
    font-size: 14px;

  }

  .menu-item {
    font-size: 14px;
  }
</style>

<style lang="less">
  .list-wrapper{
    .hide-expand-column .el-table__expand-column .cell{
      visibility: visible;
    }
  }

</style>
