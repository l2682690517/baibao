export const getNowDateTick = () => {
  const now = new Date()
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return nowDate.getTime()
}
