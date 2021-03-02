const refundStatus = {
  1: '等待管理员处理',
  2: '等待消费者处理',
  3: '取消退款',
  4: '拒绝退款',
  5: '同意退款'
}

export default (status) => {
  return refundStatus[status]
}
