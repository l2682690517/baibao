<template>
  <el-dialog title="查看图片" :visible.sync="dialogVisible" width="50%" @open="openCallback">
    <div ref="divWrapper">
      <img v-show="img" class="full-width" :src="img" :style="imgStyle"/>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        dialogVisible: false,
        img: '',
        divWidth: -1
      }
    },
    computed: {
      imgStyle() {
        if (this.divWidth !== -1) {
          return {
            'max-height': `${(document.documentElement.clientHeight || document.body.clientHeight) - 150}px`,
            'max-width': `${this.divWidth}px`
          }
        } else {
          return {
            'max-height': `${(document.documentElement.clientHeight || document.body.clientHeight) - 150}px`
          }
        }
      }
    },
    methods: {
      show(imgUrl) {
        this.img = imgUrl
        this.dialogVisible = true
      },
      hide() {
        this.dialogVisible = false
      },
      openCallback() {
        this.$nextTick(() => {
          this.divWidth = this.$refs.divWrapper.clientWidth
        })
      }
    }
  }
</script>

<style lang="less" scoped>

  .full-width {
    display: block;
    margin: 0 auto;
  }

</style>
