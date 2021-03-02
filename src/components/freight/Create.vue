<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ name: 'Freight' }">运费模板</el-breadcrumb-item>
      <el-breadcrumb-item>创建运费模板</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <Freight-form :mode="0"></Freight-form>
    </div>
  </div>
</template>

<script>
  import FreightForm from './Form.vue'

  export default {
    name: 'CreateFreight',
    components: {
      FreightForm
    }
  }
</script>
<style lang="scss" scoped></style>
