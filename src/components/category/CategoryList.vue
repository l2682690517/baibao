<template>
  <div v-loading="loading">
    <el-breadcrumb >
      <el-breadcrumb-item>分类</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="tool-bar">
      <el-form class="create" :inline="true">
        <el-form-item>
          <el-input v-model="createText" :maxlength="4" placeholder="输入新分类"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="_createCategory()">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <draggable v-model="categories" :options='{handle: ".handler"}' @sort="_onSort(0, categories)" @start="_onStart()">
        <div class="category-item " v-for="(item, index) in categories" :key="item.id">
          <div class="collapse-icon"  @click="collapse(item)"><i   :class="(item.categorys||[]).length === 0 ? '' : (!item.collapse ? 'el-icon-arrow-down' : 'el-icon-arrow-up')"></i></div>
          <div class="handler">&#9776;</div>
          <div class="category-name-wrapper">
            <editable-label :limitLength="4" :text="item.name" @submit="_updateCategory(item, arguments[0])"/>
          </div>
          <div class="goods-count">
              <span class="goods-count" :class="{clickable: getProdTotal(item) !== 0}" @click="_goProductDetail(item)">{{getProdTotal(item)}}款商品</span>
          </div>
          <div class="btn-delcate">
            <el-button   v-if="item.pc === 0  && (item.categorys||[]).length === 0" class="delete-category" size="small" type="danger" icon="el-icon-delete"
                       @click="_deleteCategory(index, item, categories)"></el-button>
            <span v-else="">&nbsp;</span>
          </div>

          <div class="add-subcategory">
              <el-input v-model="item.createText" style="width: 100px;" :maxlength="5" placeholder="输入子分类"></el-input>
              <el-button type="primary" icon="el-icon-plus" @click="_createCategory(item)">添加</el-button>
            </div>
           <div v-show="item.collapse" class="subcategory">
             <draggable v-model="item.categorys" :options='{handle: ".handler"}' @sort="_onSort(item.id, item.categorys)">
              <div v-for="(subcate, index) in (item.categorys || [])" :key=""subcate.id>
                <div class="handler">&#9776;</div>
                <div class="category-name-wrapper">
                  <editable-label :limitLength="5" :text="subcate.name" @submit="_updateCategory(subcate, arguments[0])"/>
                </div>
                <div class="img-warp">
                  <div class="img-cover" v-if="subcate.cover" v-lazy:background-image="subcate.cover" @click="showUploadCoverDialog(subcate)"></div>
                  <el-button :plain="true" v-if="!subcate.cover"  size="small"  @click="showUploadCoverDialog(subcate)">上传图片</el-button>

                </div>
                <div class="goods-count" :class="{clickable: subcate.pc !== 0}"
                      @click="_goProductDetail(subcate)">{{subcate.pc}}款商品</div>
                <div style="width: 20px;display: inline-block">
               <el-button v-if="subcate.pc === 0" class="delete-category" size="small" type="danger" icon="el-icon-delete"
                       @click="_deleteCategory(index, subcate, item.categorys)"></el-button>
               </div>
              </div>
             </draggable>
           </div>
        </div>
      </draggable>

    </div>
    <upload-image-dialog ref="dlgUploadCover" :max="1" tip="建议尺寸为128*128"
                         @uploadCompleted="uploadCoverCompleted"></upload-image-dialog>
  </div>
</template>

<script>
  import Draggable from 'vuedraggable'
  import CategoryApi from '../../api/category'
  import EditableLabel from '../../common/widgets/EditableLabel'
  import UploadImageDialog from 'src/common/widgets/UploadImageDialog.vue'

  /* eslint-disable */
  const MODE_COMMON = 0
  /* eslint-disable */
  const MODE_EDIT = 1

  export default{
    components: {
      Draggable,
      EditableLabel,
      UploadImageDialog
    },
    data() {
      return {
        loading: false,
        createText: '',
        cate: {},
        categories: []
      }
    },
    methods: {
      _refreshFormData() {
        this.loading = true
        CategoryApi.getAllCategoryList()
          .then((res) => {
            let dbcategories = []
            Object.assign(dbcategories, res.data.data)
            dbcategories.forEach((item) => {
              item.collapse = false
            })
            this.categories = dbcategories
            this.loading = false
          })
          .catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err, '查询失败')
          })
      },
      _createCategory(item) {
        let createText = this.createText
        let cateId = 0
        if (item) {
          cateId = item.id
          createText = item.createText
        }
        if (!createText) {
          this.$message({
            type: 'error',
            message: '请输入名称',
            showClose: true
          })
          return
        }
        this.loading = true
        CategoryApi.createCategory(cateId, createText)
          .then((res) => {
            this.loading = false
            this.$message({
              type: 'success',
              message: '操作成功',
              showClose: true
            })

            if (item) {
              item.createText = ''
            }
            this.createText = ''

            let newcate = res.data
            if (!newcate.categorys) {
              newcate.categorys = []
            }
            if (newcate.cateId === 0) {
              newcate.collapse = false
              this.categories.push(newcate)
              return
            }
            item.collapse = true
            item.categorys.push(newcate)

          })
          .catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err, '创建分类失败')
          })
      },
      _updateCategory(category, ele) {
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
        CategoryApi.editCategory(category.id, text)
          .then((res) => {
            this.loading = false
            this.$message({
              type: 'success',
              message: '操作成功',
              showClose: true
            })
            ele.editSuccess()
            category.name = text
          })
          .catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err, '修改分类失败')
          })
      },
      _updateCategoryCover(category, cover) {
        if (!cover) {
          this.$message({
            type: 'error',
            message: '请选择图片',
            showClose: true
          })
          return
        }
        this.loading = true
        CategoryApi.editCategoryCover(category.id, cover)
          .then((res) => {
            this.loading = false
            this.$message({
              type: 'success',
              message: '操作成功',
              showClose: true
            })
            category.cover = cover
          })
          .catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err, '修改分类失败')
          })
      },
      _deleteCategory(index, category, categorys) {
        if (category.trashPc > 0) {
          this.$alert('回收站中有此类商品，请处理','提示',{
            callback: action => {}
          })
          return
        }

        this.$confirm(`删除 '${category.name}' ?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          CategoryApi.deleteCategory(category.id)
            .then((res) => {
              this.loading = false
              this.$message({
                type: 'success',
                message: '操作成功',
                showClose: true
              })
              categorys.splice(index, 1)
            })
            .catch((err) => {
              this.loading = false
              this.$myErrorHandler.handle(this, err, '删除分类失败')
            })
        }).catch(() => {})
      },
      _onSort(cateId, categories) {
        let ids = []
        for (let i = 0; i < categories.length; i++) {
          ids.push(categories[i].id)
        }
        this.loading = true
        CategoryApi.sortCategory(cateId, ids)
          .then((res) => {
            this.loading = false
          })
          .catch((err) => {
            this.loading = false
            this.$myErrorHandler.handle(this, err, '排序失败')
          })
      },
      _goProductDetail(cate) {
        let pc = this.getProdTotal(cate)
        if (pc === 0) {
          return
        }

        let cates = []
        if (cate.cateId !==0) {
          cates.push(cate.cateId)
        }
        cates.push(cate.id)
        this.$router.push({
          name: 'product',
          query: {cates: cates.join('_')}
        })
      },
      collapse(item) {
        item.collapse = !item.collapse
      },
      showUploadCoverDialog(cate) {
        this.cate = cate
        this.$refs.dlgUploadCover.show()
      },
      uploadCoverCompleted(images) {
        if (images.length !== 1) {
          this.$message({
            message: '请选择图片',
            type: 'error',
            showClose: true
          })
          return
        }
        images.forEach((item) => {
          this._updateCategoryCover(this.cate, item.ossUrl)
        })
      },
      _onStart() {
        this.categories.forEach((item) => {
          item.collapse = false
        })
      },
      getProdTotal (item) {
        let top = item.pc
        for (var subitem of (item.categorys ||[])){
          top = top + subitem.pc
        }
        return top
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
  .tool-bar {
    .create {
      height: 50px
    }
  }

  .category-item {
    height: auto;
    min-height: 45px;
    line-height: 45px;
    padding-left: 20px;
    overflow: hidden;
    border-left: 1px solid #dfe6ec;
    border-right: 1px solid #dfe6ec;
    border-bottom: 1px solid #dfe6ec;
    width: 900px;


    &:first-child {
      border-top: 1px solid #dfe6ec;
    }

    .category-name-wrapper {
      display: inline-block;
      width: 200px;
    }

    .handler {
      display: inline-block;
      color: #20a0ff;
      width: 20px;
      font-size: 20px;
      cursor: move;
    }

    .goods-count {
      display: inline-block;
      color: #666;
      font-size: 14px;
      margin-right: 10px;
      width: 70px;
      min-width: 90px;
      cursor: pointer;

      &.clickable {
        color: #f00;
        cursor: hand;
      }

    }
    .good-del {
      display: inline-block;
      width: 50px;
      display: inline-block;
      font-size: 14px;
      color:#666
    }

    .delete-category {
      display: inline-block;
      width: 20px;
      height: 20px;
      padding: 0;
    }
    .collapse-icon {
      width: 20px;
      display: inline-block;
      padding: 0px 10px 0px 0px;
    }
    .add-subcategory {
      display: inline;
      margin-left: 10px;
    }
    .subcategory {
      display: inline-block;
      margin: 0px 0px 0px 60px;
    }
    .btn-delcate {
      display: inline-block;
      width: 30px;
    }
    .img-warp {
      display: inline-block;
      height: 25px;
    }
    .img-cover {
      width: 35px;
      height: 35px;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: no-repeat center / 35px 35px;
    }
  }
</style>
