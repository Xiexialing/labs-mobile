/**
 * Created by Administrator on 2018/5/4/004.
 */
import Vue from 'vue'

export default {
  modifyUserInfo (state, obj) {
    if (JSON.stringify(obj) !== '{}') {
      for (let key in obj) {
        Vue.set(state.userInfo, key, obj[key])
      }
    } else {
      for (let key in state.userInfo) {
        Vue.delete(state.userInfo, key)
      }
    }
  }
}
