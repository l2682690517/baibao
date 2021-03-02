<template>
    <el-dialog title="添加折扣商品"  :visible.sync="dialogVisible" @open="_openCallback">
      <div>
          <choose-category-and-tag-bar  ref="chosecatetag" :origin-category="filterForm.cates" :origin-tags="filterForm.tags" :origin-name="filterForm.name" @search="_search">
          </choose-category-and-tag-bar>
      </div>
      <div class="content" v-loading="loading">
        <discount-product-grid ref="grdProduct" :allItems="dataList.data"></discount-product-grid>
      </div>
      <div class="pager-wrapper" v-show="dataList.total>filterForm.limit">
        <el-pagination
          layout="total, prev, pager, next"
          :total="dataList.total"
          :current-page=filterForm.page
          :page-size="filterForm.limit"
          @current-change="_changePage">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="_submitForm">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
  import DiscountProductGrid from './DiscountProductGrid'
  import DiscountApi from '../../api/discount'
  import ChooseCategoryAndTagBar from 'src/components/product/ChooseCategoryAndTagBar'
  import CategoryApi from '../../api/category'
  import TagApi from '../../api/tag'

  export default {
    components: {
      DiscountProductGrid,
      ChooseCategoryAndTagBar
    },
    props: {
      originItems: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        loading: false,
        dialogVisible: false,
        dataList: {},
        filterForm: {
          limit: 10,
          page: 1,
          name: '',
          cates: '',
          tags: ''
        }
      }
    },
    computed: {
    },
    methods: {
      show() {
        this.dialogVisible = true
      },
      hide() {
        this.dialogVisible = false
      },
      _changePage (current) {
        this.filterForm.page = current
        this._refreshListForm()
      },
      _openCallback() {
        this.$nextTick(() => {
          this.$refs.grdProduct.setCheckedDiscountItems(this.originItems)
        })
      },
      loadNecessaryData() {
        this.getAllCategory()
        this.getAllTag()
      },
      getAllCategory() {
        CategoryApi.setStoreAllCategoryList()
          .then((res) => {
          })
          .catch((err) => {
            this.$myErrorHandler.handle(this, err, '查询分类失败')
          })
      },
      getAllTag() {
        TagApi.getTagGroupList()
          .then((res) => {
          })
          .catch((err) => {
            this.$myErrorHandler.handle(this, err, '查询标签失败')
          })
      },

      filterCateAndTag() {
        this.$refs.dlgFilterCatTag.show()
      },

      _goFirstPageAndRefreshFormData() {
        if (this.filterForm.page === 1) {
          this._refreshListForm()
        } else {
          this.filterForm.page = 1
        }
      },

      async _refreshListForm() {
        this.loading = true
        try {
          const res = await DiscountApi.getItems(this.filterForm)
          this.dataList = res.data
          this.loading = false
        } catch (err) {
          this.loading = false
          this.$myErrorHandler.handle(this, err, '查询失败')
        }
      },

      _search(param) {
        this.filterForm.name = param.name
        this.filterForm.tags = param.tags
        this.filterForm.cates = param.cates
        this._goFirstPageAndRefreshFormData()
      },

      _submitForm() {
        this.$emit('submit', this.$refs.grdProduct.checkedItems.slice())
        this.hide()
      }
    },
    watch: {
      dialogVisible: function (newValue, oldValue) {
        if (newValue) {
          this._refreshListForm()
        } else {
          this.filterForm = {
            limit: 10,
            page: 1,
            name: '',
            cates: '',
            tags: ''
          }
        }
      }
    },
    created() {
      this.loadNecessaryData()
    }
  }
</script>

<style scoped lang="less">

  .content {
    clear: both;
  }

  .pager-wrapper {
    text-align: center;
  }

</style>
