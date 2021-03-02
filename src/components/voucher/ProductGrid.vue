<template>
  <div class="grid">
    <el-checkbox-group v-model="checkedProductIds">
      <div class="list">
        <div class="item" v-for="item in allItems">
          <div class="ck">
            <el-checkbox :label="item.id" :disabled="getOriginalItemIds.indexOf(item.id) !== -1"
                         @change="itemCheckChanged(arguments[0], item)">
              &nbsp;
            </el-checkbox>
          </div>
          <div class="icon-wrapper"><img :src="item.images[0]" class="img-responsive"></div>
          <div class="desc"><span class="title">{{item.name}}</span><span class="price">¥{{item.original_price}}</span>
          </div>
        </div>
      </div>
    </el-checkbox-group>
  </div>
</template>

<script>
  export default {
    props: {
      originalExclude: {
        type: Array,
        default () {
          return []
        }
      },
      excludePidList: {
        type: Array,
        default () {
          return []
        }
      },
      allItems: {
        type: Array,
        default: () => []
      },
      originalItems: {
        type: Array,
        default: () => []
      },
      newItems: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      originalExcludeIds () {
        return this.originalExclude.map((item) => {
          return item.id
        })
      },
      getOriginalItemIds () {
        if (this.originalExclude.length !== 0) {
          return this.originalExclude.map((item) => {
            return item.id
          })
        } else {
          return this.originalItems.map((item) => {
            return item.id
          })
        }
      },
      originalItemIds () {
        return this.originalItems.map((item) => {
          return item.id
        })
      },
      newItemIds () {
        return this.newItems.map((item) => {
          return item.id
        })
      },
      checkedProductIds () {
        if (this.originalExclude.length !== 0) {
          return this.originalExcludeIds.concat(this.newItemIds)
        } else {
          return this.originalItemIds.concat(this.newItemIds)
        }
      }
    },
    methods: {
      itemCheckChanged (event, product) {
        const index = this.newItems.findIndex((item) => {
          return product.id === item.id
        })
        if (index === -1) {
          this.newItems.push(product)
        }
        if (index !== -1) {
          this.newItems.splice(index, 1)
        }
      }
    }
  }
</script>

<style scoped lang="less">

  .list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .item {
      display: flex;
      position: relative;
      flex: 0 0 47%;
      overflow: hidden;
      text-overflow: ellipsis;
      align-items: center;
      border: solid 1px #ddd;
      margin-top: 8px;
      margin-bottom: 8px;
      padding-left: 10px;
      .ck {
        flex: 0 0 20px;

        .hide {
          visibility: hidden;
        }
      }

      .icon-wrapper {
        flex: 0 0 60px;
        width: 60px;
        height: 60px;
      }

      .desc {
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 5px;
        padding-right: 5px;
        .title {
          display: block;
          font-size: 14px;
          line-height: 18px;
        }

        .price {
          display: block;
          margin-top: 5px;
          font-size: 14px;
          line-height: 18px;
        }

      }

      .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
      }

    }
  }

</style>

<style lang="less">
  .hide-discount-checkbox {
    visibility: hidden;
  }
</style>
