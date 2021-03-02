<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ name: 'DRegion' }">配送区域</el-breadcrumb-item>
      <el-breadcrumb-item>创建配送区域</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <region-form :mode="0"></region-form>
    </div>
  </div>
</template>

<script>
  import RegionForm from './Form.vue'

  export default{
    name: 'CreateDRegion',
    components: {
      RegionForm
    }
  }
</script>

<style lang="scss" scoped></style>
