<template>
  <div class="tool-bar">
    <el-form :inline="true">
      <el-form-item>
        <el-checkbox v-model="model.top">置顶</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-radio-group class="status" v-model="model.status">
          <el-radio-button style="margin-top: 0px" :label="0">全部</el-radio-button>
          <el-radio-button :label="1">出售中</el-radio-button>
          <el-radio-button :label="3">缺货</el-radio-button>
          <el-radio-button :label="2">已下架</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上架时间">
        <date-tool-bar :oratimeRange="oratimeRange"  ref="datetoolbar"
                       @change="_dateChanged"></date-tool-bar>
      </el-form-item>


      <el-form-item label="商品编码:">
        <el-input v-model="model.sku_code"></el-input>
      </el-form-item>
      <el-form-item label="商品名称:">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="商品ID:">
        <el-input class="input-id" v-model="model.id"></el-input>
      </el-form-item>
      <el-form-item>
        <choose-category-and-tag-bar ref="chosecatetag" :origin-category="model.cates" :showSearchText="false"
                                     :showSearchBtn="false"
                                     :origin-tags="model.tags"
                                     @choose="chooseCateAndTagComplete"></choose-category-and-tag-bar>
      </el-form-item>
      <el-form-item>
        <el-select v-model="model.buyers" clearable multiple placeholder="选择采购人">
          <el-option
            v-for="buyer in buyers"
            :key="buyer"
            :label="buyer"
            :value="buyer">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button type="primary" @click="exportCsv">导出</el-button>
      </el-form-item>
    </el-form>


    <el-form :inline="true">
      <el-form-item style="margin-bottom: 0">
        <el-button class="create" type="primary" icon="el-icon-plus" @click="handleCreate">添加商品</el-button>
        <el-button-group>
          <el-button type="primary" :disabled="selection.length === 0" @click="chooseCategory">批量分类</el-button>
          <el-button type="primary" :disabled="!upDownEnabled" @click="updateStatus">{{updateStatusText}}</el-button>
          <el-button type="primary" :disabled="selection.length === 0" @click="chooseTags">批量标签</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
    <choose-category-dialog
      ref="dlgChooseCategory"
      @submit="chooseCateComplete">
    </choose-category-dialog>
    <choose-tag-dialog
      ref="dlgChooseTag"
      :denyEmpty="true"
      :origin="selection"
      @submit="chooseTagComplete">
    </choose-tag-dialog>

  </div>
</template>

<script>
  import CategoryApi from '../../api/category'
  import TagApi from '../../api/tag'
  import ProductApi from '@/api/product'
  import ChooseCategoryAndTagBar from './ChooseCategoryAndTagBar'
  import ChooseCategoryDialog from '../category/ChooseCategoryDialog'
  import ChooseTagDialog from '../tag/ChooseTagDialog'
  import DateToolBar from 'src/common/widgets/DateToolBar'

  //eslint-disable-next-line
  const SS_ALL = 0
  //eslint-disable-next-line
  const SS_UP = 1
  //eslint-disable-next-line
  const SS_DOWN = 2
  //eslint-disable-next-line
  const SS_NO_STOCK = 3
  const STATUS_UP = 1 // 上架
  const STATUS_DOWN = 2 // 下架

  export default {
    SS_ALL,
    SS_UP,
    SS_DOWN,
    SS_NO_STOCK,
    STATUS_UP,
    STATUS_DOWN,
    props: {
      selection: {
        type: Array,
        default () {
          return []
        }
      },
      model: {
        type: Object,
        default: () => {
          return {
            id: '',
            name: '',
            sku_code: '',
            status: SS_ALL,
            top: true,
            cates: '',
            tags: '',
            upStartDate: '',
            upEndDate: '',
            buyers: []
          }
        }
      }
    },
    components: {
      ChooseCategoryAndTagBar,
      ChooseCategoryDialog,
      ChooseTagDialog,
      DateToolBar
    },
    data () {
      return {
        buyers: []
      }
    },
    computed: {
      oratimeRange () {
        let oratimeRange = [this.model.upStartDate, this.model.upEndDate]
        return oratimeRange
      },
      updateStatusText () {
        if (this.status === SS_DOWN) {
          return '批量上架'
        } else {
          return '批量下架'
        }
      },
      upDownEnabled () {
        if (this.status === SS_DOWN) {
          // 如果是批量上架， 所选至少有一个已下架商品
          return this.selection.some(({status}) => status !== 1)
        } else {
          // 否则， 所选至少有一个已上架商品
          return this.selection.some(({status}) => status === 1)
        }
      }
    },
    methods: {
      loadNecessaryData () {
        this.getAllCategory()
        this.getAllTag()
        this.getBuyers()
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
      getBuyers () {
        ProductApi.getBuyerList()
          .then((res) => {
            this.buyers = res.data.data
          })
          .catch((err) => {
            this.$myErrorHandler.handle(this, err, '查询购买人失败')
          })
      },

      handleCreate () {
        this.$router.push({
          name: 'CreateProduct'
        })
      },

      search () {
        this.$emit('filter', this.model)
      },
      _dateChanged (val) {
        if (val) {
          const dates = val
          this.model.upStartDate = dates[0]
          this.model.upEndDate = dates.length > 1 ? dates[1] : ''
        } else {
          this.model.upStartDate = ''
          this.model.upEndDate = ''
        }
      },

      filterCateAndTag () {
        this.$refs.dlgFilterCatTag.show()
      },
      chooseCateAndTagComplete (chooseCategory, chooseTags) {
        this.model.tags = chooseTags
        this.model.cates = chooseCategory
      },

      chooseCategory () {
        this.$refs.dlgChooseCategory.show()
      },
      chooseCateComplete (component) {
        component.hide()
        this.$emit('chooseCategory', component.chooseCategoryId)
      },

      chooseTags () {
        this.$refs.dlgChooseTag.show()
      },
      chooseTagComplete (result) {
        result.component.hide()
        if (result.add_tags.length === 0 && result.del_tags.length === 0) {
          return
        }
        this.$emit('chooseTag', {'add_tags': result.add_tags, 'del_tags': result.del_tags})
      },
      updateStatus () {
        this.$emit('updateStatus', this.status)
      },
      exportCsv () {
        this.$emit('export', this.filter)
      }
    },
    activated () {
      this.loadNecessaryData()
    }
  }
</script>

<style lang="less" scoped>

  .tool-bar {
    .input-id {
      width: 80px;
    }
  }
</style>
