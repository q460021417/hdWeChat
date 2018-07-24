<template>
  <div>
  	<PageHeader :prveOpt="option"></PageHeader>
  	<div id="body">
  		<div class="tip">您正在为<span class="green">{{phoneNum}}</span>账户进行充值</div>
	  	<ul class="money-list">
	  		<li v-for="(item,index) in itemList" :class="{active: index == count}" @touchstart="count = index; money = item;">
	  			{{item}}元
	  		</li>
	  	</ul>
	  	<div class="otherMoney">
	  		<p class="title">其他金额</p>
	  		<input type="number" name="money" class="money" v-model="money" ref="chargeMoney" placeholder="请输入至少1元"/>
	  	</div>
	  	<div class="makeSure" @click="recharge">
	  		确认充值
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
    	itemList: [25, 50, 100, 150, 300, 500],
    	option: {
    		backUrl: '/personCenter',
    		title: '充值'
    	},
    	phoneNum: '',
    	money: '',
    	needMoney: 0
    }
  },
  computed: {
  	count () {
  		if (this.money !== "") {
				if (this.money < 1) {
	  			return -1;
	  		} else {
	  			let _index = this.itemList.indexOf(this.money);
	  			if (_index != -1) {
	  				return _index;
	  			}
	  			return -1;
	  		}
  		}
  		return 0;
  	}
  },
  components: {
  	PageHeader
  },
  methods: {
  	// 查询需要充值金额
  	needChargeMoney () {
  		this.$ajax({
				method: 'post',
			  url: global.AJAXURL + 'wechatUser/needChargeMoney',
			  params: {
			  	param: {
			  		"k": localStorage.TOKEN
					}
			  }
			}).then((res) => {
				if (res.data.code === "0000") {
					this.needMoney = res.data.data.money;
					if (this.needMoney > 1) {
						this.$refs.chargeMoney.placeholder = `请输入至少${this.needMoney}元`;
					}
				}	else {
			 		this.$toast(res.data.msg);
			 	}
			}, (res) => {
        this.$toast(res);
		  });
  	},
  	// 支付页面授权
  	authorize () {
			this.$ajax({
        method: 'post',
        url: global.AJAXURL + 'pay/authorize',
        params: {
          param: {
            "k": localStorage.TOKEN,
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
            this.$router.replace(this.option.backUrl);
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
  	recharge () {
  		if (this.$route.query.balance < this.needMoney) {
  			if (this.needMoney > 1) {
	  			if (this.money < this.needMoney) {
	  				this.$toast(`充值金额不能小于欠费金额${this.needMoney}元`);
	  				return;
	  			}
	  		} else {
	  			if (this.money < 1) {
	  				this.$toast(`充值金额不能小于最低金额1元`);
	  				return;
	  			}
	  		}
  		} else {
  			if (this.money < 1) {
  				this.$toast(`充值金额不能小于最低金额1元`);
  				return;
  			}
  		}
  		this.$indicator.open('加载中...');
		this.$ajax({
			method: 'post',
			  url: global.AJAXURL + 'pay/recharge/config',
			  params: {
			  	param: {
			  		"k": localStorage.TOKEN,
						"data": {
							"money": this.count < 0 ? this.money : this.itemList[this.count],
							"deviceInfo": "WEB",
							"tradeType": "JSAPI"
						},
						"version": "V1.0"
					}
			  }
			}).then((res) => {
				if (res.data.code === "0000") {
					this.callpay(res.data.data.payConfig);
				}	else {
			 		this.$toast(res.data.msg);
			 	}
			 	this.$indicator.close();
		}).catch((error) => {
		    this.$indicator.close();
        this.$toast(error);
		  });
  	}
  },
  mounted () {
  	this.$indicator.open('加载中...');
		this.$ajax({
			method: 'post',
			  url: global.AJAXURL + 'userdetail/getUserDetail',
			  params: {
			  	param: {
			  		"k": localStorage.TOKEN,
						"data": {},
						"version": "V1.0"
					}
			  }
			}).then((res) => {
				if (res.data.code === "0000") {
					let dataJson = res.data.data.UserDetail;
					this.phoneNum = dataJson.mobile;
				}	else {
			 		this.$toast(res.data.msg);
			 	}
			 	this.$indicator.close();
		}).catch((error) => {
		    this.$indicator.close();
        this.$toast(error);
		  });
		this.needChargeMoney();
		this.authorize();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.tip
	height: 60px
	background: #fff
	text-align: center
	line-height: 60px
	font-size: 14px
.money-list
	display: flex;
	flex-wrap: wrap;
	padding: 10px 10px 0;
	li
		box-sizing: border-box;
		width: 30%;
		height: 40px;
		border-radius: 4px;
		background: #fff;
		border: 1px solid #ccc;
		text-align: center;
		line-height: 40px;
		margin-bottom: 10px;			
		font-size: 14px;
		margin-right: 5%;		
		&:nth-of-type(3n)
			margin-right: 0px;
		&.active
			color: #fff;
			background: #fa7a24;
			border: 1px solid #fa7a24;
.otherMoney
	padding: 10px;
	.title
		color: #666;
		margin-bottom: 10px;
	.money
		height: 45px;		
		width: 100%;
		border: 1px solid #ccc;
		border-radius: 4px;
.makeSure
	width: 85%;
	height: 45px;
	line-height: 45px;
	text-align: center;
	color: #fff;
	background: #fa7a24;
	border-radius: 4px;
	font-size: 16px;
	margin: 35px auto;
</style>
