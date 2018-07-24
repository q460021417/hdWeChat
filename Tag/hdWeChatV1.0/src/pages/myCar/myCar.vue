<template>
  <div>
  	<PageHeader :prveOpt="option"></PageHeader>
  	<div id="body">
  		<div class="top">
  			<i class="icon icon-phone"></i>  
  			&nbsp;&nbsp;手机号
  			<span class="phoneNumber">{{phoneNum}}</span>
  		</div>
  		<div class="unbind-wrapper">
  			<p class="title"><a class="unbind-btn" @touchstart="unbindBtn()" :class="{active: unbind}">{{!unbind?'解绑':'完成'}}</a>我的车牌</p>	
  			<ul class="carList">
  				<li v-for="(car,index) in carList">
  					<transition name="fade">
	  					<span class="unbind" @click="unbindCar(index)" v-show="unbind">
	  						解绑
	  					</span>
  					</transition>
  					<i class="icon icon-car"></i> {{car.plateNumber}} 
  				</li>
  			</ul>
  		</div>
  		<!-- <p class="p-footer">开启自动支付将享受余额自动扣费，出场不停车！</p> -->
  		<router-link :to="{path: '/addCar'}">
  			<div class="makeSure"  v-show="carList.length < 5">
		  		添加车辆
		  	</div>
	  	</router-link>
  	</div>
  </div>
</template>

<script>
import PageHeader from '../../components/header/header'
import { MessageBox } from 'mint-ui';
export default {
  data () {
    return {
    	option: {
    		backUrl: "personCenter",
    		title: "我的车辆"
    	},
    	phoneNum: '',
    	unbindBtnText: '解绑',
    	unbind: false,
    	carList: []
    }
  },
  components: {
  	PageHeader
  },
  methods: {
  	unbindBtn () {
  		this.unbind = !this.unbind;
  	},
  	unbindCar (index) {
  		MessageBox.confirm('确定执行此操作?').then(action => {
	  		this.$ajax({
				method: 'post',
				  url: global.AJAXURL + 'car/delete',
				  params: {
				  	param: {
				  		"k": localStorage.TOKEN,
							"data": {
								"carId": this.carList[index].carId
							},
							"source": "wechat",
							"version": "V1.0"
						}
				  }
				}).then((res) => {
					if (res.data.code === "0000") {
						this.carList.splice(index, 1);
						this.$toast(res.data.msg);
					}	else {
				 		this.$toast(res.data.msg);
				 	}
				 	this.$indicator.close();
			}).catch((error) => {
			    this.$indicator.close();
	        this.$toast(error);
			  });
		  }).catch(errer => {});
  	}
  },
  mounted () {
  	this.$indicator.open('加载中...');
		this.$ajax({
			method: 'post',
			  url: global.AJAXURL + 'car/getList',
			  params: {
			  	param: {
			  		"k": localStorage.TOKEN,
						"data": {},
						"pageNum": "1",
						"pageSize": "5",
						"version": "V1.0"
					}
			  }
			}).then((res) => {
				if (res.data.code === "0000") {
					var dataJson = res.data.data;
					this.phoneNum = dataJson.phoneNumber;
					this.carList = dataJson.info;
				}	else {
			 		this.$toast(res.data.msg);
			 	}
			 	this.$indicator.close();
		}).catch((error) => {
		    this.$indicator.close();
        this.$toast(error);
		  });
	  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
	.top
		height: 50px;
		line-height: 50px;
		background: #fff;
		padding: 0 20px;
		font-size: 14px;
		margin-top: 15px;
		border-top: 1px solid #ccc;
		border-bottom: 1px solid #ccc;
		.phoneNumber
			float: right;
	.unbind-wrapper
		margin-top: 10px;
		margin-bottom: 20px
		.title
			font-size: 12px;
			padding: 0 10px 10px 20px;
			.unbind-btn
				float: right;
				display: block;
				padding: 5px 10px;
				border: 1px solid #fe7862;
				color: #fe7862;
				border-radius: 10%;
				margin-top: -6px;
				&.active
					background: #4bd865;
					color: #fff;
					border: 1px solid #4bd865;
		.carList
			li
				height: 40px;
				line-height: 40px;
				position: relative;
				border-bottom: 1px solid #ccc;
				background: #fff;
				white-space: nowrap;
				font-size: 14px
				.unbind
					width: 50px;
					color: #fff;
					height: 100%;
					background: #ef2324;
					line-height: 40px;
					text-align: center;	
					display: inline-block;
					&.fade-enter-active, &.fade-leave-active {
					  transition: all .5s
					}
					&.fade-enter, &.fade-leave-active {
					 	width: 0px;
					}
				.icon 
					margin-left: 20px;
	.p-footer
		height: 45px;
		line-height: 45px;
		padding-left: 20px;
	.makeSure
		width: 85%;
		height: 45px;
		line-height: 45px;
		text-align: center;
		color: #fff;
		background: #fa7a24;
		border-radius: 4px;
		font-size: 16px;
		margin: 0px auto;
</style>
