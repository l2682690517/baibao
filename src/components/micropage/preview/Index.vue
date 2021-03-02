<template lang="pug">
  div
    el-dialog(title="微页面预览", width="50%",  :visible.sync="dialogVisible")
      div.content
        template(v-for!="item in model.items")
          div.item-content(v-if="item.tp !== 6")
            div.preview-image
              img(:src="item.cover")
          div.product-list-wrapper(v-lazy:background-image="item.cover")
            product-grid(:dataList="upProductList(item)", :columnCount="item.column_count")

      div.dialog-footer(slot="footer")
        el-button(@click="dialogVisible = false") 取消
</template>

<script>
  import ProductGrid from 'src/components/common/product-grid/Index.vue'

  export default {
    components: {
      ProductGrid
    },
    data () {
      return {
        dialogVisible: false,
        model: {
          items: []
        }
      }
    },
    methods: {
      upProductList (item) {
        if (!item.product_list) {
          return []
        }
        return item.product_list.filter((product) => {
          return product.status === 1
        })
      },
      async show (model) {
        this.model = model
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      }
    }
  }
</script>

<style lang="less" scoped>

  .content {
    width: 280px;
    margin-left: auto;
    margin-right: auto;
  }

  .preview-image {
    img {
      width: 100%;
      display: block;
    }
  }

  .product-list-wrapper {
    padding: 10px 15px;
    background-size: 100% auto;
    background-repeat: repeat-y;
  }

</style>
