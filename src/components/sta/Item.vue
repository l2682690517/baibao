<template>
  <div>
    <div class="name">
      {{name}}
    </div>
    <div class="value" v-if="link">
      <router-link :to="link">{{value}}</router-link>
    </div>
    <div class="value" v-else>
      {{value}}
    </div>

  </div>
</template>

<script>
  export default {
    props: {
      name: {
        type: String,
        default: ''
      },
      value: {
        type: String,
        default: ''
      },
      link: {
        type: Object,
        default: null
      }
    }
  }
</script>

<style lang="less" scoped>

  a {
    color: #20a0ff;
  }

  .name {
    font-size: 14px;
    color: #888888;
  }

  .value {
    font-size: 20px;
    margin-top: 8px;
  }

</style>
