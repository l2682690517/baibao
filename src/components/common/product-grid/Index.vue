<template lang="pug">
  div.grid-root
    div(v-if!="columnCount === 1")
      column1-item(v-for!="item in dataList", :model="item", :key="item.id")
    div.column-content(v-if!="columnCount === 2")
      column2-item(v-for!="item in dataList", :model="item", :key="item.id")
    div.column-content(v-if!="columnCount === 3")
      template(v-for!="item in padDataList")
        column3-item(v-if="item.id", :model="item")
        div.empty-column3(v-else)
</template>

<script>
  import Column1Item from './Column1Item.vue'
  import Column2Item from './Column2Item.vue'
  import Column3Item from './Column3Item.vue'

  export default {
    components: {
      Column1Item,
      Column2Item,
      Column3Item
    },
    props: {
      dataList: {
        type: Array,
        default () {
          return []
        }
      },
      columnCount: {
        type: Number,
        default: 1
      }
    },
    computed: {
      padDataList () {
        if (this.columnCount !== 3) {
          return this.dataList
        }
        if (this.dataList.length % 3 === 2) {
          let result = this.dataList.slice()
          result.push({})
          return result
        }
        return this.dataList
      }
    }
  }
</script>

<style lang="scss" scoped>

  .grid-root {
    padding: 1px;
    margin: 5px 8px;
  }

  .column-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .empty-column3 {
    width: 78px;
  }


</style>
