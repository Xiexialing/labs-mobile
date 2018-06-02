/**
 * Created by Administrator on 2018/3/23/023.
 */
window.onload = function () {
  let self = this
  document.addEventListener('touchstart', function (e) {
    self.moveY = e.targetTouches[0].pageY
  })
  document.addEventListener('touchmove', function (e) {
    e.preventDefault()
    let moveWidth = self.moveY - e.targetTouches[0].pageY
    if (moveWidth !== 0) {
      document.body.scrollTop += moveWidth
    }
  })
  document.addEventListener('touchmove', function (e) {
    e.preventDefault()
  })
}
