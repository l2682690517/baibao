import { date, datetime } from './datetime'
import priceFilter from './price'
import originPriceFilter from './originPrice'
import discountStateFilter from './discountState'
import orderFullStatusFilter from './orderFullStatus'
import deliveryStatusFilter from './deliveryStatus'
import skuCurrentPriceFilter from './skuCurrentPrice'
import productProfitFilter from './productProfit'
import refundStatusFilter from './refundStatus'
import goodsCurrentMinPrice from './goodsCurrentMinPrice'
import { exportTaskCat, exportTaskStatus } from './export_task'

export default {}.install = function (Vue, options) {
  let filters = [
    {name: 'date', filter: date},
    {name: 'datetime', filter: datetime},
    {name: 'price', filter: priceFilter},
    {name: 'discountState', filter: discountStateFilter},
    {name: 'originPrice', filter: originPriceFilter},
    {name: 'orderFullStatus', filter: orderFullStatusFilter},
    {name: 'deliveryStatus', filter: deliveryStatusFilter},
    {name: 'skuCurrentPrice', filter: skuCurrentPriceFilter},
    {name: 'productProfit', filter: productProfitFilter},
    {name: 'refundStatus', filter: refundStatusFilter},
    {name: 'exportTaskCat', filter: exportTaskCat},
    {name: 'exportTaskStatus', filter: exportTaskStatus},
    {name: 'goodsCurrentMinPrice', filter: goodsCurrentMinPrice}
  ]
  for (let i = 0; i < filters.length; i++) {
    let filer = filters[i]
    Vue.filter(filer.name, filer.filter)
  }
}
