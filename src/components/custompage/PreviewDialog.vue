<template>
  <div>
    <el-dialog title="首页预览" width="50%" :visible.sync="dialogVisible">
      <div class="content">
        <div v-for="item in dataList" :key="item.id" v-if="showItem(item)">
          <div class="preview-image"><img :src="item.cover"></div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>

  export default {
    components: {},
    data () {
      return {
        dialogVisible: false
      }
    },
    props: {
      dataList: {
        type: Array,
        default () {
          return []
        }
      }
    },
    methods: {
      show () {
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      showItem (item) {
        if (this.showAll) {
          return true
        }
        if (item.show_tp === 0 || item.show_tp === 1) {
          return true
        }
        try {
          const startCt = new Date(item.show_start).getTime()
          const endCt = new Date(item.show_end).getTime()
          const nowCt = new Date().getTime()
          if (nowCt >= startCt && nowCt <= endCt) {
            return true
          } else {
            return false
          }
        } catch (ex) {
          console.log('ex', ex)
          return true
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .preview-image {
    img {
      width: 100%;
      display: block;
    }
  }
</style>
