<template>
	<div class="parkList-detail">
		<PageHeader :prveOpt="opt"></PageHeader>
		<div id="body" class="detail-wrapper">
			<div class="banner">
				<div class="banner-container" id="banner-container">
					<img class="img" :src="park.image">
				</div>
			</div>
			<div class="name">
				<div class="name-left">
				<h2 class="title">{{park.parkName}}</h2>
				<p class="dec">{{park.address}}</p>
				</div>
				<div class="name-right" @click="openMap">
					<img src="./tccxq_gps.png" width="20" height="20" alt="">
				</div>
			</div>
			<div class="detail">
				<ul class="detail-container">
					<li class="item">
						<span class="left">费用</span>
						<span class="right rule" @click="_showModule(park.chargeType)">计费规则</span>
					</li>
					<li class="item">
						<span class="left">车位</span>
						<span class="right">{{park.totalSpace}}个</span>
					</li>
					<li class="item">
						<span class="left">类型</span>
						<span class="right" v-if="park.parkType==0">地上</span>
						<span class="right" v-if="park.parkType==1">地下</span>
						<span class="right" v-if="park.parkType==2">地上/地下</span>
						<span class="right" v-if="park.parkType==3">路侧泊车点</span>
					</li>
				</ul>
			</div>
		</div>
		<PayRule v-show="showModule" @isShow="isShowModule" :chargeType="chargeType"></PayRule>
	</div>
</template>
<script>
import PageHeader from '../../components/header/header'
import PayRule from '../../components/pay-rule/pay-rule'
import wx from 'weixin-js-sdk';
	export default {
		data () {
			return {
				opt: {
        	backUrl: this.$route.query.backUrl,
        	title: '停车场详情'
      	},
      	showModule: false,
      	isMove: false,
      	timer: null,
      	park: this.$route.query,
      	chargeType: 0
			}
		},
		components: {PageHeader, PayRule},
		created () {
			this.refreshOnce();
			this.$nextTick(() => {
				this.getPosition();
      })
		},
		methods: {
			refreshOnce () {
         if (location.href.indexOf("&refreshSign=") < 0) {
             location.href = location.href + "&refreshSign=" + Math.random();
         }
      },
			show () {
				this.isMove = true;
			},
			_showModule (type) {
				this.chargeType = Number(type);
				this.showModule = true;
			},
			isShowModule (isShow) {
				this.showModule = isShow;
			},
			getPosition () {
			this.$ajax({
        method: 'post',
        url: global.AJAXURL + 'pay/authorize',
        params: {
          param: {
            "data": {"href": window.location.href},
            "version": "V1.0"
          }
        }
      }).then((res) => {
      	if (res.data.code === "0000") {
	      	let response = res.data.data.authConfig;
					wx.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: response.appid, // 必填，公众号的唯一标识
						timestamp: response.timestamp, // 必填，生成签名的时间戳
						nonceStr: response.noncestr, // 必填，生成签名的随机串
						signature: response.signature, // 必填，签名，见附录1
						jsApiList: ["openLocation"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					});
      	}
      }, (res) => {
				this.$indicator.close();
        this.$toast(res);
      })
			},
			openMap () {
				wx.openLocation({
					latitude: parseFloat(this.park.lat),
					longitude: parseFloat(this.park.lng),
					name: this.park.parkName,
					address: this.park.address,
					scale: 14,
					infoUrl: ''
				});
			}
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/mixin.styl"
.parkList-detail
	position:fixed
	top:0
	left:0
	bottom:0
	z-index:10
	width:100%
	background:#eee
	transform:traslate3d(0,0,0)
	&.move-enter-active,&.move-leave-active
		transition all 0.5s
	&.move-enter,&.move-leave-active
		transform:translate3d(100%,0,0)
	.detail-wrapper
		.banner
			width:100%
			height:175px
			.banner-container
				overflow:hidden
				width:100%
				img
					height:175px
					width:100%
					background:blue
					display:block
					float:left
		.name
			padding:12px
			background:#fff
			overflow hidden
			.name-left
				float left
				.title
					font-size:20px
				.dec
					margin-top:5px
					color:#999
			.name-right
				padding 9px 0 0 9px
				float right 
				background:#009fe8
				width:40px
				height:40px					
		.detail
			margin-top:10px
			.detail-container
				background:#fff
				padding:0 12px
				.item
					overflow: hidden
					padding:12px 0
					color:#333
					border-1px(#ccc)
					font-size:14px
					&:last-child
						border-none()
				.left
					float: left
				.right
					float: right
				.rule
					color:#009fe8					
</style>
