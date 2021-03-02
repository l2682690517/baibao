<template lang="pug">
  div.column1content
    div.cover( v-lazy:background-image="model.cover || model.images[0]")
      div.sold-out-cover(v-show="soldOut")
    div.desc
      div.single-line.name {{model.name}}
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
      soldOut (goods) {
        return isSoldOut(this.model)
      }
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  .column1content {
    display: flex;
    padding-bottom: 3px;
    background-color: #fff;

    .cover {
      position: relative;
      width: 75px;
      height: 75px;
      background-size: cover;
    }

    .sold-out-cover {
      position: absolute;
      left: 0;
      top: 0;
      width: 75px;
      height: 75px;
      background: url("~@/assets/img/soldout.png") no-repeat center / 45px 45px;
    }

    .desc {
      line-height: 15px;
      margin-left: 10px;
      padding-left: 3px;
      padding-right: 3px;
      min-width: 0px;
      flex: 1;

      .name {
        color: #4A4A4A;
        font-size: 12px;
      }

      .price {
        color: #FC2B7B;
        font-size: 14px;
        margin-top: 5px;
      }
    }
  }
</style>
