<template>
  <div class="grid">
    <el-checkbox-group v-model="checkedItemIds">
      <div class="list">
        <div class="item" v-for="item in allItems" @click="$emit('item-click',item)">
          <div class="ck" v-if="mode === $options.MODE_MULTIPLE">
            <el-checkbox :label="item.id" @change="checkItemChanged(item)">&nbsp;</el-checkbox>
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

  const MODE_SINGLE = 0
  const MODE_MULTIPLE = 1

  export default {
    MODE_SINGLE,
    MODE_MULTIPLE,
    props: {
      allItems: {
        type: Array,
        default: () => []
      },
      mode: {
        type: Number,
        default: MODE_SINGLE
      }
    },
    data () {
      return {
        checkedItems: [],
        checkedItemIds: []
      }
    },
    methods: {
      setCheckedItems (items) {
        this.checkedItemIds = []
        let newItems = []
        items.forEach(item => {
          this.checkedItemIds.push(item.id)
          newItems.push(item)
        })
        this.checkedItems = newItems
      },
      checkItemChanged (ev) {
        const chkValue = ev.id
        const findIndex = this.checkedItems.findIndex((item) => {
          return `${item.id}` === `${chkValue}`
        })
        let data = this.checkedItemIds.findIndex((i) => {
          return i === ev.id
        })
        if (data !== -1) {
          if (findIndex !== -1) {
            return
          }
          let findItem = this.allItems.find((item) => {
            return `${item.id}` === `${chkValue}`
          })
          if (findItem) {
            this.checkedItems.push(findItem)
          }
        } else {
          if (findIndex !== -1) {
            this.checkedItems.splice(findIndex, 1)
          }
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
      padding-left: 5px;
      cursor: pointer;

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

    }
  }

</style>

<style lang="less">


  .hide-discount-checkbox {
    visibility: hidden;
  }
</style>
