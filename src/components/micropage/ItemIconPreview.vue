<template lang="pug">
  div.icon-root
    div.column1(v-if="model.column_count === 1")
      div.icon(v-for!="(item, index) in productList", v-lazy:background-image="item.cover || item.images[0]")
    div.column2(v-if="model.column_count === 2")
      div.icon(v-for!="(item,index) in productList", v-lazy:background-image="item.cover || item.images[0]")
    div.column3(v-if="model.column_count === 3")
      template(v-for!="(item,index) in productList")
        div.icon(v-if="item.id" v-lazy:background-image="item.cover || item.images[0]")
        div.empty-icon(v-else)

</template>

<script>
  export default {
    props: {
      model: {}
    },
    computed: {
      productList () {
        if (this.model.column_count === 1) {
          return this.model.product_list.slice(0, 2)
        } else if (this.model.column_count === 2) {
          return this.model.product_list.slice(0, 4)
        } else if (this.model.column_count === 3) {
          let result = this.model.product_list.slice(0, 9)
          if (result.length % 3 === 2) {
            result.push({})
          }
          return result
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .icon-root {
    width: 70px;
    height: 70px;
    padding: 2px;
    box-sizing: border-box;
  }

  .column1 {
    .icon {
      margin-bottom: 2px;
      width: 30px;
      height: 30px;
      background-size: cover;
    }
  }

  .column2 {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .icon {
      margin-bottom: 2px;
      width: 30px;
      height: 30px;
      background-size: cover;
    }
  }

  .column3 {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .icon {
      margin-bottom: 2px;
      width: 20px;
      height: 20px;
      background-size: cover;
    }
    .empty-icon {
      width: 20px;
      height: 20px;
    }
  }
</style>
