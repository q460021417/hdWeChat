<template>
	<div class="parkInfo">
		<PageHeader :prveOpt="opt"></PageHeader>
		<div class="parkInfo-list" ref="parkInfoLlist" v-show="items.length>0">
			<mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :auto-fill="false" ref="loadmore">
				<ul class="parkInfo-items">
					<li class="item border-1px" v-for="item in items" @click="showDetail(item)" >
						<div class="item-wrapper">
							<div class="item-left">
								<img :src="item.image" alt="">
							</div>
							<div class="item-right">
								<div class="name">
									<h2 class="title">{{item.parkName}}</h2>
									<div class="distance">{{item.dis | round}}m</div>
								</div>
								<p class="address">{{item.address}}</p>
								<div class="car-num">
									<div class="left">
										<span class="title">车位: </span>
										<span class="surplus">{{item.emptySpace}}/</span><span class="total">{{item.totalSpace}}</span>
									</div>
									<div class="right" @click.stop.prevent="_showModule(item.chargeType)">
										<span class="rule">计费规则</span>
									</div>
								</div>
								<div class="position-wrapper">
									<span class="position" v-if="item.parkType==0">地上</span>
									<span class="position" v-if="item.parkType==1">地下</span>
									<span v-if="item.parkType==2">
										<span class="position">地上</span>
										<span class="position">地下</span>
									</span>
									<span class="position" v-if="item.parkType==3">路侧</span>
									<span class="pay" v-show="item.isPartner != 2">在线付</span>
									<span class="working" v-show="item.parkStatus == 1">施工中</span>
								</div>
							</div>
						</div>
					</li>
				</ul>
			</mt-loadmore>
		</div>
		<div class="noPark" v-show="items.length===0">
			<img src="./noRecord.png" alt="">
			<h2 class="title">
				您附近没有停车场
			</h2>
		</div>
		<transition name="pay">
			<PayRule  v-show="showModule" @isShow="isShowModule" :chargeType="chargeType"></PayRule>
		</transition>	
	</div>
</template>
<script>
import PageHeader from '../../components/header/header';
import PayRule from '../../components/pay-rule/pay-rule';
import wx from 'weixin-js-sdk';
	export default {
		data () {
			return {
				opt: {
        	backUrl: '',
        	title: '车场信息'
      	},
	      selectPark: {},
	      pageNum: 1,
	      pageSize: 10,
	      items: [],
	      showModule: false,
	      pos: {},
	      chargeType: 0
			}
		},
		watch: {
			pos (val, oldVal) {
				if (val.latitude === oldVal.latitude && val.longitude === oldVal.longitude) {
					return;
				}
				this.getListData({
	 				data: {
	 				 	lat: val.latitude,
					  lng: val.longitude,
						lat1: val.latitude,
						lng1: val.longitude
	 				},
	  			pageNum: this.pageNum
	    	})
			}
		},
		components: {PageHeader, PayRule},
		created () {
			this.$indicator.open('加载中...');
			this.getPosition();
		},
		filters: {
			round (val) {
				return parseInt(val);
			}
		},
		methods: {
			showDetail (park) {
				this.selectPark = park;
				this.selectPark.backUrl = '/parkInfo-list';
				this.$router.replace({
					path: '/parkList-detail',
					query: this.selectPark
				});
			},
			getPosition () {
				this.$ajax({
	        method: 'post',
	        url: global.AJAXURL + 'pay/authorize',
	        params: {
	          param: {
	          	"k": localStorage.TOKEN,
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
							jsApiList: ['getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
						});
						wx.ready(() => {
							wx.getLocation({
				    		type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
				    		success: (res) => {
					       	this.pos = res;
						    }
							});
						});
	      	}
	      }, (res) => {
					this.$indicator.close();
	        this.$toast(res);
	      })
			},
			_showModule (type) {
				this.chargeType = Number(type);
				this.showModule = true;
			},
			isShowModule (isShow) {
				this.showModule = isShow;
			},
			    // 下拉刷新
	    loadTop () {
	      var _this = this;
	      _this.pageNum = 1;
	      var timer = setTimeout(function () {
	      	_this.items = [];
	      	_this.getListData({
		 				data: {
		 					lat: _this.pos.latitude,
							lng: _this.pos.longitude,
							lat1: _this.pos.latitude,
							lng1: _this.pos.longitude
		 				},
		  			pageNum: _this.pageNum
		    	})
	        _this.$refs.loadmore.onTopLoaded();
	        clearTimeout(timer);
	      }, 1500)
	    },
	    // 上拉加载
	    loadBottom () {
	      var _this = this;
	      _this.pageNum++;
	      var timer = setTimeout(function () {
	        _this.getListData({
		 				data: {
		 					lat: _this.pos.latitude,
							lng: _this.pos.longitude,
							lat1: _this.pos.latitude,
							lng1: _this.pos.longitude
		 				},
		  			pageNum: _this.pageNum
		    	});
	        _this.$refs.loadmore.onBottomLoaded();
	        clearTimeout(timer);
	      }, 1500)
	    },
	    // 获取数据
	    getListData (opt) {
	      this.$ajax({
	        method: 'post',
	        url: global.AJAXURL + 'park/queryByDistance',
	        params: {
	          param: {
	            "k": localStorage.TOKEN,
	            "data": opt.data,
	            "pageNum": opt.pageNum,
	            "pageSize": this.pageSize,
	            "version": "V1.0"
	          }
	        }
	      })
	      .then((res) => {
	        if (res.data.code === '0000') {
	          if (res.data.data != null && res.data.data.ParkVOList.length > 0) {
	          	this.code = res.data.code;
	            this.items = this.items.concat(res.data.data.ParkVOList);
	          } else {
	            if (this.pageNum > 1) {
	              this.pageNum--
	            }
	          }
	        } else {
	          this.$toast(res.data.msg);
	        }
	        this.$indicator.close();
	      }, (res) => {
	        this.$indicator.close();
	        this.$toast(res);
	      })
	    }
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
	.parkInfo-list
		position: absolute
		top: 55px
		left: 0
		bottom: 0
		overflow: hidden
		width: 100%
		.parkInfo-items
			.item
				background:#fff
				border-1px(#ccc)
				&:last-child
					border-none()
				.item-wrapper
					display: flex
					width:100%
					padding:10px	
					.item-left
						flex: 0 0 95px
						margin-right:10px
						width: 95px
						height: 70px
						img
							width: 95px
							height: 70px
							background: red
					.item-right
						flex: 1
						.name
							overflow:hidden
							padding:0
							.title
								float: left
								font-size: 16px
								color:#000
								font-weight: 500
							.distance
								float: right
						.address
							font-size: 14px
							color: #b3b3b3
							margin-top:5px
						.car-num
							font-size: 0
							overflow: hidden
							margin-top:5px
							.left,.right
								font-size: 14px
								color: #666
							.left
								float: left
							.right
								float: right
								.rule
									color: #009fe8	
						.position-wrapper
							margin-top: 10px
							.position,.pay,.working
								padding: 3px 5px
								border-radius: 2px
								background: #576b95
								color: #fff
								font-size: 10px
							.pay
								background: #00cfa1
							.working
								background: red
	.pay
		opacity:1
		&.pay-enter-active,&.pay-leave-active
			transition all 0.5s
		&.pay-enter,&.pay-leave-active
			opacity:0
	.noPark
		width:200px
		position:absolute
		top:50%
		left:50%
		text-align:center
		margin-left:-100px
		margin-top:-55px
		img
			width:80px
			height:80px
			margin-bottom:10px
		h2
			color:#999												
</style>
