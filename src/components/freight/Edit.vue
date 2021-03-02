<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ name: 'Freight' }">运费模板</el-breadcrumb-item>
      <el-breadcrumb-item>编辑运费模板</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <freight-form :mode="$options.MODE_EDIT"></freight-form>
    </div>
  </div>
</template>

<script>
  import { MODE_EDIT } from 'src/constants/common'
  import FreightForm from 'src/components/freight/Form.vue'

  export default {
    MODE_EDIT,
    name: 'EditFreight',
    components: {
      FreightForm
    }
  }
</script>

<style lang="scss" scoped>

</style>
