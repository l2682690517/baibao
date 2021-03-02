<template>
  <div>
    <div><span class="section-title">订单信息:</span></div>
    <product-info :order="order" @refresh="$emit('refresh')"></product-info>
  </div>
</template>

<script>
  import ProductInfo from './ProductInfo.vue'

  export default {
    components: {
      ProductInfo
    },
    props: {
      order: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        activeName: 'order'
      }
    }
  }
</script>

<style lang="less" scoped>


</style>
