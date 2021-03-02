<template>
  <div>
    <ul class="el-upload-list el-upload-list--picture-card" style="background-color: #fff">
      <draggable v-model="currentValue" class="drag-wrapper" :options="{draggable:'.icon'}" @sort="_onSort">
        <li class="el-upload-list__item is-success icon" v-for="(item, index) in currentValue"
            v-lazy:background-image="item.ossUrl">
                <span class="el-upload-list__item-actions image-action-wrapper">
                  <span class="image-action">
                    <div><i class="el-icon-view" @click="previewImage(item, index)"/></div>
                    <div><i class="el-icon-delete" @click="removeImage(item, index)"/></div>
                  </span>
                </span>
        </li>
        <li class="el-upload-list__item is-success add" v-if="maxUploadImages > 0">
          <div  class="el-upload el-upload--picture-card" @click="showUploadImageDialog">
            <i class="el-icon-plus"></i>
          </div>
        </li>
      </draggable>
    </ul>
    <div class="input-tip"> <span v-if="tip">{{tip}}，</span><span v-if="showMax">还可以上传{{maxUploadImages}}张，</span>建议尺寸750 X 750像素</div>
    <upload-image-dialog ref="dlgUploadImage" :max="maxUploadImages"
                         @uploadCompleted="uploadImageCompleted"></upload-image-dialog>
    <image-preview-dialog ref="dlgImagePreview"></image-preview-dialog>
  </div>

</template>

<script>
  import UploadImageDialog from 'src/common/widgets/UploadImageDialog.vue'
  import Draggable from 'vuedraggable'
  import ImagePreviewDialog from 'src/common/widgets/ImagePreviewDialog'

  export default {
    name: 'formImageItem',
    components: {
      UploadImageDialog,
      Draggable,
      ImagePreviewDialog
    },
    props: {
      value: {
        type: Array,
        default: function () { return [] }
      },
      max: {
        type: Number,
        default: 1
      },
      showMax: {
        type: Boolean,
        default: true
      },
      tip: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        currentValue: this.value
      }
    },
    computed: {
      maxUploadImages() {
        return this.max - this.currentValue.length
      }
    },
    methods: {
      showUploadImageDialog() {
        if (this.maxUploadImages <= 0) {
          this.$message({
            message: '最多可以上传' + this.max + '张',
            type: 'error',
            showClose: true
          })
          return
        }
        this.$refs.dlgUploadImage.show()
      },
      uploadImageCompleted(images) {
        images.forEach((item) => {
          this.currentValue.push(item)
        })
      },
      _onSort() {
        this.$emit('input', this.currentValue)
      },
      previewImage(item, index) {
        this.$refs.dlgImagePreview.show(item.ossUrl)
      },
      removeImage(item, index) {
        this.currentValue.splice(index, 1)
      }
    },
    watch: {
      value(v) {
        if (v !== this.currentValue) {
          this.currentValue = v
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .drag-wrapper {
    display: inline-block;
  }

  .image-action {
    position: absolute !important;
    bottom: 0;
    width: 100% !important;
    display: flex !important;
    justify-content: center !important;
    cursor: move !important;
    & > div {
      padding-left: 10px;
      padding-right: 10px;
      cursor: pointer;
    }
  }

  .image-action-wrapper {
    cursor: move;
  }

  .icon {
    background-size: cover;
    background-position: center;
    margin-bottom: 0px;
    cursor: move;
  }

  .add {
    background-size: cover;
    background-position: center;
    margin-bottom: 0px;
    border:0;
  }
</style>
