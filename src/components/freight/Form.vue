<template>
  <div v-loading="loading"
       element-loading-text="加载中">
    <el-form ref="form" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="模板名称" prop="name">
        <el-input
          class="name-input"
          placeholder="最多20个字"
          :maxlength="20"
          v-model="formData.name">
        </el-input>
      </el-form-item>
      <el-form-item label="计费方式" prop="tp">
        <div v-if="this.mode===1">
          <el-radio v-model="formData.tp" :label="1" :disabled="true">按件数</el-radio>
          <el-radio v-model="formData.tp" :label="2" :disabled="true">按重量</el-radio>
        </div>
        <div v-if="this.mode===0">
          <el-radio v-model="formData.tp" :label="1">按件数</el-radio>
          <el-radio v-model="formData.tp" :label="2">按重量</el-radio>
        </div>
      </el-form-item>
      <edit-freight-comp ref="freightComp" :prod="formData"></edit-freight-comp>
      <el-form-item>
        <el-button @click="createNewFreightTemplate"size="medium" icon="el-icon-plus" type="primary">添 加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button  size="medium" @click="$router.back()">取 消</el-button>
        <el-button size="medium" type="primary"  @click="submit" :loading="loading">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { MODE_DEFAULT, MODE_EDIT } from 'src/constants/common'
  import * as FreightApi from 'src/api/freight'
  import EditFreightComp from './EditFreightComp.vue'
  import { convertFenToYuan } from 'src/utils/moneyUtil'
  import { convertGramToKilogram } from 'src/utils/freightUtil'

  export default {
    components: {
      EditFreightComp
    },
    props: {
      mode: {
        type: Number,
        default: MODE_DEFAULT
      }
    },
    data () {
      return {
        dialogVisible: false,
        loading: false,
        formData: {
          name: '',
          tp: 1,
          items: [{
            id: 0,
            province: [],
            first_unit: '',
            first_price: '',
            next_unit: '',
            next_price: '',
            del: false
          }]
        },
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {max: 20, message: '最大20个字符', trigger: 'blur'}
          ],
          tp: [
            {type: 'number', required: true, message: '请选择计费方式', trigger: 'blur'}
          ]

        }
      }
    },
    computed: {},
    methods: {
      async getEditItem () {
        if (this.mode === MODE_EDIT) {
          try {
            this.loading = true
            let res = await FreightApi.getItem(this.$route.params.id)
            if (res.data.tp === 2) {
              let arr = []
              res.data.items.forEach((i) => {
                let item = {
                  id: i.id,
                  province: i.province,
                  first_unit: String(convertGramToKilogram(i.first_unit)),
                  first_price: String(convertFenToYuan(i.first_price)),
                  next_unit: String(convertGramToKilogram(i.next_unit)),
                  next_price: String(convertFenToYuan(i.next_price)),
                  del: false
                }
                if (item.province === undefined) {
                  item.province = []
                }
                arr.push(item)
              })
              Object.assign(res.data.items, arr)
            } else {
              let arr = []
              res.data.items.forEach((i) => {
                let item = {
                  id: i.id,
                  province: i.province,
                  first_unit: String(i.first_unit),
                  first_price: String(convertFenToYuan(i.first_price)),
                  next_unit: String(i.next_unit),
                  next_price: String(convertFenToYuan(i.next_price)),
                  del: false
                }
                if (item.province === undefined) {
                  item.province = []
                }
                arr.push(item)
              })
              Object.assign(res.data.items, arr)
            }
            delete res.data.ct
            delete res.data.mt
            Object.assign(this.formData, res.data)
          } catch (e) {
            this.$myErrorHandler.handle(this, e)
          } finally {
            this.loading = false
          }
        }
      },
      async create () {
        this.loading = true
        let data = JSON.parse(JSON.stringify(this.formData))
        try {
          await FreightApi.create(data)
          this.$message({
            message: '创建成功',
            showClose: true,
            type: 'success'
          })
          this.$router.back()
        } catch (err) {
          this.loading = false
          this.$myErrorHandler.handle(this, err)
        }
      },
      async update (row) {
        let data = JSON.parse(JSON.stringify(this.formData))
        this.loading = true
        try {
          await FreightApi.updateItem(data, this.$route.params.id)
          this.$message({
            message: '更新成功',
            showClose: true,
            type: 'success'
          })
          this.getEditItem()
          if (!row) {
            this.$router.back()
          }
        } catch (err) {
          this.loading = false
          this.$myErrorHandler.handle(this, err)
        }
      },
      createNewFreightTemplate () {
        this.formData.items.push({
          id: 0,
          province: [],
          first_unit: '',
          first_price: '',
          next_unit: '',
          next_price: ''
        })
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
      },
      handleClose (done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {})
      }

    },
    mounted () {
      this.getEditItem()
    },
    activated () {

    }

  }

</script>

<style lang="less" scoped>
  .name-input {
    display: inline-block;
    width: 300px;
  }

  .freight {
    width: 820px;
  }

  .item-input {
    display: inline-block;
    width: 50px;
  }


</style>
