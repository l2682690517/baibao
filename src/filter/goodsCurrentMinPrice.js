export default function (goods) {
  return goods.seckill_price ? `¥${goods.seckill_price.split('~')[0]}` : `¥${goods.original_price.split('~')[0]}`
}
