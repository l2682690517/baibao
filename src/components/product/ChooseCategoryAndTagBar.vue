<template>
  <el-form :inline="true">
    <el-form-item :class="itemclass">
      <el-cascader clearable class="cascader"
                   placeholder="请选择分类"
                   :options="groupCategory" :props="casprop" expand-trigger="hover"
                   v-model="chooseCategory" clearable :change-on-select="true" @change="cateChange">
      </el-cascader>
    </el-form-item>
    <el-form-item>
      <el-select class="tag" v-model="chooseTags" clearable multiple placeholder="请选择标签" @change="tagChange">
        <el-option-group
          v-for="group in allTagGroup"
          :key="group.id"
          :label="group.name">
          <el-option
            v-for="item in group.tags"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-option-group>
      </el-select>
    </el-form-item>
    <el-form-item v-if="showSearchText">
      <el-input placeholder="搜索商品" v-model="searchText"></el-input>
    </el-form-item>
    <el-form-item v-if="showSearchCode">
      <el-input placeholder="商品编码" v-model="searchCode"></el-input>
    </el-form-item>
    <el-form-item v-if="showSearchBtn">
      <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: {
      originTags: {
        type: String,
        default () {
          return ''
        }
      },
      originCategory: {
        type: String,
        default () {
          return ''
        }
      },
      originName: {
        type: String,
        default () {
          return ''
        }
      },
      showSearchText: {
        type: Boolean,
        default () {
          return true
        }
      },
      showSearchCode: {
        type: Boolean,
        default () {
          return false
        }
      },
      showSearchBtn: {
        type: Boolean,
        default () {
          return true
        }
      },
      itemclass: {
        type: String,
        default () {
          return ''
        }
      }
    },
    data () {
      return {
        loading: false,
        chooseTags: [],
        searchText: '',
        searchCode: '',
        chooseCategory: [],
        casprop: {
          value: 'id',
          label: 'name',
          children: 'categorys'
        }
      }
    },
    computed: {
      ...mapGetters({
        allCategory: 'allCategory',
        allTagGroup: 'allTagGroup'
      }),
      groupCategory: {
        get () {
          let group = Object.assign([], this.allCategory)
          for (var g of group) {
            if (g.categorys && g.categorys.length === 0) {
              delete g.categorys
            }
          }
          return group
        }
      }
    },
    methods: {
      tagChange () {
        let chooseCategory = this.chooseCategory.join('_')
        let chooseTags = this.chooseTags.join('_')
        this.$emit('choose', chooseCategory, chooseTags)
      },
      cateChange (v) {
        let chooseCategory = this.chooseCategory.join('_')
        let chooseTags = this.chooseTags.join('_')
        this.$emit('choose', chooseCategory, chooseTags)
      },
      search () {
        let chooseCategory = this.chooseCategory.join('_')
        let chooseTags = this.chooseTags.join('_')
        this.$emit('search', {
          name: this.searchText,
          sku_code: this.searchCode,
          tags: chooseTags,
          cates: chooseCategory
        })
      }
    },
    watch: {
      originCategory (cates) {
        if (!cates) {
          this.chooseCategory = []
          return
        }
        this.chooseCategory = cates.split('_').map((val) => { return parseInt(val, 10) })
      },
      originTags (tags) {
        if (!tags) {
          this.chooseTags = []
          return
        }
        this.chooseTags = tags.split('_').map((val) => {
          return parseInt(val, 10)
        })
      },
      originName (name) {
        this.searchText = name
      }
    }
  }
</script>

<style scoped lang="less">
  .cascader {
    width: 180px;
  }

  .tag {
    width: 260px;
  }

  .form-item-margin-22 {
    margin-bottom: 22px;
  }
</style>
