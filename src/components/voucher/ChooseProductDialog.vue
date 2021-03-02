<template>
    <el-dialog title="选择商品" width="50%"  :visible.sync="dialogVisible">
      <div>
          <choose-category-and-tag-bar itemclass="form-item-margin-22" ref="chosecatetag" :origin-category="filterForm.cates" :origin-tags="filterForm.tags"
                                        :origin-name="filterForm.name" @search="search">
          </choose-category-and-tag-bar>
      </div>
      <div class="content" v-loading="loading">
        <product-grid ref="grdProduct" :allItems="dataList.data" :originalItems="originalItems" :excludePidList="excludePidList" :originalExclude="originalExclude"
                      :newItems="newItems"></product-grid>
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
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
        <el-button  size="medium" type="primary" :disabled="newItems.length === 0" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

</template>

<script>
  import ProductApi from '../../api/product'
  import ChooseCategoryAndTagBar from 'src/components/product/ChooseCategoryAndTagBar'
  import CategoryApi from '../../api/category'
  import TagApi from '../../api/tag'
  import ProductGrid from './ProductGrid.vue'

  export default {
    components: {
      ChooseCategoryAndTagBar,
      ProductGrid
    },
    props: {
      originalExclude: {
        type: Array,
        default() {
          return []
        }
      },
      excludePidList: {
        type: Array,
        default() {
          return []
        }
      },
      originalItems: {
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
          tags: '',
          trash: false
        },
        newItems: []
      }
    },
    computed: {
    },
    methods: {
      show(items) {
        this.newItems = []
        items.forEach((item) => {
          this.newItems.push(item)
        })
        this.dialogVisible = true
      },
      hide() {
        this.dialogVisible = false
      },
      changePage (current) {
        this.filterForm.page = current
        this.refreshListForm()
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
      goFirstPageAndRefreshFormData() {
        if (this.filterForm.page === 1) {
          this.refreshListForm()
        } else {
          this.filterForm.page = 1
        }
      },

      async refreshListForm() {
        this.loading = true
        try {
          const res = await ProductApi.getList(this.filterForm)
          this.dataList = res.data
          this.loading = false
        } catch (err) {
          this.loading = false
          this.$myErrorHandler.handle(this, err, '查询失败')
        }
      },

      search(param) {
        this.filterForm.tags = param.tags
        this.filterForm.cates = param.cates
        this.filterForm.name = param.name
        this.goFirstPageAndRefreshFormData()
      },

      submitForm() {
        this.$emit('submit', this.newItems)
        this.hide()
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
            cates: '',
            trash: false,
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

