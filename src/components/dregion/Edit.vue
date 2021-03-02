<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ name: 'DRegion' }">配送区域</el-breadcrumb-item>
      <el-breadcrumb-item>编辑配送区域</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <region-form :mode="$options.MODE_EDIT"></region-form>
    </div>
  </div>
</template>

<script>
  import { MODE_EDIT } from 'src/constants/common'
  import RegionForm from 'src/components/dregion/Form.vue'

  export default {
    MODE_EDIT,
    name: 'EditDRegion',
    components: {
      RegionForm
    }
  }
</script>

<style lang="scss" scoped>

</style>
