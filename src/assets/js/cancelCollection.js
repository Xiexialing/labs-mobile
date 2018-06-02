/**
 * Created by Administrator on 2018/5/8/008.
 */
let target
let getTargetNode = function (ele) {
  if (ele) {
    if (ele.className === 'article-list') {
      target = ele
    } else {
      getTargetNode(ele.parentNode)
    }
  }
}

export default {
  swipe (el) {
    let x, y, X, Y, swipeX, swipeY
    el.addEventListener('touchstart', function (event) {
      x = event.changedTouches[0].pageX
      y = event.changedTouches[0].pageY
      swipeX = true
      swipeY = true
    })
    el.addEventListener('touchmove', function (event) {
      X = event.changedTouches[0].pageX
      Y = event.changedTouches[0].pageY
      // 左右滑动
      if (swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0) {
        // 阻止事件冒泡
        event.stopPropagation()
        getTargetNode(event.target)   // 获取目标元素
        if (X - x > 15) {   // 右滑
          event.preventDefault()
          target.className = 'article-list swiperright'  // 右滑收起
        }
        if (x - X > 15) {   // 左滑
          event.preventDefault()
          let children = el.getElementsByClassName('article-list')
          for (let i = 0; i < children.length; i++) {
            children[i].className = 'article-list'
          }
          target.className = 'article-list swiperleft'  // 左滑展开
        }
        swipeY = false
      }
      // 上下滑动
      if (swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
        swipeX = false
      }
    })
  }
}
