import { convertFenToYuan } from 'src/utils/moneyUtil'

export default function (val, showSymbol = true) {
  const lessZero = val < 0
  return `${lessZero ? '- ' : ''} ${showSymbol ? '¥' : ''}${convertFenToYuan(Math.abs(val))}`
}
