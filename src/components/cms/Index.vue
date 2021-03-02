<template>
  <div>
    <div>
      <draggable v-model="content.data" :options='{handle: ".handler"}' class="drag-wrapper">
        <div class="item" v-for="(item, index) in content.data">
          <div><span class="handler">&#9776;</span></div>
          <div class="content">
            <component :is="getResourceComp(item)" :resource="item"></component>
          </div>
          <div class="action-wrapper">
            <el-button-group>
              <el-button type="primary" size="small" @click="addContentModule(index, 'above')" icon="el-icon-plus">上面
              </el-button>
              <el-button type="primary" size="small" @click="addContentModule(index, 'below')" icon="el-icon-plus">下面
              </el-button>
              <el-button type="primary" size="small" @click="removeContentModule(index)" icon="el-icon-delete">删除</el-button>
            </el-button-group>


            <!--<el-button type="primary" size="mini" @click="addContentModule(index, 'above')">在上面添加</el-button>-->
            <!--<el-button type="primary" size="mini" @click="addContentModule(index, 'below')">在下面添加</el-button>-->
            <!--<el-button type="danger" size="mini" @click="removeContentModule(index)">删除</el-button>-->
            <!--<div>-->
            <!--<el-button type="primary" size="small" @click="addContentModule(index, 'above')">在上面添加</el-button>-->
            <!--</div>-->
            <!--<div>-->
            <!--<el-button type="primary" size="small" @click="addContentModule(index, 'below')">在下面添加</el-button>-->
            <!--</div>-->
            <!--<div>-->
            <!--<el-button type="danger" size="small" @click="removeContentModule(index)">删除</el-button>-->
            <!--</div>-->
          </div>
        </div>
      </draggable>
    </div>
    <div>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addContentModule(-1, null)">添加内容</el-button>
      <el-button type="primary" size="small" icon="el-icon-view" @click="preview">&nbsp;预&nbsp;&nbsp;&nbsp;&nbsp;览&nbsp;
      </el-button>
    </div>
    <choose-type-dialog ref="dlgChooseType" :showVideo="showVideo" @submit="chooseTypeCompleted"></choose-type-dialog>
    <upload-image-dialog ref="dlgUploadImage" tip="建议宽度750"
                         @uploadCompleted="uploadImageCompleted"></upload-image-dialog>
    <preview-dialog ref="dlgPreview" :resources="content.data"></preview-dialog>
  </div>
</template>

<script>
  import * as CmsUtil from 'src/utils/cmsUtil'
  import ImageItem from './ImageItem'
  import TextItem from './TextItem'
  import VideoItem from './VideoItem'
  import ChooseTypeDialog from './ChooseTypeDialog'
  import UploadImageDialog from 'src/common/widgets/UploadImageDialog'
  import Draggable from 'vuedraggable'
  import PreviewDialog from './preview/PreviewDialog'

  export default {
    components: {
      ImageItem,
      TextItem,
      VideoItem,
      ChooseTypeDialog,
      UploadImageDialog,
      Draggable,
      PreviewDialog
    },
    props: {
      content: {
        type: Object,
        default() {
          return {
            data: []
          }
        }
      },
      showVideo: {
        type: Boolean,
        default() {
          return false
        }
      }
    },
    data() {
      return {
        chooseType: '',
        choosePos: '',
        currentIndex: -1
      }
    },
    methods: {
      getResourceComp(resource) {
        switch (resource.type) {
          case CmsUtil.TYPE_RESOURCE_IMAGE:
            return 'ImageItem'
          case CmsUtil.TYPE_RESOURCE_TEXT:
            return 'TextItem'
          case CmsUtil.TYPE_RESOURCE_VIDEO:
            return 'VideoItem'
        }
      },
      addContentModule(index, pos) {
        this.currentIndex = index
        this.$refs.dlgChooseType.show(pos)
      },
      removeContentModule(index) {
        this.$confirm('确定要删除吗？', '提示', ({
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })).then(() => {
          this.content.data.splice(index, 1)
        }).catch(() => {})
      },
      preview() {
        this.$refs.dlgPreview.show()
      },
      chooseTypeCompleted(result) {
        this.chooseType = result.position
        this.type = result.type
        setTimeout(() => {
          if (this.type === ChooseTypeDialog.TYPE_IMAGE) {
            this.$refs.dlgUploadImage.show()
          } else if (this.type === ChooseTypeDialog.TYPE_TEXT) {
            let text = result.text
            this.editTextCompleted(text.content)
          } else if (this.type === ChooseTypeDialog.TYPE_VIDEO) {
            this.addVideoCompleted(result.video)
          }
        }, 300)
      },
      addResourceList(resourceList) {
        switch (this.chooseType) {
          case ChooseTypeDialog.POS_BOTTOM:
            this.content.data.push(...resourceList)
            break
          case ChooseTypeDialog.POS_TOP:
            this.content.data.unshift(...resourceList)
            break
          case ChooseTypeDialog.POS_ABOVE:
            if (this.currentIndex === -1) {
              this.content.data.push(...resourceList)
            } else {
              this.content.data.splice(this.currentIndex, 0, ...resourceList)
            }
            break
          case ChooseTypeDialog.POS_BELOW:
            if (this.currentIndex === -1) {
              this.content.data.push(...resourceList)
            } else {
              this.content.data.splice(this.currentIndex + 1, 0, ...resourceList)
            }
        }
      },
      uploadImageCompleted(imgs) {
        const resourceList = imgs.map((item) => {
          return CmsUtil.generateImageResource(item.ossUrl, item.size.width, item.size.height)
        })
        this.addResourceList(resourceList)
      },
      editTextCompleted(text) {
        const resourceText = CmsUtil.generateTextResource(text)
        this.addResourceList([resourceText])
      },
      addVideoCompleted(video) {
        const resourceText = CmsUtil.generateVideoResource(video)
        this.addResourceList([resourceText])
      }
    }
  }
</script>

<style lang="less" scoped>

  .item {
    display: flex;
    align-items: center;
    border: 1px solid #c0ccda;
    border-radius: 5px;
    margin-bottom: 5px;
    margin-top: 5px;
    padding: 5px;
    box-sizing: border-box;
    height: 90px;
    width: 570px;
  }

  .handler {
    display: inline-block;
    color: #20a0ff;
    width: 20px;
    font-size: 20px;
    cursor: move;
    padding-left: 10px;
    padding-right: 10px;
  }

  .action-wrapper {
    flex: 1;
    text-align: right;
  }

</style>
