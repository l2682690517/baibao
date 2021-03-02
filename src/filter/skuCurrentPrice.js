import { convertFenToYuan } from 'src/utils/moneyUtil'

export default function (sku) {
  return `¥${convertFenToYuan(sku.seckill_price)}`
}
