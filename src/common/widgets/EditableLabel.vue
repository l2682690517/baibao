<template>

  <div class="label-root-wrapper">
    <span class="show-text-wrapper" v-if="mode === 0"><a class="single-line show-text" href="#"
                                                         @click.prevent="beginEdit">{{text}}</a></span>
    <span class="edit-wrapper" v-else>
      <div class="input-wrapper">
        <el-input class="input-text" :maxlength="limitLength" v-model="inputText" size="mini" :value="text"></el-input>
      </div>
      <div class="action-wrapper">
        <el-button class="btn-action" size="mini" type="primary" icon="el-icon-check" @click="_submitEdit"></el-button>
        <el-button class="btn-action" size="mini" icon="el-icon-close" @click="cancelEdit"></el-button>
      </div>
    </span>
  </div>

</template>

<script>

  const MODE_SHOW = 0
  /* eslint-disable */
  const MODE_EDIT = 1

  export default {
    props: {
      text: {
        type: String,
        default: ''
      },
      limitLength: {
        type: Number,
        default: -1
      }
    },
    data() {
      return {
        mode: MODE_SHOW,
        inputText: ''
      }
    },
    methods: {
      _submitEdit() {
        this.$emit('submit', this)
      },
      beginEdit() {
        this.mode = MODE_EDIT
        this.inputText = this.text
      },
      cancelEdit() {
        this.mode = MODE_SHOW
        this.inputText = this.text
      },
      editSuccess(){
        this.mode = MODE_SHOW
        //加入这个vue会有警告，待优化
        //this.text = this.inputText
      }
    }
  }

</script>

<style scoped lang="less">

  .label-root-wrapper {
    display: inline-block;
    width: 200px;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    padding-left: 10px;
    padding-right: 10px;

    .show-text-wrapper {

      display: inline-block;
      width: 100%;
      padding-left: 10px;
      padding-right: 10px;
      box-sizing: border-box;

      .show-text {
        display: inline-block;
        vertical-align: top;
        color: #20a0ff;
        width: 100%;
        border-bottom: 1px dashed #20a0ff;
        font-size: 14px;
      }
    }

    .edit-wrapper {
      display: flex;

      .input-wrapper {
        flex: 1;
      }

      .input-text {
        display: inline-block;
      }

      .btn-action {
        display: inline-block;
        width: 30px;
        height: 30px;
        margin-left: 10px;
        text-align: center;
        padding: 0
      }


    }


  }

</style>
