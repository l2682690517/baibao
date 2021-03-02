<template>
  <div>
    <el-dialog title="选择商品" width="50%" :visible.sync="dialogVisible" @open="openCallback">
      <div class="tool-bar">
        <choose-category-and-tag-bar ref="chosecatetag" :origin-category="filterForm.cates" :showSearchCode="true"
                                     :origin-tags="filterForm.tags" :origin-name="filterForm.name" @search="search">
        </choose-category-and-tag-bar>
      </div>
      <div class="content" v-loading="loading">
        <product-grid ref="grdProduct" :mode="mode" :allItems="dataList.data" @item-click="itemClick"></product-grid>
      </div>
      <div class="pager-wrapper" v-show="dataList.total>filterForm.limit">
        <el-pagination
          layout="total, prev, pager, next"
          :total="dataList.total"
          :current-page=filterForm.page
          :page-size="filterForm.limit"
          @current-change="changePage">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer" v-if="mode === $options.MODE_MULTIPLE">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import ProductApi from '../../../api/product'
  import ChooseCategoryAndTagBar from 'src/components/product/ChooseCategoryAndTagBar'
  import CategoryApi from '../../../api/category'
  import TagApi from '../../../api/tag'
  import ProductGrid from './ProductGrid.vue'

  const MODE_SINGLE = 0
  const MODE_MULTIPLE = 1

  export default {
    MODE_SINGLE,
    MODE_MULTIPLE,
    components: {
      ChooseCategoryAndTagBar,
      ProductGrid
    },
    props: {
      mode: {
        type: Number,
        default: MODE_SINGLE
      }
    },
    data () {
      return {
        loading: false,
        dialogVisible: false,
        dataList: {},
        filterForm: {
          limit: 10,
          page: 1,
          name: '',
          cates: '',
          tags: '',
          trash: false
        }
      }
    },
    computed: {},
    methods: {
      async show (originalCheckedItems) {
        this.dialogVisible = true
        if (originalCheckedItems) {
          await this.$nextTick()
          this.$refs.grdProduct.setCheckedItems(originalCheckedItems)
        }
      },
      hide () {
        this.dialogVisible = false
      },
      changePage (current) {
        this.filterForm.page = current
        this.refreshListForm()
      },
      loadNecessaryData () {
        this.getAllCategory()
        this.getAllTag()
      },
      getAllCategory () {
        CategoryApi.setStoreAllCategoryList()
          .then((res) => {
          })
          .catch((err) => {
            this.$myErrorHandler.handle(this, err, '查询分类失败')
          })
      },
      getAllTag () {
        TagApi.getTagGroupList()
          .then((res) => {
          })
          .catch((err) => {
            this.$myErrorHandler.handle(this, err, '查询标签失败')
          })
      },

      filterCateAndTag () {
        this.$refs.dlgFilterCatTag.show()
      },
      goFirstPageAndRefreshFormData () {
        if (this.filterForm.page === 1) {
          this.refreshListForm()
        } else {
          this.filterForm.page = 1
        }
      },

      async refreshListForm () {
        this.loading = true
        try {
          const res = await ProductApi.getList(Object.assign({status: 1}, this.filterForm))
          this.dataList = res.data
          this.loading = false
        } catch (err) {
          this.loading = false
          this.$myErrorHandler.handle(this, err, '查询失败')
        }
      },

      search (param) {
        this.filterForm.tags = param.tags
        this.filterForm.cates = param.cates
        this.filterForm.name = param.name
        this.filterForm.sku_code = param.sku_code
        this.goFirstPageAndRefreshFormData()
      },

      submitForm () {
        this.$emit('choose', this.$refs.grdProduct.checkedItems.slice())
        this.hide()
      },
      itemClick (item) {
        if (this.mode === MODE_SINGLE) {
          this.$emit('choose', item)
          this.hide()
        }
      },
      async openCallback () {
      }
    },
    watch: {
      dialogVisible: function (newValue, oldValue) {
        if (newValue) {
          this.refreshListForm()
        } else {
          this.filterForm = {
            limit: 10,
            page: 1,
            name: '',
            trash: false,
            cates: '',
            tags: ''
          }
        }
      }
    },
    created () {
      this.loadNecessaryData()
    }
  }
</script>

<style scoped lang="less">

  .tool-bar {
    .search-wrapper {
      display: inline-block;
      padding-bottom: 5px;
      margin-right: 10px;

      .input-text {
        width: 150px;
        margin-right: 8px;
      }

    }

    .filter-wrapper {
      display: inline-block;

      padding-bottom: 5px;

      .filter-btn {
        margin-right: 10px;
      }

      .tag-wrapper {
        margin-top: 5px;
        display: inline-block;

        .tag-content {
          display: inline-block;
          max-width: 200px
        }
      }
    }
  }

  .content {
    clear: both;
  }

  .pager-wrapper {
    text-align: center;
  }

</style>
