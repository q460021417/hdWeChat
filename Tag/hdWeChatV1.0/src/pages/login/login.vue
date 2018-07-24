<template>
  <div>
    <div id="body">
      <form id="login-form">
        <h1>注册登录</h1>
        <div class="form-group">
          <input class="form-control" type="text" maxlength="11" name="phoneNumber" placeholder="请输入手机号" v-model="phoneNumber">
          <a class="btn-getCode" :class="{'disabled':isSendCode===sendCodeAgain}" @click="getCode">{{sec}}</a>
        </div>
        <div class="form-group">
          <input class="form-control" type="text" maxlength="4" name="passcode" placeholder="请输入验证码" v-model="passcode">
        </div>
        <p><i class="icon icon-ok-grey" :class="{'icon-ok-green': iconOk}" @click="iconOk = !iconOk"></i> 我已阅读并接受<router-link class="orange" :to="{path:'/agreement',query:{backUrl:'/login',title:'邯郸服务协议'}}">《邯郸服务协议》</router-link></p>
        <a class="btn btn-block" :class="!isSubmit?'disabled':'btn-orange'" @click="login">登录</a>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      phoneNumber: '',
      passcode: '',
      sec: '获取验证码',
      iconOk: true,
      sendCodeAgain: true
    }
  },
  computed: {
    isSendCode () {
      return !this.isSend();
    },
    isSubmit () {
      return !this.isSendCode && this.isLogin() && this.iconOk;
    }
  },
  methods: {
    // 是否是手机号
    isSend () {
      let b = false;
      let phone = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
      if (this.phoneNumber != '' && phone.test(this.phoneNumber)) {
          b = true;
      }
      return b;
    },
    // 判断验证码
    isLogin () {
      let b = false;
      let num = /^\d{4}$/;
      if (this.passcode != '' && num.test(this.passcode)) {
          b = true;
      }
      return b;
    },
    // 获取验证码
    getCode () {
      this.sendCodeAgain = false;
      let s = 59;
      let timer = setInterval(() => {
        if (s != 0) {
          this.sec = s-- + 's';
        } else {
          clearInterval(timer);
          this.sec = '重新获取';
          s = 10;
          this.sendCodeAgain = true;
        }
      }, 1000);
      this.$ajax({
        method: 'post',
        url: global.AJAXURL + 'passcode/send',
        params: {
          param: {
            "data": {phoneNumber: this.phoneNumber},
            "version": "V1.0"
          }
        }
      })
      .then((res) => {
        if (res.data.code === '0000') {
          this.$toast(res.data.msg);
        } else {
          s = 59;
          clearInterval(timer);
          this.$toast(res.data.msg);
        }
      }, (res) => {
        s = 59;
        clearInterval(timer);
        this.$toast(res.data.msg)
      })
    },
    // 登录
    login () {
      this.$ajax({
        method: 'post',
        url: global.AJAXURL + 'wechatUser/bind',
        params: {
          param: {
            "data": {
              phoneNumber: this.phoneNumber,
              passcode: this.passcode,
              source: 'wechat',
              openId: localStorage.OPENID
            },
            "version": "V1.0"
          }
        }
      })
      .then((res) => {
        if (res.data.code === '0000') {
          let data = res.data.data;
          localStorage.OPENID = data.openId;
          localStorage.TOKEN = data.token;
          localStorage.ISBIND = data.isBind;
          if (this.$route.query.redirect) {
            this.$router.replace(this.$route.query.redirect);
          } else {
            this.$router.replace('/personCenter');
          }
        } else {
          this.$toast(res.data.msg);
        }
      }, (res) => {
        this.$toast(res.data.msg);
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #login-form{
    padding-top:6rem;
    margin-left:20px;
    margin-right:20px;
  }

  #login-form h1{
    margin-bottom:3rem;
    font-size:21px;
    text-align: center;
    color:#323232;
  }

  #login-form p{
    font-size: 10px;
    color:#666;
    margin-bottom:3rem;
  }

  .btn-getCode{
    width:110px;
    position: absolute;
    top:0;
    right:0;
    bottom:0;
    padding:12px 10px;
    font-size: 14px;
    color:#fa7a24;
    text-align: center;
  }

  .btn-getCode:before{
    position: absolute;
    left:0;
    content:'';
    width:1px;
    height:19px;
    background-color:#fa7a24;
  }

  .btn-getCode.disabled{
    pointer-events:none;
    color:#c9c9c9;
    background:none;
  }

  .btn-getCode.disabled:before{
    background-color:#c9c9c9;
  }

  .pop-rules{
    max-height: 400px;
    overflow-y:auto;
  }

  .pop-rules.layui-m-layerchild h3{
    padding: 20px 10px 15px;
    line-height: 26px;
    font-size: 16px;
    font-weight: 400;
    border-radius: 5px 5px 0 0;
    white-space: normal;
  }

  .pop-rules .layui-m-layercont{
    padding:0 15px 15px;
    text-align: left;
  }

  .pop-rules .layui-m-layercont p{
    text-indent: 28px;
  }
</style>
