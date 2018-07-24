<template>
	<div>
		<PageHeader :prveOpt="opt"></PageHeader>
		<div id="body">
			<div class="section">
				<h3>停车信息</h3>
				<div class="row-block">
					<div class="row" style="border:0;">
						<dl class="clearfix">
							<dt>车牌号&#12288;</dt>
							<dd name="plateNumber">{{info.plateNumber}}</dd>
						</dl>
						<dl class="clearfix">
							<dt>需缴金额</dt>
							<dd name="lackMoney">{{info.lackMoney || 0}}元</dd>
						</dl>
					</div>
				</div>
			</div>
			<div class="section">
				<div class="row">
					<a class="btn btn-block btn-orange" :to="{path:'/payOk',query:{title:'缴费成功',backUrl:'/fastPay'}}" @click="pay">确认支付</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import PageHeader from '../../components/header/header';
	import wx from 'weixin-js-sdk';
	export default{
		data () {
	    return {
	      opt: {
	        backUrl: this.$route.query.backUrl,
	        title: '停车缴费'
	      },
	      info: this.$route.query
	    }
	  },
	  components: {
	    PageHeader
	  },
	  created () {
	  	this.authorize();
	  },
	  methods: {
	  	// 支付页面授权
	  	authorize () {
				this.$ajax({
	        method: 'post',
	        url: global.AJAXURL + 'pay/authorize',
	        params: {
	          param: {
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
	              path: '/payOk',
	              query: {
	              	title: '缴费成功',
	              	backUrl: '/fastPay'
	              }
	            })
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
	        url: global.AJAXURL + 'pay/nonMemberreCharge/config',
	        params: {
	          param: {
	            "data": {
	            	"openId": localStorage.OPENID,
					  		"money": this.info.lackMoney,
					  		"plateNumber": this.info.plateNumber,
					  		"deviceInfo": "WEB",
					  		"tradeType": "JSAPI"
				  		},
	            "version": "V1.0"
	          }
	        }
	      })
	      .then((res) => {
	        if (res.data.code === '0000') {
	          this.callpay(res.data.data.payConfig);
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
