const getImageSize = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (result) => {
      const data = result.target.result
      const image = new Image()
      image.onload = () => {
        resolve({
          width: image.width,
          height: image.height
        })
      }
      image.onerror = (imgErr) => {
        reject(imgErr)
      }
      image.src = data
    }
    reader.onerror = (rdrErr) => {
      reject(rdrErr)
    }
    reader.readAsDataURL(file)
  })
}

export default {
  getImageSize
}
