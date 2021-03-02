<template>
  <div>
    <div v-loading="loading">
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="_createTagGroup">添加标签组</el-button>
      </div>
      <div class="group-tag-wrapper" v-for="groupItem in formData" :key="groupItem.id">
        <div class="clearfix group-tag-bar">
          <el-form class="group-name-wrapper" :inline="true">
            <el-form-item>
              <span class="group-name">{{groupItem.name}}</span>
              <el-button size="small" type="primary" icon="el-icon-edit" @click="_editTagGroup(groupItem)"></el-button>
              <el-button v-if="!groupItem.tags || groupItem.tags.length === 0" size="small" type="danger" icon="el-icon-delete"
                         @click="_deleteTagGroup(groupItem)">
              </el-button>
            </el-form-item>
          </el-form>
          <el-form class="create-tag-wrapper" :inline="true">
            <el-form-item>
              <el-input style="width: 120px" size="small" :value="groupItem.createText" :maxlength="16"
                        @input="_inputCreateText(groupItem, arguments[0])" placeholder="输入新标签"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" icon="el-icon-plus" @click="_createTag(groupItem)">添加</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="groupItem.tags">
          <div class="tag-item " v-for="tagItem in groupItem.tags" :key="tagItem.id">
          <span class="tag-name-wrapper">
            <editable-label :text="tagItem.name" :limitLength="16" @submit="_updateTag(groupItem.id, tagItem, arguments[0])"/>
          </span>
            <span class="tag-count" :class="{clickable: tagItem.pc !== 0}" @click="_goProductDetail(tagItem)">{{tagItem.pc}}款商品</span>
            <span v-if="tagItem.pc === 0">
            <el-button class="delete-tag" size="small" type="danger" icon="el-icon-delete"
                       @click="_deleteTag(groupItem,tagItem)"
            ></el-button>
          </span>
          </div>
        </div>
      </div>
    </div>
    <edit-tag-group-dialog
      ref="dlgEditTagGroup"
      :mode="dialogMode"
      :editTagGroup="currentEditTagGroup"
      @created="_createdSuccess">
    </edit-tag-group-dialog>
  </div>
</template>

<script>
  import TagApi from '../../api/tag'
  import EditableLabel from '../../common/widgets/EditableLabel'
  import EditTagGroupDialog from './EditTagGroupDialog'
  import * as types from '../../store/types'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      EditableLabel,
      EditTagGroupDialog
    },
    data() {
      return {
        loading: false,
        dialogMode: EditTagGroupDialog.MODE_EDIT,
        currentEditTagGroup: {}
      }
    },
    computed: {
      ...mapGetters({formData: 'allTagGroup'})
    },
    methods: {
      _refreshFormData() {
        this.loading = true
        TagApi.getTagGroupList()
          .then((res) => {
            this.loading = false
          })
          .catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err, '查询失败')
          })
      },
      _createTagGroup() {
        this.dialogMode = EditTagGroupDialog.MODE_CREATE
        this.$refs.dlgEditTagGroup.show()
      },
      _editTagGroup(tagGroup) {
        this.currentEditTagGroup = tagGroup
        this.dialogMode = EditTagGroupDialog.MODE_EDIT
        this.$refs.dlgEditTagGroup.show()
      },
      _deleteTagGroup(tagGroup) {
        this.$confirm('确定要删除吗？', '提示', ({
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })).then(() => {
          this.loading = true
          TagApi.deleteTagGroup(tagGroup.id)
            .then(() => {
              this.loading = true
              this.$message({
                message: '操作成功',
                type: 'info',
                showClose: true
              })
              this.loading = false
            })
            .catch((err) => {
              this.loading = false
              this.$myErrorHandler.handle(this, err)
            })
        }).catch(() => {})
      },
      _createdSuccess(newData) {
      },
      _inputCreateText(tagGroup, createText) {
        this.$store.commit(types.UPDATE_TAG_GROUP_CREATE_TEXT, {tagGroup, createText})
      },
      _createTag(tagGroup) {
        if (!tagGroup.createText) {
          this.$message({
            message: '请输入标签名称',
            type: 'error',
            showClose: true
          })
          return
        }
        this.loading = true
        TagApi.createTag(tagGroup, tagGroup.createText)
          .then((res) => {
            this.$message({
              message: '创建成功',
              type: 'info',
              showClose: true
            })
            tagGroup.createText = ''
            this.loading = false
          })
          .catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err, '创建标签失败')
          })
      },
      _updateTag(gid, tag, ele) {
        let text = ele.inputText
        if (!text) {
          this.$message({
            type: 'error',
            message: '请输入名称',
            showClose: true
          })
          return
        }
        this.loading = true
        TagApi.updateTag(gid, tag, text)
          .then((res) => {
            this.loading = false
            this.$message({
              type: 'success',
              message: '操作成功',
              showClose: true
            })
            ele.editSuccess()
          })
          .catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err, '修改标签失败')
          })
      },
      _deleteTag(group, tag) {
        this.$confirm('删除标签?', '提示', ({
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })).then(() => {
          this.loading = true
          TagApi.deleteTag(group, tag.id).then((res) => {
            this.loading = false
            this.$message({
              message: '操作成功',
              type: 'success',
              showClose: true
            })
          }).catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err, '删除失败')
          })
        }).catch(() => {
        })
      },
      _goProductDetail(tag) {
        if(tag.pc === 0) {
          return
        }
        this.$router.push({
          name: 'product',
          query: {tags: String(tag.id)}
        })
      }
    },
    created() {
    },
    activated() {
      this._refreshFormData()
    }
  }

</script>

<style scoped lang="less">

  .group-tag-wrapper {

    margin-top: 50px;

    .group-tag-bar {
      width: 522px;
      height: 40px;

      .group-name-wrapper {
        float: left;
        height: 40px;

        .group-name {
          margin-right: 10px;
        }
      }

      .create-tag-wrapper {
        float: right;
        height: 40px
      }
    }

    .tag-item {
      height: 45px;
      line-height: 45px;
      overflow: hidden;
      border-left: 1px solid #dfe6ec;
      border-right: 1px solid #dfe6ec;
      border-bottom: 1px solid #dfe6ec;
      width: 500px;

      &:first-child {
        border-top: 1px solid #dfe6ec;
      }

      .tag-name-wrapper {
        display: inline-block;
      }

      .tag-count {
        color: #666;
        font-size: 14px;
        margin-right: 10px;
        cursor: pointer;

        &.clickable{
          color: #f00;
          cursor: hand;
        }
      }

      .delete-tag {
        width: 20px;
        height: 20px;
        padding: 0;
      }
    }

  }


</style>
