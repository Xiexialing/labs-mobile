/**
 * Created by THINKPAD on 2018/1/30.
 */
import DateFormat from 'dateformat-util'

export default{
  countMinutes (value) {
    let time = (new Date() / 1000 - value) / 60
    if (time < 60) {
      return Math.floor(time) + '分钟前'
    } else if (time < 60 * 24) {
      return Math.floor(time / 60) + '小时前'
    } else if (time / (24 * 60) <= 7) {
      return Math.floor(time / (24 * 60)) + '天前'
    } else if (DateFormat.format(new Date(value * 1000), 'yyyy') == new Date().getFullYear()) {
      return DateFormat.format(new Date(value * 1000), 'MM-dd')
    } else {
      return Number(new Date().getFullYear()) - Number(DateFormat.format(new Date(value * 1000), 'MM-dd')) + '年前'
    }
  },
  dateFormat (value, fmt) {
    if (fmt) {
      return DateFormat.format(new Date(value * 1000), fmt)
    } else {
      return DateFormat.format(new Date(value * 1000))   // 不传 fmt，则默认为 yyyy-MM-dd hh:mm:ss
    }
  },
  wordsNumberFilter (value, number) {  // 截取指定长度的字符串
    if (value && value.length <= number) {
      return value
    }
    if (value) {
      return value.split('').slice(0, number + 1).join('') + '...'
    }
  },
  highlight (value, word) {
    word = word.trim()
    if (!word) {
      return value
    }
    let reg = new RegExp(word, 'ig')
    return value.replace(reg, '<span class="red">' + word + '</span>')
  }
}
