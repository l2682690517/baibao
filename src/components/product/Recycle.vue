<template>
  <div class="order">
    <div class="breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/product' }">商品</el-breadcrumb-item>
        <el-breadcrumb-item>回收站</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true">
      <el-form-item>
        <choose-category-and-tag-bar  ref="chosecatetag" :origin-category="queryParams.cates"
                                      :origin-tags="queryParams.tags" :showSearchText="false" :showSearchBtn="false"
                                      @choose="chooseCateAndTagComplete"></choose-category-and-tag-bar>
      </el-form-item>
      <el-form-item>
        <el-input class="input" v-model="queryParams.name" placeholder="搜索商品名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input class="input" v-model="queryParams.sku_code" placeholder="搜索商品编码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" @click="search">搜&nbsp;索</el-button>
      </el-form-item>
    </el-form>
    <list ref="list" :queryParams="queryParams" :mode="3"></list>
  </div>
</template>

<script>
  import CategoryApi from '../../api/category'
  import TagApi from '../../api/tag'
  import List from './List.vue'
  import ChooseCategoryAndTagBar from './ChooseCategoryAndTagBar'
  import * as ObjectUtil from '../../utils/objectUtil'

  export default {
    components: {
      List,
      ChooseCategoryAndTagBar
    },
    data() {
      return {
        queryParams: {
          name: '',
          sort: '',
          order: '',
          sku_code: '',
          trash: true,
          cates: '',
          tags: ''
        }
      }
    },
    computed: {
    },
    methods: {
      search() {
        let query = ObjectUtil.filterEmpty(this.queryParams)
        query._t = new Date().getTime()
        this.$router.replace({
          path: '/product/recycle',
          query: query
        })
      },
      filterCateAndTag() {
        this.$refs.dlgFilterCatTag.show()
      },
      chooseCateAndTagComplete(chooseCategory, chooseTags) {
        this.queryParams.tags = chooseTags
        this.queryParams.cates = chooseCategory
      },
      resetParam(query) {
        this.queryParams.cates = ''
        this.queryParams.tags = ''
        this.queryParams.name = ''
        this.queryParams.trash = true
        this.queryParams.sku_code = ''
        this.queryParams = Object.assign(this.queryParams, query)
      },
      loadData() {
        this.$refs.list.loadFirstPageDataList()
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
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        let query = to.query
        vm.resetParam(query)
        vm.loadData()
      })
    },
    beforeRouteUpdate(to, from, next) {
      if (to.fullPath !== from.fullPath) {
        let query = to.query
        this.resetParam(query)
        this.loadData()
        next()
      }
    },
    activated() {
      this.loadNecessaryData()
    }
  }
</script>

<style lang="less" scoped>

  .searchWrapper {
    text-align: right;

    .input {
      width: 120px;
      margin-right: 5px;
    }
  }
  .filter-wrapper {
    float: left;

    .filter-action {
      float: left;
      margin-right: 10px;
    }

    .filter-content {
      margin-top: 5px
    }

  }
</style>

