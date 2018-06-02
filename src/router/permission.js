/**
 * Created by Administrator on 2018/5/12/012.
 */
import permitList from './permitList'

export default {
  isLogin (to, from, next) {
    // let id = sessionStorage.getItem('id')
    // let path = to.path
    // if (permitList.loginRouter[path]) {
    //   if (id) {
    //     next()
    //   } else {
    //     next('/login')
    //   }
    // } else if (path === '/login' && id) {
    //   next('/')
    // } else {
      next()
    // }
  }
}
