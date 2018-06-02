<template>
  <div class="advice-feedback">
    <form>
      <div class="form-group">
        <textarea :class="{error: errorNo===1}" @blur="adviceCheck" placeholder="请输入您的宝贵意见（100字以内 ）" v-model.trim="feedback"
                  ref="feedback"></textarea>
      </div>
      <div class="form-group">
        <input type="text" placeholder="联系方式（选填）：" v-model.trim="phone">
      </div>
      <p class="suggest">建议您留下联系方式，这样会更快收到我们的回复哦</p>
      <div class="form-group">
        <button type="button" @click="submitForm">提<span style="opacity: 0;">提交</span>交</button>
        <button type="button" class="right" @click="cancel">取<span style="opacity: 0;">取消</span>消</button>
      </div>
    </form>
  </div>
</template>

<script>
  import validate from '@/assets/js/validate'
  import api from '@/config/api'
  import interact from '@/config/interact'

  export default{
    data () {
      return {
        feedback: '',
        phone: '',
        errorNo: null
      }
    },
    mounted () {
      this._initForm()
    },
    methods: {
      _initForm () {
        this.$refs.feedback.focus()
      },
      adviceCheck () {
        if (!this.feedback) {
          this.$message.error('反馈不能为空！')
          this.errorNo = 1
          return false
        }
        if (!validate.lengthLimit(this.feedback, 1, 100)) {
          this.$message.error('反馈在100字以内！')
          this.errorNo = 1
          return false
        }
        this.errorNo = null
        return true
      },
      submitForm () {
        if (!this.adviceCheck()) {
          return false
        }
        let data = {
          feedback: this.feedback
        }
        if (this.phone) {
          data.phone = this.phone
        }
        interact.interact('POST', api['feedback'], data, (res) => {
          this.$message.success('提交成功！')
//          this.$router.push('/home')
        })
      },
      cancel () {
        this.$router.push('/home')
      }
    }
  }
</script>

<style lang='less'>
  @import "../../assets/less/base";

  .advice-feedback {
    height: 100%;
    background-color: @color-white;
    padding: 0 20px;
    box-sizing: border-box;
    form {
      .form-group {
        font-size: 0;
        input, textarea {
          border-radius: 4px;
          font-size: @font-size14;
          box-sizing: border-box;
          color: #A4ABB1;
          width: 100%;
          font-family: inherit;
          padding: 10px;
          margin-bottom: 10px;
        }
        textarea {
          margin-top: 20px;
          height: 145px;
          line-height: 14px;
          letter-spacing: 1px;
        }
        input {
          height: 40px;
        }
        input::-webkit-input-placeholder {
          color: #A4ABB1;
        }
        textarea::-webkit-input-placeholder {
          color: #A4ABB1;
        }
        button {
          width: 157px;
          height: 40px;
          border-radius: 4px;
          background-color: @color-4895FD;
          color: @color-white;
          font-size: @font-size16;
          border: none;
        }
      }
      .suggest {
        text-align: center;
        font-size: @font-size14;
        color: @color-3D465B;
        margin-bottom: 47px;
        line-height: 14px;
        height: 14px;
      }
    }
  }
</style>
