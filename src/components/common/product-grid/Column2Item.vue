<template lang="pug">
  div.column-content
    div.cover(v-lazy:background-image="model.cover || model.images[0]")
      div.sold-out-cover(v-show="soldOut")
    div.name {{model.name}}
    div.price {{model | goodsCurrentMinPrice}}
</template>

<script>
  import { isSoldOut } from 'src/utils/productUtil'

  export default {
    props: {
      model: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    computed: {
      soldOut () {
        return isSoldOut(this.model)
      }
    }
  }
</script>

<style lang="scss" scoped>

  $column-width: 110px;

  .column-content {
    line-height: 15px;
    background-color: #fff;
    margin-bottom: 8px;

    width: $column-width;

    .cover {
      position: relative;
      width: $column-width;
      height: $column-width;
      background-size: cover;

      .sold-out-cover {
        position: absolute;
        left: 0;
        top: 0;
        width: 110px;
        height: 110px;
        background: url("~@/assets/img/soldout.png") no-repeat center / 60px 60px;
      }
    }

    .name {
      padding-left: 3px;
      padding-right: 3px;
      color: #4A4A4A;
      width: 100%;
      font-size: 12px;
      margin-top: 5px;
      line-height: 15px;
      height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      word-break: break-all;
    }

    .price {
      width: 100%;
      color: #FC2B7B;
      font-size: 14px;
      margin-top: 5px;
      text-align: center;
    }
  }
</style>
