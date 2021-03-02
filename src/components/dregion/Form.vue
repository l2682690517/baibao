<template>
  <div>
    <el-form ref="form" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input
          class="name-input"
          placeholder="最多10个字"
          :maxlength="10"
          v-model="formData.name">
        </el-input>
      </el-form-item>
      <el-form-item label="选择地区" prop="include" :required="true">
        <div>
          <el-radio class="radio" v-model="formData.include" :label="false">
            无法配送
          </el-radio>
          <el-radio class="radio" v-model="formData.include" :label="true">
            可配送
          </el-radio>
        </div>
        <div class="province">
          <el-table ref="tabProvince" :data="allProvince" :height="200" :show-header="false"
                    @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="63">
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                {{scope.row}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="$router.back()">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import * as AddressUtil from 'src/utils/addressUtil'
  import * as DRegionApi from 'src/api/dregion'
  import { MODE_DEFAULT, MODE_EDIT } from 'src/constants/common'

  export default {
    props: {
      mode: {
        type: Number,
        default: MODE_DEFAULT
      }
    },

    data () {
      const validateInclude = (rule, value, callback) => {
        if (this.formData.province.length === this.allProvince.length) {
          callback(new Error('不能选择全部的地区'))
          return
        }
        if (this.formData.province.length === 0) {
          callback(new Error('请选择地区'))
          return
        }
        callback()
      }

      return {
        loading: false,
        formData: {
          name: '',
          include: false,
          province: []
        },
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {max: 10, message: '最大10个字符', trigger: 'blur'}
          ],
          include: [
            {validator: validateInclude, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      allProvince () {
        return AddressUtil.allProvince
      }
    },
    methods: {
      handleSelectionChange (val) {
        this.formData.province = val
      },
      async getEditItem () {
        if (this.mode === MODE_EDIT) {
          try {
            const res = await DRegionApi.getItem(this.$route.params.id)
            Object.assign(this.formData, res.data)

            this.$nextTick(() => {
              this.formData.province.slice(0).forEach((item) => {
                if (this.allProvince.indexOf(item) !== -1) {
                  this.$refs.tabProvince.toggleRowSelection(item, true)
                }
              })
            })
          } catch (e) {
            this.$myErrorHandler.handle(this, e)
          }
        }
      },
      async create () {
        await DRegionApi.create(this.formData)
        this.$message({
          message: '创建成功',
          showClose: true,
          type: 'success'
        })
        this.$router.back()
      },
      async update () {
        await DRegionApi.updateItem(this.formData, this.$route.params.id)
        this.$message({
          message: '更新成功',
          showClose: true,
          type: 'success'
        })
        this.$router.back()
      },
      submit () {
        this.$refs.form.validate(async (validFrom) => {
          if (validFrom) {
            this.loading = true
            try {
              if (this.mode === MODE_DEFAULT) {
                this.create()
              } else {
                this.update()
              }
              this.loading = false
            } catch (e) {
              this.loading = false
              this.$myErrorHandler.handle(this, e)
            }
          }
        })
      }
    },
    mounted () {
      this.getEditItem()
    }
  }
</script>

<style lang="scss" scoped>

  .name-input {
    display: inline-block;
    width: 300px;
  }

  .province {
    width: 250px;
    border: 1px solid #e6ebf5;
  }

</style>
