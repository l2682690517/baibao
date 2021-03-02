<template>
  <div>
    <div class="tab">
      <el-table ref="tabProduct" :data="allDataList" :show-header="false" :height="180">
        <el-table-column :resizable="false">
          <template slot-scope="scope">
            <div class="info-wrapper">
              <div class="icon" v-lazy:background-image="scope.row.images[0]"></div>
              <div class="desc ">
                <div class="title single-line">{{scope.row.name}}</div>
                <div class="price single-line">¥{{scope.row.original_price}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" :disabled="!isEnabledDel(scope.row)" @click="delItem(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button class="add-btn" type="primary" size="mini" @click="chooseProduct">
      {{buttonText}}
    </el-button>
    <choose-product-dialog ref="dlgChooseProduct" :excludePidList="excludePidList" :originalExclude="originalExclude"
                           :originalItems="originalInclude" @submit="chooseProductCompleted"></choose-product-dialog>
  </div>
</template>

<script>
  import ChooseProductDialog from './ChooseProductDialog'
  import {RANGE_TYPE_ALL, RANGE_TYPE_PRODUCT} from 'src/constants/voucher'

  const MODE_DEFAULT = 0
  const MODE_EDIT = 1

  export default {
    RANGE_TYPE_ALL,
    RANGE_TYPE_PRODUCT,
    MODE_DEFAULT,
    MODE_EDIT,
    components: {
      ChooseProductDialog
    },
    props: {
      excludePidList: {
        type: Array,
        default() {
          return []
        }
      },
      originalInclude: {
        type: Array,
        default() {
          return []
        }
      },
      originalExclude: {
        type: Array,
        default() {
          return []
        }
      },
      type: {
        type: Number,
        default: RANGE_TYPE_ALL
      },
      mode: {
        type: Number,
        default: MODE_DEFAULT
      }
    },
    data() {
      return {
        newInclude: [],
        newExclude: []
      }
    },
    computed: {
      buttonText() {
        return this.type === RANGE_TYPE_ALL ? '添加不适用商品' : '添加指定商品'
      },
      currentNewItems() {
        return this.type === RANGE_TYPE_ALL ? this.newExclude : this.newInclude
      },
      allDataList() {
        return this.type === RANGE_TYPE_ALL ? this.originalExclude.concat(this.newExclude).reverse() : this.originalInclude.concat(this.newInclude).reverse()
      },
      originalIncludeIds() {
        return this.originalInclude.map((item) => {
          return item.id
        })
      },
      originalExcludeIds() {
        return this.originalExclude.map((item) => {
          return item.id
        })
      }
    },
    methods: {
      chooseProduct() {
        this.$refs.dlgChooseProduct.show(this.currentNewItems)
      },
      chooseProductCompleted(items) {
        if (this.type === RANGE_TYPE_ALL) {
          this.newExclude = items
        } else {
          this.newInclude = items
        }
      },
      isEnabledDel(row) {
        if (this.type === RANGE_TYPE_ALL || (this.type === RANGE_TYPE_PRODUCT && this.originalInclude.indexOf(row) === -1)) {
          return true
        } else {
          return false
        }
      },
//      isEnabledAdd() {
//        if (this.type === RANGE_TYPE_ALL && this.mode === MODE_EDIT) {
//          return false
//        }
//        return true
//      },
      delItem(row) {
        this.$confirm('确定要删除?').then(() => {
          let arrs = []
          if (this.type === RANGE_TYPE_ALL) {
            arrs = [this.originalExclude, this.newExclude]
          } else {
            arrs = [this.originalInclude, this.newInclude]
          }
          arrs.forEach((arr) => {
            let index = arr.indexOf(row)
            if (index !== -1) {
              arr.splice(index, 1)
            }
          })
        }).catch(() => {
        })
      },
      getChooseIds() {
        return this.allDataList.map((item) => {
          return item.id
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

  .tab {
    width: 400px;
    border: 1px solid #e6ebf5;
  }

  .add-btn {
    margin-top: 10px;
  }

  .info-wrapper {
    padding-top: 8px;
    padding-bottom: 8px;
    display: flex;

    .icon {
      width: 40px;
      height: 40px;
      margin-right: 5px;
      background-size: cover;
    }

    .desc {
      font-size: 12px;
      line-height: 14px;
      max-width: 220px;
    }
  }

</style>
