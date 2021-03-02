export default {
  data() {
    return {
      autoLoadData: true,
      loading: false,
      dataList: {
        data: []
      }
    }
  },
  computed: {
    /**
     * dataList数量
     */
    dataListTotal() {
      return this.dataList.data.length
    }
  },
  methods: {
    /**
     * @override
     * 查询api
     */
    getQueryApi() {
    },
    /**
     * @override
     * 查询dataList之前调用的方法
     */
    beforeLoadDataList() {
      this.loading = true
      this.$emit('beforeLoad')
    },
    /**
     * @override
     * 查询dataList完成后调用的方法
     */
    loadDataListCompleted(err) {
      this.loading = false
      this.$emit('loadCompleted', err)
    },
    /**
     * 载入数据
     */
    async loadDataList() {
      this.beforeLoadDataList()
      try {
        const res = await this.getQueryApi()
        this.dataList = res.data
        if (!this.dataList.data) {
          this.dataList.data = []
        }
        this.loadDataListCompleted()
      } catch (err) {
        this.loadDataListCompleted(err)
        this.$myErrorHandler.handle(this, err, '查询失败')
      }
    }
  },
  created() {
    if (this.autoLoadData) {
      this.loadDataList()
    }
  }
}
