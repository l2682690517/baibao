<template>
  <el-dialog title="物流信息" :visible.sync="dialogVisible" width="50%" @open="openCallback" @close="closeCallback"
             loading="loading">
    <div class="content-wrapper">
      <div v-show="!loading" class="content">

        <el-collapse accordion v-model="activeName">
          <el-collapse-item v-for="(item, index) in expressDataList" :title="collapseTitle(index)"
                            :name="expressUnique(item)" :key="expressUnique(item)">
            <div class="product-wrapper">
              <div class="traffic-product-wrapper" v-for="product in item.oi_list">
                <product-cell :orderItem="product"></product-cell>
              </div>
            </div>

            <item :express="item"></item>

          </el-collapse-item>
        </el-collapse>

      </div>
    </div>
  </el-dialog>

</template>

<script>
  import OrderApi from 'src/api/order'
  import Item from './Item.vue'
  import ProductCell from './ProductCell.vue'

  export default {
    components: {
      Item,
      ProductCell
    },
    data() {
      return {
        oid: 0,
        loading: false,
        dialogVisible: false,
        expressDataList: [],
        activeName: ''
      }
    },
    computed: {},
    methods: {
      show(oid, devName, devNo) {
        this.oid = oid
        if (!devName || !devNo) {
          this.activeName = ''
        } else {
          this.activeName = `${devNo}_${devName}`
        }
        this.dialogVisible = true
      },
      hide() {
        this.dialogVisible = false
      },
      async openCallback() {
        this.loading = true
        try {
          this.expressDataList = []
          const res = await OrderApi.getExpress(this.oid)
          this.expressDataList = res.data.data
          if (this.expressDataList.length > 0 && !this.activeName) {
            this.activeName = this.expressUnique(this.expressDataList[0])
          }
          this.loading = false
        } catch (e) {
          this.loading = false
          this.$myErrorHandler.handle(this, e)
        }
      },
      closeCallback() {
      },
      collapseTitle(index) {
        return '包裹' + (index + 1)
      },
      expressUnique(item) {
        return `${item.num}_${item.name}`
      }
    }
  }
</script>

<style lang="less" scoped>

  /*.content {*/
  /*max-height: 500px;*/
  /*overflow-y: auto;*/
  /*}*/

  .content-wrapper {
    min-height: 300px;
  }

  .item-content {

    .item {
      margin-top: 5px;
    }

    .traffic-detail {
      display: flex;

      .left {
        padding-left: 5px;
        padding-bottom: 5px;

      }

      .right-title {
        padding-right: 20px;
      }

    }
  }

  .product-wrapper {
    box-sizing: border-box;
    margin: 0 5px 5px 5px;
    padding-top: 5px;
    background-color: #ffffff;
    border-bottom: solid 1px #f1f1f1;

    .traffic-product-wrapper {
      display: inline-flex;
      width: 45%;
    }
  }


</style>
