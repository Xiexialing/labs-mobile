/**
 * Created by Administrator on 2018/3/23/023.
 * 移动端滑动事件
 */
export default {
  touchX (el, callback) {
    let startX = 0
    let endX = 0
    let distanceX = 0
    el.addEventListener('touchstart', function (event) {
      let touch = event.targetTouches[0]
      startX = touch.pageX  // 滑动起点的坐标
    }, true)
    el.addEventListener('touchmove', function (event) {
      // let touch = event.targetTouches[0]
      // endX = touch.pageX         // 手势滑动时，手势坐标不断变化，取最后一点的坐标为最终的终点坐标
      // distanceX = endX - startX
      // if (distanceX > 0) {
      //   let moveX = 1.2 * distanceX
      //   el.style.transform = 'translate3d(' + moveX + 'px,0,0)'
      // }
    }, true)
    el.addEventListener('touchend', function (event) {
      let touch = event.changedTouches[0]
      endX = touch.pageX         // 手势滑动时，手势坐标不断变化，取最后一点的坐标为最终的终点坐标
      distanceX = endX - startX
      // 判断是否滑动了，而不是屏幕上单击了
      let dpr = window.devicePixelRatio
      let relativeDistance = 50
      if (distanceX >= dpr * relativeDistance) {
        // 在向右滑动距离超过dpr * relativeDistancepx，执行回调函数
        el.style.transform = 'translate3d(100%,0,0)'
        if (callback) {
          callback()
        }
      } else {
        el.style.transform = 'translate3d(0,0,0)'
      }
      distanceX = startX = endX = 0
    }, true)
  }
}
