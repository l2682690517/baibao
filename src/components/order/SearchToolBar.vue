<template>
  <el-form :inline="true">
    <el-form-item label="状态">
      <el-select class="status-select" v-model="model.status" multiple clearable >
        <el-option
          v-for="item in optionsStatus"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="下单">
      <date-tool-bar :oratimeRange="oratimeRange" placeholder="选择日期" ref="datetoolbar"
                     @change="_dateChanged"></date-tool-bar>
    </el-form-item>
    <el-form-item label="商品名称:">
      <el-input v-model="model.pn"></el-input>
    </el-form-item>
    <el-form-item label="商品分类">
      <el-cascader clearable
                   placeholder="请选择分类"
                   :options="groupCategory" :props="casprop" expand-trigger="hover"
                   v-model="model.cate" clearable :change-on-select="true">
      </el-cascader>
    </el-form-item>
    <el-form-item label="买家手机:">
      <el-input class="mobile" v-model="model.mobile" :maxlength="11"></el-input>
    </el-form-item>
    <el-form-item label="订单编号:">
      <el-input v-model="model.code"></el-input>
    </el-form-item>
    <el-form-item label="物流单号:">
      <el-input v-model="model.del_no"></el-input>
    </el-form-item>
    <el-form-item label="买家姓名:">
      <el-input class="name" v-model="model.name"></el-input>
    </el-form-item>
    <el-form-item label="店铺ID:">
      <el-input class="inputId" v-model="model.spid"></el-input>
    </el-form-item>
    <el-form-item label="消费者ID:">
      <el-input class="inputId" v-model="model.uid"></el-input>
    </el-form-item>
    <el-form-item>
      <el-select v-model="model.buyers" clearable multiple placeholder="选择采购人">
        <el-option
          v-for="buyer in buyers"
          :key="buyer"
          :label="buyer"
          :value="buyer">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="_submit">搜&nbsp;索</el-button>
      <el-button type="primary" @click="createExportTask">新建导出任务</el-button>
      <el-button type="primary" @click="gotoListExportTask">导出任务列表</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import DateToolBar from 'src/common/widgets/DateToolBar'
  import ProductApi from '@/api/product'
  import CategoryApi from '../../api/category'
  import * as EXPORT_TASK from 'src/constants/export_task'
  import { mapGetters } from 'vuex'

  const STATUS_WAIT_SEND = 0

  export default {
    components: {DateToolBar},
    STATUS_WAIT_SEND,
    props: {
      model: {
        type: Object,
        default: () => {
          return {
            status: [],
            code: '', // 订单编号
            name: '', // 买家姓名
            mobile: '', // 买家手机号
            del_no: '',  // 物流单号，
            orderStartTime: '',
            orderEndTime: '',
            pn: '', // 商品名称
            spid: '', // 店铺id
            uid: '', // 消费者id
            buyers: [],
            cate: []
          }
        }
      }
    },
    data () {
      return {
        optionsStatus: [
          {value: '3', label: '待发货'},
          {value: '1', label: '待付款'},
          {value: '4', label: '待收货'},
          {value: '5', label: '已完成'},
          {value: '2', label: '已关闭'},
          {value: '6', label: '已退款'}
        ],
        buyers: [],
        casprop: {
          value: 'id',
          label: 'name',
          children: 'categorys'
        },
        chooseCate: []
      }
    },
    computed: {
      oratimeRange () {
        let oratimeRange = [this.model.orderStartTime, this.model.orderEndTime]
        return oratimeRange
      },
      ...mapGetters({
        allCategory: 'allCategory',
        allTagGroup: 'allTagGroup'
      }),
      groupCategory: {
        get () {
          let group = Object.assign([], this.allCategory)
          for (var g of group) {
            if (g.categorys && g.categorys.length === 0) {
              delete g.categorys
            }
          }
          return group
        }
      }
    },
    methods: {
      loadNecessaryData () {
        this.getAllCategory()
        this.getAllBuyers()
      },
      getAllCategory () {
        CategoryApi.setStoreAllCategoryList()
          .then((res) => {
          })
          .catch((err) => {
            this.$myErrorHandler.handle(this, err, '查询分类失败')
          })
      },
      async getAllBuyers () {
        try {
          const resBuyers = await ProductApi.getBuyerList()
          this.buyers = resBuyers.data.data
        } catch (e) {
          this.$myErrorHandler.handle(this, e)
        }
      },
      _submit () {
        this.$emit('submit', this.model)
      },
      _dateChanged (val) {
        if (val) {
          const dates = val
          this.model.orderStartTime = dates[0]
          this.model.orderEndTime = dates.length > 1 ? dates[1] : ''
        } else {
          this.model.orderStartTime = ''
          this.model.orderEndTime = ''
        }
      },
      createExportTask () {
        if (!this.model.orderStartTime || !this.model.orderEndTime) {
          this.$message({
            message: '请选择下单时间',
            type: 'error',
            showClose: true
          })
          return
        }
        let st = new Date(this.model.orderStartTime)
        st.setDate(st.getDate() + 31)
        if (st <= new Date(this.model.orderEndTime)) {
          this.$message({
            message: '日期跨度不能超过31天',
            type: 'error',
            showClose: true
          })
          return
        }
        this.$confirm(`新建导出任务当前筛选结果`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.$emit('create_export_task', this.model)
        }).catch(() => {
        })
      },
      gotoListExportTask () {
        this.$router.push({
          path: '/export/task',
          query: {
            fromCat: EXPORT_TASK.CAT_ORDER,
            cat: EXPORT_TASK.CAT_ORDER
          }
        })
      },
      reset () {
        this.model.status = []
        this.model.code = ''
        this.model.name = ''
        this.model.mobile = ''
        this.model.del_no = ''
        this.model.pn = ''
        this.$refs.datetoolbar.reset()
        this.model.orderStartTime = ''
        this.model.orderEndTime = ''
        this.model.cate = []
      }
    },
    async activated () {
      this.loadNecessaryData()
    }
  }
</script>

<style lang="less" scoped>

  .title {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #48576a;
    line-height: 1;
    box-sizing: border-box;
  }

  .status-select {
    width: 260px
  }

  .mobile {
    width: 120px;
  }

  .name {
    width: 100px;

  }

  .inputId {
    width: 80px;
  }
</style>
