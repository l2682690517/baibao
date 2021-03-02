<template>
  <div class="grid">
    <el-checkbox-group v-model="checkedProductIds">
      <div class="list">
        <div class="item" v-for="item in allItems">
          <div class="ck"
               :class="{'hide-discount-checkbox': item.discount_item && originCheckedProductIds.indexOf(item.id) === -1}">
            <el-checkbox :label="item.id" @change="_checkItemChanged(item)">&nbsp;</el-checkbox>
          </div>
          <div class="icon-wrapper"><img :src="item.cover || item.images[0]" class="img-responsive"></div>
          <div class="desc"><span class="title">{{item.name}}</span><span class="price">¥{{item.original_price}}</span>
          </div>
          <div class="mask" v-show="item.discount_item && originCheckedProductIds.indexOf(item.id) === -1"></div>
        </div>
      </div>
    </el-checkbox-group>
  </div>
</template>

<script>
  export default {
    props: {
      allItems: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        originCheckedProductIds: [],
        checkedProductIds: [],
        checkedItems: []
      }
    },
    methods: {
      setCheckedDiscountItems (discountItems) {
        this.originCheckedProductIds = []
        this.checkedProductIds = []
        let newItems = []
        discountItems.forEach(item => {
          this.originCheckedProductIds.push(item.product.id)
          this.checkedProductIds.push(item.product.id)
          newItems.push(item)
        })
        this.checkedItems = newItems
      },
      _checkItemChanged (ev) {
        const chkValue = ev.id
        let findIndex = this.checkedProductIds.findIndex((i) => {
          return i === ev.id
        })
        if (findIndex !== -1) {
          let find = this._findProduct(this.allItems, chkValue)
          if (find) {
            let newCheckItem = {}
            if (find.data.discount_item && find.data.discount_item.id) {
              const tmpDis = find.data.discount_item
              newCheckItem = {
                id: tmpDis.id,
                pid: tmpDis.pid,
                tp: tmpDis.tp,
                price: tmpDis.price, // 折后价格
                discount: tmpDis.discount,  // 折扣
                original_price: tmpDis.original_price,
                seckill_price: tmpDis.seckill_price,
                dis_rate: tmpDis.dis_rate,
                product: find.data
              }
            } else {
              newCheckItem = {
                id: 0,
                pid: find.data.id,
                tp: 0,
                price: 0, // 折后价格
                discount: 0,  // 折扣
                original_price: '',
                seckill_price: '',
                dis_rate: '',
                product: find.data
              }
            }
            this.checkedItems.push(newCheckItem)
          }
        } else {
          let find = this._findDiscount(this.checkedItems, chkValue)
          if (find) {
            this.checkedItems.splice(find.index, 1)
          }
        }
      },
      _findProduct (arr, id) {
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i]
          if (String(item.id) === String(id)) {
            return {
              data: item,
              index: i
            }
          }
        }
        return null
      },
      _findDiscount (arr, pid) {
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i]
          if (String(item.product.id) === String(pid)) {
            return {
              data: item,
              index: i
            }
          }
        }
        return null
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
