<template>
  <el-dialog title="物流信息" :visible.sync="dialogVisible" width="50%" @open="openCallback" @close="closeCallback"
             loading="loading">
    <div class="content-wrapper">
      <div v-show="!loading" class="content">

        <item :express="expressData"></item>

      </div>
    </div>
  </el-dialog>

</template>

<script>
  import OrderApi from 'src/api/order'
  import Item from './Item.vue'

  export default {
    components: {
      Item
    },
    data() {
      return {
        oiid: 0,
        loading: false,
        dialogVisible: false,
        expressData: {}
      }
    },
    computed: {},
    methods: {
      show(oiid) {
        this.oiid = oiid
        this.dialogVisible = true
      },
      hide() {
        this.dialogVisible = false
      },
      async openCallback() {
        this.loading = true
        try {
          this.expressData = {}
          const res = await OrderApi.getOiExpress(this.oiid)
          this.expressData = res.data.data
          this.loading = false
        } catch (e) {
          this.loading = false
          this.$myErrorHandler.handle(this, e)
        }
      },
      closeCallback() {
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
    min-height: 200px;
  }



</style>
