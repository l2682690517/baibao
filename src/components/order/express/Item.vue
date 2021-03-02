<template>
  <div class="express-item">
    <div class="content" v-if="express && express.num">
      <div class="info txt-sm txt-info">
        <template v-if="express.deliverystatus !== '0'">物流状态：{{express.deliverystatus | deliveryStatus}}
          <br>
        </template>
        承运公司：{{express.name}}
        <br>
        运单编号：{{express.num}}
      </div>
      <div class="timeline txt-sm txt-info" @click="showMore = !showMore" v-if="express.deliverystatus !== '0' && express.list">
        <div class="icon" :class="{rotate: showMore}"></div>
        <div class="item" v-for="(item, index) in express.list" v-if="index === 0 || showMore">
          {{item.status}} <br>
          {{item.time | datetime}}
        </div>
      </div>
      <div v-else class="timeline txt-sm txt-info">
        暂无物流信息
      </div>
    </div>
    <div v-else class="empty txt-sm txt-info">
      暂无物流信息
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      express: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        showMore: false
      }
    }

  }
</script>

<style lang="less" scoped>

  .express-item {


    .empty {
      display: flex;
      align-items: center;
      justify-content: center;
      border-top: 1px solid #dcdcdc;
      padding: 30px 24px;
    }
  }

  .info {
    line-height: 1.5;
    padding: 8px;
  }

  .timeline {
    background: #f1f1f5;
    border: 1px solid #dcdcdc;
    border-radius: 10px;
    padding: 15px;
    line-height: 1.5;
    position: relative;

    .icon {
      width: 12px;
      height: 12px;
      background: url("~@/assets/img/more.png") no-repeat center / 100%;
      position: absolute;
      right: 30px;
      top: 25px;
      transform: rotate(90deg);
      transition: all 0.3s;
      &.rotate {
        transform: rotate(-90deg);
      }
    }

    .item {
      padding: 5px 0;
    }
  }
</style>
