<template>
	<div>
		<PageHeader :prveOpt="opt"></PageHeader>
		<div id="body">
			<mt-swipe :auto="0">
			  <mt-swipe-item>
			  	<img :src="item.inParkImg || defaultImg">
			  	<p class="title">入场</p>
			  </mt-swipe-item>
			  <mt-swipe-item>
			  	<img :src="item.outParkImg || defaultImg">
			  	<p class="title">出场</p>
			  </mt-swipe-item>
			</mt-swipe>
			<div class="content">
				<p class="parkName">{{item.parkName}}</p>
				<p class="plateNumber"><i class="icon icon-plate"></i>&nbsp;&nbsp;{{item.plateNumber}}</p>
				<p><span>{{item.entryTime}}</span>入场时间</p>
				<p><span>{{item.exitTime || 未出场}}</span>出场时间</p>
				<div v-if="state != 0">
					<p><span>&yen; {{item.shouldPay}}</span>订单总额</p>
					<p class="agioMoney" v-if="item.agioMoney != 0"><span>-&yen; {{item.agioMoney}}</span>折扣金额</p>
					<p class="shouldPay">{{state == 2?'实付':'待支付'}}：&yen; {{item.shouldPay}}</p>
				</div>
			</div>
			<div class="gopay" v-show="state == 1">
				<!-- <p><i class="icon icon-gt"></i> 支付成功后，请尽快出场，超过15分钟将重新计费</p> -->
				<router-link :to="{path:'/pay',query:{backUrl:'/recordDetail',parkRecordId:item.parkRecordId}}">
					<a class="gopay-btn">去支付</a>
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
	import PageHeader from '../../components/header/header'
	export default {
	 	data () {
	    	return {
		      plateNumber: "",
		      item: {},
		      defaultImg: require('../../assets/img/1.jpg'),
		      opt: {
		        backUrl: '/parkRecord',
		        title: '停车详情'
		      }
			}
		},
		components: {
			PageHeader
		},
		mounted () {
			this.$ajax({
				method: 'post',
				url: global.AJAXURL + 'parkRecord/getDetail',
				params: {
					param: {
						"k": localStorage.TOKEN,
						"data": {
							"parkRecordId": this.$route.query.parkRecordId
						},
						"version": "V1.0"
					}
				}
			}).then((res) => {
				if (res.data.code === "0000") {
					this.item = res.data.data.ParkRecordVO;
				} else {
					this.$toast(res.data.msg);
				}
				this.$indicator.close();
			}).catch((error) => {
				this.$indicator.close();
				this.$toast(error);
			});
		},
		methods: {
		},
		computed: {
			// 判断详情状态，0：未出，1：已出未付 2： 已出已付
			state () {
				if (this.item.parkState == 1 && this.item.lackMoney > 0 && this.item.orderState == 0) {
					return 0;
				} else if (this.item.parkState == 0 && this.item.lackMoney > 0 && this.item.orderState == 0) {
					return 1;
				} else if (this.item.parkState == 0 && this.item.lackMoney == 0 && this.item.orderState == 1) {
					return 2;
				}
			}
		}
	}
</script>

<style lang="stylus" type="text/css" scoped="scoped">
#body
	background-color: #fff;
	position: absolute;
	width: 100%;
	height: 100%;
	bottom: 0px;
	.mint-swipe, .mint-swipe-items-wrap
		height: 160px;	
		.title
			position: absolute;			
			bottom: 0px;
			height: 30px;
			line-height: 30px;
			padding-left: 10px;
			width: 100%;
			color: #fff;
			background-color: rgba(0,0,0,0.5);
		img
			vertical-align: top
			width: 100%
			height: 100%
	.content
		padding: 10px;
		.parkName
			color: #000;
			font-size: 16px;
			font-weight: 700;
			margin-bottom: 12px;
		.plateNumber
			margin-bottom: 22px;
			font-size: 14px
			.icon
				display: inline-block
				margin-right: 6px
				width:17px
				height:17px
				background-repeat: no-repeat
				background-position: center
				vertical-align: top
				margin-top: 0
				&.icon-plate
					margin-top 2px
					background-image: url(icon-plate.png);
					background-size: 17px auto
		p
			margin-bottom: 6px;
			font-size: 14px
			color: #333;
			span
				color: #666;
				float: right;
		.shouldPay
			text-align: right;
			color: #000;
			font-size: 18px;
			font-weight: 700;
			margin-top: 20px;
		.agioMoney
			color: #fa7a24;
			span
				color: #fa7a24;
	.gopay
		position: absolute;
		width: 100%;
		bottom: 0;
		p
			padding-left: 10px;
			.icon-gt
				height: 14px;
				width: 14px;
				margin: 0;
		.gopay-btn
			display: block;
			width: 90%;
			height: 45px;
			line-height: 45px;
			text-align: center;
			color: #fff;
			background: #fa7a24;
			border-radius: 4px;
			font-size: 16px;
			margin: 12px auto 30px;
</style>
