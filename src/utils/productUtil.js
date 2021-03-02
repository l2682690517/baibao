export const isSoldOut = (goods) => {
  return goods.stock === 0 && goods.ext && goods.now > goods.ext.sell_time
}
