<template>
  <div>
    <el-dialog title="选择内容类型和位置" :visible.sync="dialogVisible" size="small" @open="openCallback" @close="closeCallback">
      <div class="group-wrapper">
        <div class="group-name">类型</div>
        <div>
          <el-radio-group v-model="type">
            <el-radio v-for="item in typeList" :label="item.value" :key="item.value">{{item.name}}</el-radio>
          </el-radio-group>
        </div>
        <div class="group-text" v-if="type === 'text'">
          <resource-text  v-model="text.content"></resource-text>
        </div>
        <div class="group-text" v-if="type === 'video'">
          <resource-video  v-model="video"></resource-video>
        </div>
      </div>
      <div class="group-wrapper" v-show="showPosition">
        <div class="group-name">位置</div>
        <div>
          <el-radio-group v-model="position">
            <el-radio v-for="item in positionList" :label="item.value" :key="item.value">{{item.name}}</el-radio>
          </el-radio-group>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import ResourceText from './ResourceText'
  import ResourceVideo from './ResourceVideo'

  const POS_TOP = 'top'
  const POS_BOTTOM = 'bottom'
  const POS_ABOVE = 'above'
  const POS_BELOW = 'below'

  const TYPE_TEXT = 'text'
  const TYPE_IMAGE = 'image'
  const TYPE_VIDEO = 'video'

  export default {
    POS_TOP,
    POS_BOTTOM,
    POS_ABOVE,
    POS_BELOW,
    TYPE_TEXT,
    TYPE_IMAGE,
    TYPE_VIDEO,
    components: {
      ResourceText,
      ResourceVideo
    },
    props: {
      showVideo: {
        type: Boolean,
        default() {
          return false
        }
      }
    },
    data() {
      return {
        dialogVisible: false,
        positionList: [
          {
            name: '顶部',
            value: POS_TOP
          }, {
            name: '底部',
            value: POS_BOTTOM
          }
        ],
        rawtypeList: [
          {
            name: '图片',
            value: TYPE_IMAGE
          },
          {
            name: '视频',
            value: TYPE_VIDEO
          },
          {
            name: '文字',
            value: TYPE_TEXT
          }],
        position: POS_TOP,
        type: TYPE_IMAGE,
        index: -1,
        text: {
          content: ''
        },
        video: {
          title: '',
          content: ''
        }
      }
    },
    computed: {
      showPosition() {
        return this.position === POS_TOP || this.position === POS_BOTTOM
      },
      typeList() {
        if (this.showVideo) {
          return this.rawtypeList
        }
        return this.rawtypeList.filter((item) => {
          return item.value !== TYPE_VIDEO
        })
      }
    },
    methods: {
      show(pos) {
        console.log('pos', pos, this.position)
        if (!pos) {
          if (this.position === POS_ABOVE || this.position === POS_BELOW) {
            this.position = POS_BOTTOM
          }
        } else {
          this.position = pos
        }
        this._reSet()
        this.dialogVisible = true
      },
      hide() {
        this.dialogVisible = false
      },
      openCallback() {
      },
      closeCallback() {
      },
      submit() {
        this.$emit('submit', {
          position: this.position,
          type: this.type,
          video: this.video,
          text: this.text
        })
        this.hide()
      },
      uploadImageCompleted(imgs) {
        this.$emit('uploadImages', imgs)
      },
      _reSet() {
        this.text.content = ''
        this.video.title = ''
        this.video.content = ''
      }
    }
  }
</script>

<style lang="less" scoped>

  .group-wrapper {

    margin-bottom: 22px;

    .group-name {
      font-size: 16px;
      color: #20a0ff;
      margin-bottom: 8px;
    }
    .group-text {
      display: flex;
      margin-top: 8px;
    }
  }

</style>
