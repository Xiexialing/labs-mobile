// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'lib-flexible'
import 'swiper/dist/css/swiper.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'babel-polyfill'
import VueLazyload from 'vue-lazyload'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/reset.css'
import selfFilter from './filter'
import App from './App'
import router from './router'
import vueInfiniteScroll from 'vue-infinite-scroll'
import VueScroll from 'vue-scroll'
import permission from './router/permission'

Vue.use(VueAwesomeSwiper)
Vue.use(vueInfiniteScroll)
Vue.use(VueScroll)
Vue.use(ElementUI)
Vue.filter('countMinutes', selfFilter.countMinutes)
Vue.filter('dateFormat', selfFilter.dateFormat)
Vue.filter('wordsNumberFilter', selfFilter.wordsNumberFilter)
Vue.filter('highlight', selfFilter.highlight)
Vue.use(VueLazyload, {
  loading: require('./assets/images/loading.gif'),  // 这个是加载的loading过渡效果
  error: require('./assets/images/default.png')
})
router.beforeEach(permission.isLogin)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
