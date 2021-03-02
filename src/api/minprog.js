export default {
  downloadMinrogQr(opt) {
    console.log(opt)

    var URL = '/api/a/wx/minprog/qr?'
    var URI = ''
    for (var k in opt) {
      URI = URI + k + '=' + encodeURIComponent(opt[k]) + '&'
    }

    console.log(URL + URI)
    window.open(URL + URI)
  }
}
