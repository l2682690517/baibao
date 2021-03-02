<template>
  <el-dialog title="选择标签" size="small" :visible.sync="dialogVisible" v-loading="loading">
    <el-checkbox-group v-model="chooseTags">
      <div class="group-wrapper" v-for="group in allTagGroup" :key="group.id"
           v-show="group.tags && group.tags.length > 0">
        <div class="group-name">{{group.name}}</div>
        <div>
          <el-checkbox v-for="tag in group.tags" :label="tag" :key="tag.id" @click.native="changeIndeterminate(tag)"
                       :indeterminate="tag.indeterminate">{{tag.name}}
          </el-checkbox>
        </div>
        <div class="create-tag-wrapper">
          <el-input style="width: 120px" size="small" :value="group.createText"
                    @input="_inputCreateText(group, arguments[0])" placeholder="输入新标签"></el-input>
          <el-button class="create-tag" size="small" type="primary" icon="plus" @click="_createTag(group)">添加
          </el-button>
        </div>
      </div>
    </el-checkbox-group>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="_submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { mapGetters } from 'vuex'
  import * as types from '../../store/types'
  import TagApi from '../../api/tag'

  export default {
    props: {
      origin: {
        type: Array,
        default () {
          return []
        }
      },
      denyEmpty: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        loading: false,
        dialogVisible: false,
        chooseTags: [],
        allTagGroup: [],
        originIndeterminateTags: [],
        originAddTags: []
      }
    },
    computed: {
      ...mapGetters({
        vuexallTagGroup: 'allTagGroup'
      })
    },
    watch: {
      dialogVisible: function (newVal, oldVal) {
        this.vuexallTagGroup.forEach((item) => {
          this.$store.commit(types.UPDATE_TAG_GROUP_CREATE_TEXT, {'tagGroup': item, 'createText': ''})
        })
        Object.assign(this.allTagGroup, this.vuexallTagGroup)
        if (newVal) {
          this.originIndeterminateTags = []
          this.originAddTags = []
          let originLength = this.origin.length
          let tagobjs = this._initIndeterminate()
          let choose = []
          this.allTagGroup.forEach((group) => {
            if (group.tags && group.tags instanceof Array) {
              group.tags.forEach((tag) => {
                tag.indeterminate = false // 默认非半选
                let tagobj = tagobjs.find((item) => {
                  return item.id === tag.id
                })
                if (tagobj) {
                  tag.indeterminate = tagobj.total < originLength
                  // 保存原始的半选tag
                  if (tag.indeterminate) {
                    this.originIndeterminateTags.push(tag.id)
                  }
                  if (tagobj.total === originLength) {
                    choose.push(tag)
                    this.originAddTags.push(tag.id)
                  }
                }
              })
            }
          })
          this.chooseTags = choose
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
      _inputCreateText (tagGroup, createText) {
        this.$store.commit(types.UPDATE_TAG_GROUP_CREATE_TEXT, {tagGroup, createText})
      },
      _createTag (tagGroup) {
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
      _submitForm () {
        let addTags = this.chooseTags.map(item => {
          return item.id
        })
        let currentIndeterminateTags = this._findCurrentIndeterminateTags().map(item => {
          return item.id
        })
        let deleteTags = []
        this.originIndeterminateTags.forEach(item => {
          if (addTags.indexOf(item) === -1 && currentIndeterminateTags.indexOf(item) === -1) {
            deleteTags.push(item)
          }
        })
        this.originAddTags.forEach(item => {
          if (addTags.indexOf(item) === -1 && deleteTags.indexOf(item) === -1) {
            deleteTags.push(item)
          }
        })
        this.$emit('submit', {component: this, add_tags: addTags, del_tags: deleteTags})
      },
      _findCurrentIndeterminateTags () {
        let tags = []
        this.allTagGroup.forEach((group) => {
          if (group.tags && group.tags instanceof Array) {
            group.tags.forEach((tag) => {
              if (tag.indeterminate) {
                tags.push(tag)
              }
            })
          }
        })
        return tags
      },
      changeIndeterminate (tag) {
        tag.indeterminate = false
      },
      _initIndeterminate () {
        let tags = []
        this.origin.forEach((item) => {
          if (item.tags) {
            item.tags.forEach((tag) => {
              let tagobj = tags.find((obj) => {
                return obj.id === tag.id
              })
              if (!tagobj) {
                tags.push({id: tag.id, total: 1})
              } else {
                tagobj.total++
              }
            })
          }
        })
        return tags
      }
    }
  }
</script>

<style scoped lang="less">
  .group-wrapper {

    margin-bottom: 22px;

    .group-name {
      font-size: 16px;
      color: #20a0ff;
      margin-bottom: 8px;
    }

    .create-tag-wrapper {
      margin-top: 8px;

      .create-tag {
        margin-left: 5px;
      }

    }
  }

</style>
