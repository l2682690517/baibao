<template>
  <div class="product-cell">
    <div class="icon" v-lazy:background-image="orderItem.img">
    </div>
    <div class="desc">
      <div class="name">商品名称: {{orderItem.name}}</div>
      <div v-if="orderItem.spec">规格: {{orderItem.spec}}</div>
      <div>价格: {{orderItem.total_price | price}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      orderItem: {
        type: Object,
        default() {
          return {}
        }
      }
    }
  }
</script>

<style lang="less" scoped>

  .product-cell {
    display: flex;

    .icon {
      width: 80px;
      height: 80px;
      background-size: cover;
    }

    .desc {
      flex: 1;
      line-height: 1.4;
      padding-left: 5px;

      .name {

      }

      & > div {
        padding-bottom: 10px;
      }
    }
  }

</style>
