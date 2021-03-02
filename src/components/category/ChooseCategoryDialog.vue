<template>
  <el-dialog title="选择分类" size="small" :visible.sync="dialogVisible" v-loading="loading">
    <div class="group-wrapper">
      <el-select v-model="topCategory" clearable placeholder="请选择分类" @change="cateChange">
        <el-option
          v-for="item in allCategory"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div v-if="topCategory">
      <el-radio-group v-model="subCategory">
        <el-radio v-for="item in allsubCategory" :label="item.id" :key="item.id">{{item.name}}</el-radio>
      </el-radio-group>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="_submitForm" :disabled="!topCategory||(!subCategory && subCategory !== 0)">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    components: {},
    props: {
      origin: {
        type: Object,
        default() {
          return null
        }
      }
    },
    data() {
      return {
        loading: false,
        dialogVisible: false,
        chooseCategoryId: null,
        subCategory: null,
        createText: '',
        allsubCategory: [],
        topCategory: null
      }
    },
    computed: {
      ...mapGetters({
        allCategory: 'allCategory'
      })
    },
    methods: {
      show() {
        this.topCategory = null
        this.subCategory = null
        this.chooseCategoryId = null
        this.allsubCategory = []
        this.dialogVisible = true
      },
      hide() {
        this.dialogVisible = false
      },
      _submitForm() {
        if (!this.topCategory) {
          this.$message({
            message: '请选择分类',
            type: 'error',
            showClose: true
          })
          return
        }
        this.chooseCategoryId = (!this.subCategory || this.subCategory === 0 ? this.topCategory : this.subCategory)
        this.$emit('submit', this)
      },
      cateChange(val) {
        this.subCategory = null
        let sub = this.allCategory.find((item) => { return item.id === val })
        if (sub) {
          this.allsubCategory = sub.categorys || []
        } else {
          this.allsubCategory = []
        }
        if (this.allsubCategory.length === 0) {
          this.subCategory = 0
        }
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

    .create-category-wrapper {
      margin-top: 8px;

      .create-category {
        margin-left: 5px;
      }

    }
  }

</style>
