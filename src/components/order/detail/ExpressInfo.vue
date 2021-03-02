<template>
  <div>
    <div v-for="(item, index) in expressList">
      <div class="item-title">
        <span class="name">包裹{{index + 1}}</span>
      </div>
      <div class="item-content">
        <div class="traffic-detail">
          <div class="left txt-info">
            <div class="item"><span>快递单号：</span>{{item.num}}</div>
            <div class="item"><span>快递公司：</span>{{item.name}}</div>
            <div class="item"><span>发货时间：</span>{{item.ct | datetime}}</div>
          </div>
          <div class="traffic-right" v-if="item.list && item.list.length > 0">
            <el-collapse accordion>
              <el-collapse-item>
                <template slot="title">
                  <div class="right-title">
                    <div>{{item.list[0].status}}</div>
                    <div>{{item.list[0].time | datetime}}</div>
                  </div>
                </template>
                <div v-for="(expItem, expIndex) in item.list" v-if="expIndex > 0">
                  <div>{{expItem.status}}</div>
                  <div>{{expItem.time | datetime}}</div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <div class="product-wrapper">
          <div class="traffic-product-wrapper" v-for="product in item.oi_list">
            <product-cell :orderItem="product"></product-cell>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ProductCell from './OrderItemCell'

  export default {
    props: {
      expressList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    components: {
      ProductCell
    },
    methods: {
    }
  }
</script>

<style lang="less" scoped>

  .item-title {
    height: 30px;
    background-color: #eef1f6;

    .name {
      display: inline-block;
      line-height: 30px;
      height: 100%;
      width: 50px;
      padding-left: 5px;
      font-size: 13px;
      background-color: #eef1f6;
      vertical-align: top;
    }

    .edit {
      display: inline-block;
      height: 30px;
      line-height: 30px;
      margin: 0;
      padding: 0px;
    }

  }

  .item-content {
    border: solid 1px #eee;

    .traffic-detail {
      display: flex;

      .left {
        padding-left: 5px;
        padding-bottom: 5px;

        .item {
          margin-top: 5px;
        }
      }

      .right-title {
        padding-right: 20px;
      }

    }
  }

  .product-wrapper {
    box-sizing: border-box;
    margin: 0 5px 5px 5px;
    border-top: solid 1px #ddd;
    padding-top: 5px;

    .traffic-product-wrapper {
      display: inline-flex;
      width: 32%;
    }
  }

</style>

<style lang="less">
  .traffic-right {
    flex: 1;
    padding: 5px;

    .el-collapse-item__header {
      position: relative;
      height: auto !important;
      min-height: 55px;
      line-height: 16px;

      .el-collapse-item__header__arrow {
        position: absolute;
        right: 0;
        top: 5px;
      }
    }

  }
</style>
