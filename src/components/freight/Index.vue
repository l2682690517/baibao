<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item>运费模板</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="tool-bar">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="create">添加</el-button>
    </div>
    <div v-if="dataList.data" v-for="item in dataList.data">
      <div style="margin-bottom: 30px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="width:250px;font-weight:600 ">{{item.name}}</span>
            <div class="box-btn"><span>{{item.pc}}款商品</span>
              <span>
          <el-button size="mini" v-if="item.pc ==0" type="danger"
                     @click=delItem(item.id)>删除
          </el-button>
          <el-button size="mini" type="primary"  @click=editItem(item.id)>编辑</el-button>
          </span></div>
          </div>
          <div v-for="items in item.items" class="text item">
            <div v-if="item.tp===1">
              <span style="color: #48576a" v-if="items.province.length!==0">{{items.province.toString()}}</span><span
              v-else style="color: #48576a">默认</span>{{'&nbsp&nbsp&nbsp&nbsp' + items.first_unit + '&nbsp个内'}}
              {{convertFenToYuan(items.first_price) + '&nbsp元,'}}
              {{'每续&nbsp&nbsp' + items.next_unit + '&nbsp&nbsp个'}}
              {{'增加&nbsp&nbsp' + convertFenToYuan(items.next_price) + '&nbsp元'}}
            </div>
            <div v-if="item.tp===2">
              <span style="color: #48576a" v-if="items.province.length!==0">{{items.province.toString()}}</span><span
              v-else style="color: #48576a">默认</span>{{'&nbsp&nbsp&nbsp&nbsp' + getWeight(items.first_unit) + '&nbspkg内'}}
              {{convertFenToYuan(items.first_price) + '&nbsp元,'}}
              {{'每续&nbsp&nbsp' + getWeight(items.next_unit) + '&nbspkg'}}
              {{'增加&nbsp&nbsp' + convertFenToYuan(items.next_price) + '&nbsp元'}}
            </div>
          </div>
        </el-card>
      </div>

    </div>
  </div>
</template>

<script>
  import * as FreightApi from 'src/api/freight'

  export default {
    data () {
      return {
        loading: false,
        dataList: {}
      }
    },
    methods: {
      getWeight (row) {
        return parseFloat(row).div(1000)
      },
      convertFenToYuan (yuan) {
        return parseFloat(yuan).div(100)
      },
      create () {
        this.$router.push({
          name: 'CreateFreight'
        })
      },
      editItem (row) {
        this.$router.push({
          name: 'EditFreight',
          params: {
            id: row
          }
        })
      },
      delItem (row) {
        this.$confirm('确定删除?').then(async () => {
          try {
            this.loading = true
            await FreightApi.deleteItem(row)
            this.refreshDataList()
          } catch (e) {
            this.$myErrorHandler.handle(this, e)
          } finally {
            this.loading = false
          }
        }).catch(() => {})
      },
      async refreshDataList () {
        this.loading = true
        try {
          let res = await FreightApi.getList()
          this.dataList = res.data
        } catch (e) {
          this.$myErrorHandler.handle(this, e)
        } finally {
          this.loading = false
        }
      }
    },
    activated () {
      this.refreshDataList()
    }
  }
</script>

<style lang="scss" scoped>
  .tool-bar {
    margin-bottom: 20px;
  }

  .intro {
    color: $color-default;
    font-size: 14px;
    margin-bottom: 10px;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix {
  }

  .clearfix {
    display: inline;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 580px;
  }

  .box-btn {
    display: inline;
    position: absolute;
    left: 400px;
  }
</style>
