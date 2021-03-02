export default function (value) {
  const allPrice = []
  value.skus.forEach((item) => {
    allPrice.push(item.price)
  })
  if(allPrice.length === 0) {
    return ''
  }
  const max = Math.max.apply(null, allPrice)
  const min = Math.min.apply(null, allPrice)
  if(max === min) {
    return String(max / 100)
  } else {
    return `${String(min / 100)}~${String(max / 100)}`
  }
}
