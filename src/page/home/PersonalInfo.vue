<template>
  <div class="personal-info">
    <ul>
      <li>
        <el-upload
          class="pic-uploader"
          action="/admin/upload/do_upload_image"
          capture="camera"
          name="userfile"
          :show-file-list="false"
          :on-success="handlePicSuccess"
          :before-upload="beforeAvatarUpload">
          <img :src="userInfo.head_img?userInfo.head_img:require('../../assets/images/header.png')" alt=''>
          <i></i>
        </el-upload>
      </li>
      <li @click="toNickname">昵称<i></i><span>{{userInfo.account}}</span></li>
      <li @click="toPersonalIntro">
        一句话简介<i></i><span>{{userInfo.user_desc ? userInfo.user_desc : '用户太忙，暂无内容。'}}</span></li>
    </ul>
  </div>
</template>

<script>
  import store from '@/vuex'
  import {mapState, mapActions} from 'vuex'
  import api from '@/config/api'
  import interact from '@/config/interact'

  export default{
    data () {
      return {
        imageUrl: ''
      }
    },
    methods: {
      ...mapActions(['modifyUserInfoAction']),
      toNickname () {
        this.$router.push('/nickName')
      },
      toPersonalIntro () {
        this.$router.push('/personalIntro')
      },
      modifyHeadImg () {
        let data = {
          head_img: this.imageUrl
        }
        interact.interact('POST', api['modifyUserInfo'], data, (res) => {
          this.$message.success('头像修改成功!')
          this.modifyUserInfoAction({
            head_img: this.imageUrl
          })
        })
      },
      handlePicSuccess (res) {
        if (res.code === '000000') {
          this.imageUrl = res.result.file_path
          this.modifyHeadImg()
        }
      },
      beforeAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        const isLt5M = file.size / 1024 / 1024 < 2
        if (!isJPG && !isPNG) {
          this.$message.warning('上传的图片只能是 JPG或者PNG 格式!')
        }
        if (!isLt5M) {
          this.$message.error('上传的图片大小只能在2M以内')
        }
        return isJPG || isPNG || isLt5M
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    store
  }
</script>

<style lang='less'>
  @import "../../assets/less/base.less";

  .personal-info {
    ul {
      li {
        height: 4.8*@height;
        line-height: 4.8*@height;
        color: @color-3D465B;
        font-size: @font-size16;
        margin-bottom: 1px;
        background-color: @color-white;
        padding: 0 1.5*@padding 0 2*@padding;
        box-sizing: border-box;
        .pic-uploader {
          height: inherit;
          .el-upload {
            width: 100%;
            height: inherit;
            text-align: left;
          }
        }
        &:first-child {
          margin-bottom: 1.1*@margin;
          background-color: @color-white;
          height: 8*@height;
          line-height: 8*@height;
          img {
            display: inline-block;
            vertical-align: middle;
            width: 6*@width;
            height: 6*@height;
            border-radius: 50%;
          }
        }
        i {
          float: right;
          width: 24px;
          height: inherit;
          background: url("../../assets/images/right-arrow.png") no-repeat center;
        }
        span {
          float: right;
          font-size: @font-size14;
          color: @color-7A869D;
          margin-right: 1.8*@margin;
        }
      }
    }
  }
</style>
