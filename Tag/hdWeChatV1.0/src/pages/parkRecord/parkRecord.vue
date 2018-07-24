<template>
	<div>
		<PageHeader :prveOpt="opt"></PageHeader>
		<div id="body">
			<mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :auto-fill="false"  ref="loadmore">
				<ul>
				 	<li v-for="(item,index) in recordList">
				 		<div class="content" @click.stop.prevent="payDetail(item)">
				 			<div class="left">
					 			<p class="plateNumber"><i class="icon icon-plate"></i><span class="text">{{item.plateNumber}}</span></p>
					 			<p><i class="icon icon-addr"></i><span class="text">{{item.parkName}}</span></p>
					 			<p><i class="icon icon-in"></i><span class="text">{{item.entryTime}}</span></p>
					 			<p><i class="icon icon-out"></i><span class="text">{{item.exitTime || '未出场'}}</span></p>
					 		</div>
					 		<div class="right">
					 			<p class="title">总额</p>
					 			<p class="money">&yen; {{item.shouldPay}}</p>
					 		</div>
				 		</div>
				 		<div class="gopay clearfix" v-show="item.parkState===0 && item.lackMoney>0 && item.orderState===0">
							<a class="gopay-btn" @click.stop.prevent="pay(item.parkRecordId)">去支付</a>
						</div>
				 	</li>
				</ul>
			</mt-loadmore>
		</div>
	</div>
</template>

<script>
	import PageHeader from '../../components/header/header'
	export default {
	  data () {
	    return {
	      opt: {
	        backUrl: 'personCenter',
	        title: '停车记录'},
	      recordList: [],
	      pageNum: 1,
	      pageSize: 5
}
},
components: {
		PageHeader
	},
	mounted () {
		this.getList();
	},
	methods: {
		loadTop () {
			this.pageNum = 1;
			this.getList();
		},
		loadBottom () {
			this.pageNum ++;
			this.$ajax({
				method: 'post',
				url: global.AJAXURL + 'parkRecord/getListForSjz',
				params: {
					param: {
						"k": localStorage.TOKEN,
						"data": {
							"startDate ": "",
							"endDate ": ""
						},
						"pageNum": this.pageNum,
						"pageSize": this.pageSize,
						"version": "V1.0"
					}
				}
			}).then((res) => {
				if (res.data.code === "0000") {
					var dataJson = res.data.data;
					if (this.pageNum === 1) {
						if (dataJson.info && dataJson.info.length < this.pageSize) {
							this.pageNum --;
						}
						this.recordList = dataJson.info;
					} else {
						if (dataJson.info === null) {
							this.pageNum --;
							this.$toast('没有最新数据！');
						} else if (dataJson.info && dataJson.info.length < this.pageSize) {
							this.recordList.splice(this.pageSize * (this.pageNum - 1), this.pageSize);
							this.recordList = this.recordList.concat(dataJson.info);
							this.pageNum --;
						} else {
							this.recordList = this.recordList.concat(dataJson.info);
						}
					}
				} else {
					this.$toast(res.data.msg);
				}
				this.$refs.loadmore.onTopLoaded();
				this.$refs.loadmore.onBottomLoaded();
				this.$indicator.close();
			}).catch((error) => {
				this.$indicator.close();
				this.$toast(error);
			});
		},
		getList () {
			this.$ajax({
				method: 'post',
				url: global.AJAXURL + 'parkRecord/getListForSjz',
				params: {
					param: {
						"k": localStorage.TOKEN,
						"data": {
							"startDate ": "",
							"endDate ": ""
						},
						"pageNum": this.pageNum,
						"pageSize": this.pageSize,
						"version": "V1.0"
					}
				}
			}).then((res) => {
				if (res.data.code === "0000") {
					var dataJson = res.data.data;
					if (dataJson.info && dataJson.info.length < this.pageSize) {
						this.pageNum --;
					}
					this.recordList = dataJson.info;
				} else {
					this.$toast(res.data.msg);
				}
				this.$refs.loadmore.onTopLoaded();
				this.$refs.loadmore.onBottomLoaded();
				this.$indicator.close();
			}).catch((error) => {
				this.$indicator.close();
				this.$toast(error);
			});
		},
		payDetail (item) {
			this.$router.push({path: '/recordDetail', query: {parkRecordId: item.parkRecordId}});
		},
		pay (id) {
			this.$router.push({path: '/pay', query: {backUrl: '/parkRecord', parkRecordId: id}});
		}
	}
}
</script>

<style type="text/css" lang="stylus" scoped>
	li
		border-top: 1px solid #ccc;
		padding: 10px 10px 0;
		margin-bottom: 10px;
		background-color: #fff;
		&:first-child
			border: none;
		.content
			padding: 5px 5px 15px;			
			display: flex;
			.left
				flex: 1;
				color: #999;
				p
					line-height: 18px
					&.plateNumber
						line-height: 24px
						.text
							font-size: 15px;
							color: #000
						.icon-plate
							margin-top 2px
							background-image: url(icon-plate.png);
							background-size: 17px auto
					.icon
						display: inline-block
						margin-right: 6px
						width:17px
						height:17px
						background-repeat: no-repeat
						background-position: center
						vertical-align: top
						margin-top: 0
						&.icon-addr
							background-image: url(icon-addr.png)
							background-size: 14px auto
						&.icon-in
							background-image: url(icon-in.png)
							background-size: 14px auto
						&.icon-out
							background-image: url(icon-out.png)
							background-size: 14px auto
					.text
						display: inline-block
						vertical-align: top
						font-size: 12px
			.right
				border-left: 1px solid #ccc;
				width: 130px;
				text-align: center;
				display: flex;
				flex-direction: column;
				justify-content: center;
				color: #000;
				.title
					font-size: 12px;
					line-height: 24px
				.money
					line-height: 24px
					font-size: 19px;
		.gopay
			height: 50px;
			background-color: #fff;
			text-align: right;
			border-top: 1px solid #ccc;
			.gopay-btn
				display: inline-block;
				height: 32px;
				line-height: 32px;
				width: 80px;
				text-align: center;
				color: #fff;
				background: #fa7a24;
				border-radius: 4px;
				font-size: 16px;
				margin-top: 9px;
</style>
