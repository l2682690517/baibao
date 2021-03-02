import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import auth from '../api/auth'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['../components/auth/Login'], resolve),
      beforeEnter: (to, from, next) => {
        if (store.getters.isLogin) {
          next({
            name: 'home',
            replace: true
          })
        } else {
          auth.getMe()
            .then(() => {
              next({
                name: 'home',
                replace: true
              })
            })
            .catch(() => {
              next()
            })
        }
      }
    },
    {
      path: '/',
      name: 'home',
      component: resolve => require(['../components/home/Home'], resolve),
      beforeEnter: (to, from, next) => {
        if (store.getters.isLogin) {
          next()
        } else {
          auth.getMe()
            .then(() => {
              next(true)
            })
            .catch((err) => {
              console.log(err)
              next({
                name: 'login',
                replace: true
              })
            })
        }
      },
      children: [
        {
          path: '',
          name: 'Sta',
          component: resolve => require(['../components/sta/Index'], resolve)
        },
        {
          path: 'sysuser',
          name: 'sysuser',
          component: resolve => require(['../components/sysuser/SysUserList'], resolve)
        }, {
          path: 'category',
          component: resolve => require(['../components/category/CategoryList'], resolve)
        }, {
          path: 'tag',
          component: resolve => require(['../components/tag/TagList'], resolve)
        }, {
          name: 'product',
          path: 'product',
          component: resolve => require(['../components/product/Index'], resolve)
        }, {
          name: 'RecycleProduct',
          path: 'product/recycle',
          component: resolve => require(['../components/product/Recycle'], resolve)
        }, {
          name: 'EditProduct',
          path: 'product/edit/:id',
          component: resolve => require(['../components/product/Edit'], resolve)
        }, {
          name: 'CreateProduct',
          path: 'product/create',
          component: resolve => require(['../components/product/Create'], resolve)
        }, {
          name: 'CopyProduct',
          path: 'product/copy/:id',
          component: resolve => require(['../components/product/Copy'], resolve)
        }, {
          name: 'service',
          path: 'service',
          component: resolve => require(['../components/service/Index'], resolve)
        }, {
          name: 'editService',
          path: 'service/edit',
          component: resolve => require(['../components/service/Edit'], resolve)
        }, {
          name: 'createService',
          path: 'service/create',
          component: resolve => require(['../components/service/Create'], resolve)
        }, {
          name: 'servicetag',
          path: 'servicetag',
          component: resolve => require(['../components/servicetag/Index'], resolve)
        }, {
          name: 'custompage',
          path: 'custompage',
          component: resolve => require(['../components/custompage/Index'], resolve)
        }, {
          name: 'createCustompage',
          path: 'custompage/create',
          component: resolve => require(['../components/custompage/Create'], resolve)
        }, {
          name: 'editCustompage',
          path: 'custompage/edit/:id',
          component: resolve => require(['../components/custompage/Edit'], resolve)
        }, {
          name: 'DRegion',
          path: 'dregion',
          component: resolve => require(['../components/dregion/Index'], resolve)
        }, {
          name: 'CreateDRegion',
          path: 'dregion/create',
          component: resolve => require(['../components/dregion/Create'], resolve)
        }, {
          name: 'EditDRegion',
          path: 'dregion/edit/:id',
          component: resolve => require(['../components/dregion/Edit'], resolve)
        }, {
          name: 'Freight',
          path: 'freight',
          component: resolve => require(['../components/freight/Index'], resolve)
        }, {
          name: 'CreateFreight',
          path: 'freight/create',
          component: resolve => require(['../components/freight/Create'], resolve)
        }, {
          name: 'EditFreight',
          path: 'freight/edit/:id',
          component: resolve => require(['../components/freight/Edit'], resolve)
        },
        {
          name: 'Discount',
          path: 'discount',
          component: resolve => require(['../components/discount/Index'], resolve)
        }, {
          name: 'CreateDiscount',
          path: 'discount/create',
          component: resolve => require(['../components/discount/Create'], resolve)
        }, {
          name: 'EditDiscount',
          path: 'discount/edit/:id',
          component: resolve => require(['../components/discount/Edit'], resolve)
        }, {
          name: 'Voucher',
          path: 'voucher',
          component: resolve => require(['../components/voucher/Index'], resolve)
        }, {
          name: 'CreateVoucher',
          path: 'voucher/create',
          component: resolve => require(['../components/voucher/Create'], resolve)
        }, {
          name: 'EditVoucher',
          path: 'voucher/edit/:id',
          component: resolve => require(['../components/voucher/Edit'], resolve)
        }, {
          name: 'orderIndex',
          path: 'order',
          component: resolve => require(['../components/order/Index'], resolve)
        }, {
          name: 'orderrefundSearch',
          path: 'order/refund/search',
          component: resolve => require(['../components/order/refund/Search'], resolve)
        }, {
          name: 'orderRefund',
          path: 'order/refund',
          component: resolve => require(['../components/order/refund/Index'], resolve)
        }, {
          name: 'orderDetail',
          path: 'order/:id',
          component: resolve => require(['../components/order/detail/Index'], resolve)
        },
        {
          name: 'orderRefundDetail',
          path: 'order/:id/refund/:oiid',
          component: resolve => require(['../components/order/refund/Detail'], resolve)
        },
        {
          path: 'shop',
          name: 'shop',
          component: resolve => require(['../components/shop/Index'], resolve)
        }, {
          name: 'shopIncome',
          path: 'shop/:id/income',
          component: resolve => require(['../components/shop/Income'], resolve)
        },
        {
          name: 'shopCouponHistory',
          path: 'shop/couponHistory',
          component: resolve => require(['../components/shop/shopCouponHistory'], resolve)
        },
        {
          name: 'customerCouponHistory',
          path: 'customer/couponHistory',
          component: resolve => require(['../components/customer/customerCouponHistory'], resolve)
        },
        {
          name: 'customer',
          path: 'customer',
          component: resolve => require(['../components/customer/Index'], resolve)
        }, {
          name: 'CustomerOrderDetail',
          path: 'customer/:uid/order/:id',
          component: resolve => require(['../components/order/detail/Index'], resolve)
        }, {
          name: 'agreement',
          path: 'agreement',
          component: resolve => require(['../components/agreement/Index'], resolve)
        }, {
          name: 'CreateAgreement',
          path: 'agreement/create',
          component: resolve => require(['../components/agreement/Edit'], resolve)
        }, {
          name: 'EditAgreement',
          path: 'agreement/edit/:name',
          component: resolve => require(['../components/agreement/Edit'], resolve)
        }, {
          name: 'notice',
          path: 'notice',
          component: resolve => require(['../components/notice/Index'], resolve)
        }, {
          name: 'manageNotice',
          path: 'notice/manage',
          component: resolve => require(['../components/notice/ManageChannel'], resolve)
        }, {
          name: 'feedbackIndex',
          path: 'feedback',
          component: resolve => require(['../components/feedback/Index'], resolve)
        }, {
          name: 'versionIndex',
          path: 'version',
          component: resolve => require(['../components/version/Index'], resolve)
        }, {
          name: 'CreateVersion',
          path: 'version/create',
          component: resolve => require(['../components/version/Create'], resolve)
        }, {
          name: 'EditVersion',
          path: 'version/edit/edit/:id',
          component: resolve => require(['../components/version/Edit'], resolve)
        }, {
          name: 'pushIndex',
          path: 'push',
          component: resolve => require(['../components/push/Index'], resolve)
        }, {
          name: 'CreatePush',
          path: 'push/createpush',
          component: resolve => require(['../components/push/Create'], resolve)
        },
        {
          name: 'MicroPageIndex',
          path: 'micropage',
          component: resolve => require(['../components/micropage/Index'], resolve)
        },
        {
          name: 'CreateMicroPage',
          path: 'micropage/create',
          component: resolve => require(['../components/micropage/Create'], resolve)
        }, {
          name: 'EditMicroPage',
          path: 'micropage/edit/:id',
          component: resolve => require(['../components/micropage/Edit'], resolve)
        },
        {
          name: 'exportTask',
          path: 'export/task',
          component: resolve => require(['../components/export_task/Index'], resolve)
        }, {
          name: 'SellGroupIndex',
          path: 'sellgroup',
          component: resolve => require(['../components/sellgroup/Index.vue'], resolve)
        }, {
          name: 'SellGroupSales',
          path: 'sellgroup/sales',
          component: resolve => require(['../components/sellgroup/Sales.vue'], resolve)
        }
      ]
    }
  ]
})

router.afterEach(route => {
})

export default router

