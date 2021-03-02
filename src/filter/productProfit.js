export default function (product) {
  if (!product.ext) {
    console.log('bac product, ext is null')
    return `¥0`
  }
  if (product.ext.min_profit === product.ext.max_profit) {
    return `¥${product.ext.min_profit * 1.0 / 100}`
  } else {
    return `¥${product.ext.min_profit * 1.0 / 100}~${product.ext.max_profit * 1.0 / 100}`
  }
}
