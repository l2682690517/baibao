<template>
  <div>
    <el-form-item>
      <div class="f-wrap">
        <div class="f-container">
          <el-row class="f-header">
            <el-col class="header-item head">配送区域</el-col>
            <el-col class="header-item head" v-if="prod.tp===1">首件(个)</el-col>
            <el-col class="header-item head" v-if="prod.tp===2">首重(kg)</el-col>
            <el-col class="header-item head">运费(元)</el-col>
            <el-col class="header-item head" v-if="prod.tp===1">续件(个)</el-col>
            <el-col class="header-item head" v-if="prod.tp===2">续重(kg)</el-col>
            <el-col class="header-item head">续费(元)</el-col>
            <el-col class="header-item head">操作</el-col>
          </el-row>
          <el-dialog title="选择地区" :visible.sync="dialogFormVisible">
            <el-form-item>
              <div class="province">
                <el-table ref="tabProvince" :data="allProvince" :height="200" :show-header="false"
                          @selection-change="handleSelectionChange">
                  <el-table-column
                    type="selection"
                    :selectable="selectTable"
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
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="changeprovince">确 定</el-button>
            </div>
          </el-dialog>
          <el-row v-for="(item,index) in realArry" :key="item.key">
            <el-col class="f-content head">
              <el-form-item v-if="index===0">
                <p>默认</p>
              </el-form-item>
              <el-form-item label="" :prop="'items.' + index + '.province'" :rules="rules.province"
                            v-if="index!==0&&item.province.length!==0">
                <p style="color: cornflowerblue;cursor:pointer" @click="isChange(item, index)">
                  {{item.province.toString()}}</p>
              </el-form-item>
              <el-form-item label="" :prop="'items.' + index + '.province'" :rules="rules.province"
                            v-if="index!==0 && item.province.length===0">
                <p style="color: cornflowerblue;cursor:pointer" @click="isChange(item, index)">请选择省份</p>
              </el-form-item>
            </el-col>
            <el-col class="f-content head">
              <el-form-item label="" :prop="'items.' + index + '.first_unit'" :rules="rules.first_unit">
                <el-input size="small" v-model="item.first_unit"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="f-content head">
              <el-form-item label="" :prop="'items.' + index + '.first_price'" :rules="rules.first_price">
                <el-input size="small" v-model="item.first_price"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="f-content head">
              <el-form-item label="" :prop="'items.' + index + '.next_unit'" :rules="rules.next_unit">
                <el-input size="small" v-model="item.next_unit"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="f-content head">
              <el-form-item label="" :prop="'items.' + index + '.next_price'" :rules="rules.next_price">
                <el-input size="small" v-model="item.next_price"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="f-content head">
              <el-button v-if="index!==0" size="mini" type="danger" icon="el-icon-delete"
                         @click="deleteFreight(item, index)"
              ></el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form-item>
  </div>
</template>

<script>
  import * as AddressUtil from 'src/utils/addressUtil'
  import { getRealFreightArry } from 'src/utils/freightUtil'
  import Vue from 'vue'

  export default {
    components: {},
    props: {
      prod: {
        type: Object
      }
    },
    data () {
      const validateprovince = (rule, value, callback) => {
        if (value) {
          if (value.length === this.allProvince.length) {
            callback(new Error('不能选择全部的地区'))
            return
          }
          if (value.length === 0) {
            callback(new Error('请选择地区'))
            return
          }
          callback()
        }
      }
      const validateItem = (rule, value, callback) => {
        if (this.prod.tp === 1) {
          if (!(/^[0-9]*[1-9][0-9]*$/.test(value))) {
            callback(new Error('件数必须为正整数'))
            return
          }
        } else {
          let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1})?$)|(^(0){1}$)|(^[0-9]\.[0-9]$)/
          if (reg.test(value)) {
            if (parseFloat(value) <= 0) {
              callback(new Error('重量必须为正数'))
              return
            }
            callback()
          } else {
            callback(new Error('请输入正确的重量'))
            return
          }
        }
        callback()
      }
      const validateFreight = (rule, value, callback) => {
        let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
        if (reg.test(value)) {
          if (parseFloat(value) < 0) {
            callback(new Error('运费必须为非负数'))
            return
          }
          callback()
        }
        callback(new Error('请输入正确的运费'))
        return
      }
      return {
        province: '',
        selectPro: [],
        lineNumber: '',
        dialogFormVisible: false,
        rules: {
          province: [
            {validator: validateprovince, trigger: 'blur'}
          ],
          first_unit: [
            {required: true, message: '该项不可为空', trigger: 'blur'},
            {validator: validateItem, trigger: 'blur'}

          ],
          first_price: [
            {required: true, message: '输入运费', trigger: 'blur'},
            {validator: validateFreight, trigger: 'blur'}
          ],
          next_unit: [
            {required: true, message: '该项不可为空', trigger: 'blur'},
            {validator: validateItem, trigger: 'blur'}
          ],
          next_price: [
            {required: true, message: '输入运费', trigger: 'blur'},
            {validator: validateFreight, trigger: 'blur'}
          ]
        },
        formLabelWidth: '120px'
      }
    },
    methods: {
      selectTable (row, index) {
        if (this.selectPro.indexOf(row) !== -1) {
          return false
        } else {
          return true
        }
      },
      handleSelectionChange (val) {
        this.province = val
      },
      isChange (item, index) {
        this.lineNumber = index
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs.tabProvince.clearSelection()
          this.prod.items.forEach((i) => {
            let pro = i.province
            if (pro.length !== 0) {
              this.selectPro = this.selectPro.concat(pro)
            }
          })
          let diff = this.selectPro.filter(key => !item.province.includes(key))
          let Deduplication = []
          for (let i = 0; i < diff.length; i++) {
            if (Deduplication.indexOf(diff[i]) === -1) {
              Deduplication.push(diff[i])
            }
          }
          this.selectPro = Deduplication
          if (item.province.length !== 0) {
            item.province.forEach(row => {
              this.$refs.tabProvince.toggleRowSelection(row)
            })
          } else {
            this.$refs.tabProvince.clearSelection()
          }
        })
      },
      deleteFreight (item, index) {
        if (item.id === 0) {
          this.$confirm('确定删除?').then(() => {
            this.prod.items.splice(index, 1)
          }).catch(() => {})
        } else {
          this.$confirm('确定删除?').then(() => {
            Vue.set(item, 'del', true)
          }).catch(() => {})
        }
      },
      changeprovince () {
        this.prod.items[this.lineNumber].province = [...this.province]
        this.dialogFormVisible = false
      }
    },
    computed: {
      realArry () {
        return getRealFreightArry(this.prod.items)
      },
      allProvince () {
        return AddressUtil.allProvince
      }
    }
  }
</script>

<style lang="less" scoped>
  .f-wrap {
    overflow: hidden;
    overflow-x: auto; /* 1 */
    -webkit-backface-visibility: hidden;
    .f-container {
      width: 900px;
      .province{
        border: 1px solid #e6ebf5;
      }
      .f-header {
        background-color: #eef1f6;
        .header-item {
          border-left: 1px solid #dbdcdf;
          border-top: 1px solid #dbdcdf;
          border-bottom: 1px solid #dbdcdf;
          text-align: center;
          &:last-child {
            border-right: 1px solid #dbdcdf;
          }
        }
      }
      .f-content {
        padding: 10px;
        height: 80px;
        border-left: 1px solid #dbdcdf;
        border-bottom: 1px solid #dbdcdf;
        text-align: center;
        overflow: auto;

        &:last-child {
          border-right: 1px solid #dbdcdf;
        }

        .delete-btn {
          width: 20px;
          height: 20px;
          padding: 0;
        }
      }
      .head {
        width: 150px;
      }
    }
  }
</style>
