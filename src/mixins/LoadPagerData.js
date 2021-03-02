export default {
  props: {
    autoLoadData: {
      type: Boolean,
      default: true
    },
    queryParams: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      loading: false,
      /**
       * 绑定el-pagination组件的:current-page属性
       */
      currentPage: 1,
      /**
       * 绑定el-pagination组件的:page-size属性
       */
      pageSize: 10,
      dataList: {
        data: [],
        page: 1,
        limit: 10,
        total: 0
      }
    }
  },
  computed: {
    /**
     * 是否可以分页
     * @returns {boolean}
     */
    isEnabledPager () {
      return this.dataList.total > this.pageSize
    },
    /**
     * 绑定el-pagination组件的:total属性
     */
    dataListTotal () {
      return this.dataList.total
    }
  },
  methods: {
    getFullQueryParams (tag) {
      return Object.assign({
        page: this.currentPage,
        limit: this.pageSize
      }, this.queryParams)
    },
    /**
     * @override
     * 查询api
     */
    getQueryApi (params) {
    },
    /**
     * @override
     * 查询dataList之前调用的方法
     */
    beforeLoadDataList () {
      this.loading = true
      this.$emit('beforeLoad')
    },
    /**
     * @override
     * 查询dataList完成后调用的方法
     */
    loadDataListCompleted (err) {
      this.loading = false
      this.$emit('loadCompleted', err)
    },
    /**
     * 载入数据
     */
    async loadDataList () {
      this.beforeLoadDataList()
      try {
        const res = await this.getQueryApi(this.getFullQueryParams())
        this.dataList = res.data
        if (!this.dataList.data) {
          this.dataList.data = []
        }
        this.loadDataListCompleted()
      } catch (err) {
        this.loadDataListCompleted(err)
        this.$myErrorHandler.handle(this, err, '查询失败')
      }
    },
    /**
     * 载入指定页，如果已经是当前前了，调用api刷新，如果不是当前页，修改queryParams的page，触发自动刷新
     */
    loadDataListByPage (page) {
      if (this.currentPage === page) {
        this.loadDataList()
      } else {
        this.currentPage = page
      }
    },
    /**
     * 载入第一页数据
     */
    loadFirstPageDataList () {
      this.loadDataListByPage(1)
    },
    /**
     * 绑定el-pagination组件的@current-change事件
     * @param current 页
     */
    changePage (current) {
      this.currentPage = current
      this.loadDataList()
    },
    /**
     * 绑定el-table组件的@sort-change事件
     * @param sortInfo 排序信息
     */
    sortChanged (sortInfo) {
      this.queryParams.sort = sortInfo.prop
      this.queryParams.order = this.queryParams.sort ? (sortInfo.order === 'ascending' ? 'asc' : 'desc') : ''
      this.loadFirstPageDataList()
    }
  },
  /**
   * 勾子
   */
  mounted () {
    if (this.autoLoadData) {
      this.loadDataList()
    }
  }
}
