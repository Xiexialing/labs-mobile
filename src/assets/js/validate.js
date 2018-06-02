/**
 * Created by Administrator on 2018/5/4/004.
 */
export default {
  isAccount (val) {
    // return /^1[34578]\d{9}$/.test(val) || /^[A-Za-z\d]+([-_][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(val)
    return /^1[34578]\d{9}$/.test(val)
  },
  password (val) {
    return (/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{6,20}$/.test(val))
  },
  authCode (val) {
    return /^\d{6}$/.test(val)
  },
  lengthLimit (val, min, max) {
    return val.length >= min && val.length <= max
  }
}
