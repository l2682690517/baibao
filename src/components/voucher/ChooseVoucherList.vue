<template>
  <div class="grid">
    <el-checkbox-group v-model="checkedVoucherIds">
      <div class="list">
        <div class="item" v-for="item in allItems">
          <div class="ck">
            <el-checkbox :label="item.id" :disabled="originalItemIds.indexOf(item.id) !== -1"
                         @change="itemCheckChanged(arguments[0], item)">
              &nbsp;{{item.name}}
            </el-checkbox>
          </div>
          <div class="desc">{{amountText(item)}}
          </div>
        </div>
      </div>
    </el-checkbox-group>
  </div>
</template>

<script>
  import { convertFenToYuan } from 'src/utils/moneyUtil'

  export default {
    props: {
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
      originalItemIds() {
        return this.originalItems.map((item) => {
          return item.id
        })
      },
      newItemIds() {
        return this.newItems.map((item) => {
          return item.id
        })
      },
      checkedVoucherIds() {
        return this.originalItemIds.concat(this.newItemIds)
      }
    },
    methods: {
      itemCheckChanged(event, voucher) {
        const index = this.newItems.findIndex((item) => {
          return voucher.id === item.id
        })
        if (index === -1) {
          this.newItems.push(voucher)
        }
        if (index !== -1) {
          this.newItems.splice(index, 1)
        }
      },
      amountText (voucher) {
        if (voucher.full_amount === 0) {
          return `立减${convertFenToYuan(voucher.amount)}`
        } else {
          return `满${convertFenToYuan(voucher.full_amount)}减${convertFenToYuan(voucher.amount)}`
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
        padding-top: 5px;
        .hide {
          visibility: hidden;
        }
      }


      .desc {
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 5px;
        padding-right: 5px;
        font-size: 12px;
      }


    }
  }

</style>

<style lang="less">
  .hide-discount-checkbox {
    visibility: hidden;
  }
</style>
