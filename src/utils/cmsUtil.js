export const TYPE_RESOURCE_TEXT = 1
export const TYPE_RESOURCE_IMAGE = 2
export const TYPE_RESOURCE_VIDEO = 3

export const generateTextResource = (text) => {
  return {
    type: TYPE_RESOURCE_TEXT,
    text: text
  }
}

export const generateImageResource = (url, width, height) => {
  return {
    type: TYPE_RESOURCE_IMAGE,
    url,
    width,
    height
  }
}

export const generateVideoResource = (video) => {
  return {
    type: TYPE_RESOURCE_VIDEO,
    title: video.title,
    content: video.content
  }
}

export const TYPE_MODULE_ACTIVITY = 1
export const TYPE_MODULE_PRODUCT = 2
export const TYPE_MODULE_URL = 3
export const TYPE_MODULE_TAG = 4

const getShowTime = (showTp, chooseDate) => {
  let showStart = ''
  let showEnd = ''
  if (showTp === 2 && chooseDate.length >= 2) {
    showStart = chooseDate[0]
    showEnd = chooseDate[1]
  }
  return {showStart, showEnd}
}

export const generateModuleOfActivity = (id, name, cover, width, height, actId, showTp, chooseDate) => {
  let showTime = getShowTime(showTp, chooseDate)
  return {
    id: id,
    name: name,
    cover: cover,
    width: width,
    height: height,
    type: TYPE_MODULE_ACTIVITY,
    actId: parseInt(actId),
    show_tp: showTp,
    show_start: showTime.showStart,
    show_end: showTime.showEnd
  }
}
export const generateModuleOfTag = (id, name, cover, width, height, tagId, showTp, chooseDate) => {
  let showTime = getShowTime(showTp, chooseDate)
  return {
    id: id,
    name: name,
    cover: cover,
    width: width,
    height: height,
    type: TYPE_MODULE_TAG,
    tagId: parseInt(tagId),
    show_tp: showTp,
    show_start: showTime.showStart,
    show_end: showTime.showEnd
  }
}

export const generateModuleOfProduct = (id, name, cover, width, height, prodId, showTp, chooseDate) => {
  let showTime = getShowTime(showTp, chooseDate)
  return {
    id: id,
    name: name,
    cover: cover,
    width: width,
    height: height,
    type: TYPE_MODULE_PRODUCT,
    prodId: prodId,
    show_tp: showTp,
    show_start: showTime.showStart,
    show_end: showTime.showEnd
  }
}

export const getFriendlyModuleType = (type) => {
  switch (type) {
    case TYPE_MODULE_ACTIVITY:
      return '折扣'
    case TYPE_MODULE_PRODUCT:
      return '商品'
    case TYPE_MODULE_URL:
      return '链接 '
    case TYPE_MODULE_TAG:
      return '标签 '
  }
}

export const generateModuleOfUrl = (id, name, cover, width, height, url, showTp, chooseDate) => {
  let showTime = getShowTime(showTp, chooseDate)
  return {
    id: id,
    name: name,
    cover: cover,
    width: width,
    height: height,
    type: TYPE_MODULE_URL,
    url: url,
    show_tp: showTp,
    show_start: showTime.showStart,
    show_end: showTime.showEnd
  }
}
