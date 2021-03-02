export const convertKilogramToGram = (KG) => {
  return parseFloat(KG).mul(1000)
}
export const convertGramToKilogram = (G) => {
  return parseFloat(G).div(1000)
}
export const getRealFreightArry = (arr) => {
  return arr.filter((item) => {
    return !item.del
  })
}
