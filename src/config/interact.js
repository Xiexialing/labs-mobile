/**
 * Created by Administrator on 2018/3/19/009.
 */
import axios from 'axios'

export default {
  interact (method, url, data, callback) {
    axios({
      method: method,
      data: data,
      url: url
    }).then((response) => {
      if (response.data.code === '000000') {
        if (callback) {
          callback(response.data.result)
        }
      } else {
        console.log('系统异常，请刷新页面')
      }
    })
  },
  userInter (method, url, data, callback) {
    axios({
      method: method,
      data: data,
      url: url
    }).then((response) => {
      callback(response.data)
    })
  }
}
