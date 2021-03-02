export const filterEmpty = (params) => {
  let query = {}
  Object.keys(params).map(function(objectKey, index) {
    var value = params[objectKey]
    if (value) {
      query[objectKey] = value
    }
  })
  return query
}
