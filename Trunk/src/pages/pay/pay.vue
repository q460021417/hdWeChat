<template>
	<div>
		<PageHeader :prveOpt="opt"></PageHeader>
		<div id="body">
			<div class="section">
				<h3>停车信息</h3>
				<div class="row-block">
					<div class="row" style="border:0;">
						<dl class="clearfix">
							<dt>停车场&#12288;</dt>
							<dd name="parkName">{{info.parkName}}</dd>
						</dl>
						<dl class="clearfix">
							<dt>车牌号&#12288;</dt>
							<dd name="plateNumber">{{info.plateNumber}}</dd>
						</dl>
						<dl class="clearfix">
							<dt>入场时间</dt>
							<dd name="entryTime">{{info.entryTime}}</dd>
						</dl>
						<dl class="clearfix">
							<dt>停车时长</dt>
							<dd name="parkMinuteStr">{{info.parkMinuteStr}}</dd>
						</dl>
					</div>
					<div style="border-top:1px dotted #c9c9c9;background-color: #edf4ff">
						<div class="row">
							<!-- <dl class="clearfix">
								<dt>应付金额</dt>
								<dd name="shouldPay"></dd>
							</dl> -->
							<dl class="clearfix">
								<dt>订单总额</dt>
								<dd name="shouldPay">{{info.shouldPay}}</dd>
							</dl>
							<dl class="clearfix">
								<dt>折扣金额</dt>
								<dd class="orange" name="agioMoney">{{info.agioMoney}}</dd>
							</dl>
							<dl class="clearfix">
								<dt>待支付&#12288;</dt>
								<dd class="orange" name="lackMoney">{{info.lackMoney}}</dd>
							</dl>
						</div>
					</div>
				</div>
			</div>
			<div class="section">
				<h3>支付方式</h3>
				<div class="row-block">
					<div class="row">
						<dl class="clearfix">
							<dd><i class="icon icon-ye"></i> 余额 <span class="grey">({{balance}}元)</span><a class="icon icon-empty" :class="{'icon-ok-green': iconOkGreen==4, 'icon-ok-disabled': balance<info.lackMoney || balance == 0.00}" @click="iconOkGreen = 4"></a></dd>
						</dl>
					</div>
					<div class="row">
						<dl class="clearfix">
							<dd><i class="icon icon-we"></i> 微信<a class="icon icon-empty" :class="{'icon-ok-green': iconOkGreen==2}" @click="iconOkGreen = 2"></a></dd>
						</dl>
					</div>
				</div>
			</div>
			<div class="row mt30">
				<!-- <router-link class="btn btn-block btn-orange" :to="{path:'/payOk',query:{title:'缴费成功',backUrl:'/parkPay-list'}}">确认支付</router-link> -->
				<a class="btn btn-block btn-orange" @click="pay">确认支付</a>
			</div>
		</div>
	</div>
</template>

<script>
import PageHeader from '../../components/header/header';
import wx from 'weixin-js-sdk';
export default {
  data () {
    return {
      opt: {
        backUrl: this.$route.query.backUrl,
        title: '停车缴费',
        query: {
          parkRecordId: this.$route.query.parkRecordId
        }
      },
      token: localStorage.TOKEN,
      parkRecordId: this.$route.query.parkRecordId,
      info: {},
      payConfig: {},
      balance: 0,
      iconOkGreen: 2
    }
  },
  components: {
    PageHeader
  },
  created () {
  	this.getData({
  		data: {
  			"parkRecordId": this.parkRecordId
  		}
  	});
    this.authorize();
  },
  methods: {
  	// 获取数据
    getData (opt) {
    	this.$indicator.open('加载中...')
      this.$ajax({
        method: 'post',
        url: global.AJAXURL + 'parkRecord/getDetail',
        params: {
          param: {
            "k": this.token,
            "data": opt.data,
            "version": "V1.0"
          }
        }
      })
      .then((res) => {
        if (res.data.code === '0000') {
          this.info = res.data.data.ParkRecordVO
          this.getBalance();
        } else {
        	this.$toast(res.data.msg)
        }
        this.$indicator.close()
      }, (res) => {
      	this.$indicator.close()
        this.$toast(res)
      })
    },
    // 获取用户余额
    getBalance (opt) {
      this.$ajax({
        method: 'post',
        url: global.AJAXURL + 'wechatUser/balance',
        params: {
          param: {
            "k": this.token,
            "data": {},
            "version": "V1.0"
          }
        }
      })
      .then((res) => {
        if (res.data.code === '0000') {
          let b = res.data.data.money;
          this.balance = b.toFixed(2);
          if (this.balance >= this.info.lackMoney) {
            this.iconOkGreen = 4;
          } else {
            this.iconOkGreen = 2;
          }
        } else {
          this.$toast(res.data.msg)
        }
      }, (res) => {
        this.$toast(res)
      })
    },
  	// 支付页面授权
  	authorize () {
			this.$ajax({
        method: 'post',
        url: global.AJAXURL + 'pay/authorize',
        params: {
          param: {
            "k": this.token,
            "data": {
            	href: window.location.href
            },
            "version": "V1.0"
          }
        }
      })
      .then((res) => {
        if (res.data.code === '0000') {
        	wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.data.authConfig.appid, // 必填，公众号的唯一标识
            timestamp: res.data.data.authConfig.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.data.authConfig.noncestr, // 必填，生成签名的随机串
            signature: res.data.data.authConfig.signature, // 必填，签名，见附录1
            jsApiList: ["chooseWXPay", "closeWindow"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
        } else {
        	this.$toast(res.data.msg)
        }
        this.$indicator.close()
      }, (res) => {
      	this.$indicator.close()
        this.$toast(res)
      })
  	},
  	// 调用微信JS api 支付
		callpay (payParam) {
	    if (typeof WeixinJSBridge === "undefined") {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', this.jsApiCall, false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', this.jsApiCall);
          document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall);
        }
	    } else {
        this.jsApiCall(payParam);
	    }
		},
		jsApiCall (payParam) {
	    wx.chooseWXPay({
	    	appId: payParam.appId,
        timestamp: payParam.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: payParam.nonceStr, // 支付签名随机串，不长于 32 位
        package: payParam.pack, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
        // signType: payParam.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        signType: 'MD5',
        paySign: payParam.paySign, // 支付签名
        success: (res) => {
          let instance = this.$toast('支付成功');
          setTimeout(() => {
            instance.close();
            this.$router.replace({
              path: this.opt.backUrl,
              query: {
                parkRecordId: this.parkRecordId
              }
            });
          }, 2000);
        },
        fail: (res) => {
          this.$toast('支付失败');
        },
        cancel: (res) => {
          this.$toast('支付失败');
        }
	    });
		},
    // 获取支付信息
    pay () {
      this.$ajax({
        method: 'post',
        url: global.AJAXURL + 'pay/singleRecord/pay',
        params: {
          param: {
            "k": this.token,
            "data": {
				  		"parkRecordId": this.parkRecordId,
				  		"deviceInfo": "WEB",
				  		"tradeType": "JSAPI",
				  		"source": "wechat",
				  		"type": this.iconOkGreen
			  		},
            "version": "V1.0"
          }
        }
      })
      .then((res) => {
        if (res.data.code === '0000') {
          if (this.iconOkGreen == 2) {
            this.callpay(res.data.data.payConfig);
          } else {
            let instance = this.$toast('支付成功');
            setTimeout(() => {
              instance.close();
              this.$router.replace({
                path: this.opt.backUrl,
                query: {
                  parkRecordId: this.parkRecordId
                }
              });
            }, 2000);
          }
        } else {
        	this.$toast(res.data.msg)
        }
        this.$indicator.close()
      }, (res) => {
      	this.$indicator.close()
        this.$toast(res)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .icon-ok-disabled
    pointer-events: none;
</style>

