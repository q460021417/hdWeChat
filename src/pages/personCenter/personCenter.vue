<template>
  <div>
  	<div class="top">
  		<p class="title"><i class="icon icon-yue"></i> 账户余额（元）</p>
			<p class="money">{{money}}</p>
			<p class="recharge"><router-link :to="{path:'/recharge',query:{balance:money}}">去充值</router-link></p>
  	</div>
  	<ul class="menu">
  		<li v-for="item in itemList" @click="goto(item.url)">
  			<div class="img" :style="{background: 'url('+item.img+') no-repeat center/contain'}"></div>
  			<p class="title">{{item.title}}</p>
  		</li>
  	</ul>
  </div>
</template>

<script>
import listCar from './list-car.png'
import listRecord from './list-record.png'
export default {
  data () {
    return {
    	allLoaded: '',
    	money: 0.00,
    	itemList: [{
    		img: listCar,
    		title: '我的车辆',
    		url: 'myCar'
    	},
    	{
    		img: listRecord,
    		title: '停车记录',
    		url: 'parkRecord'
    	}]
    }
  },
  methods: {
  	goto (url) {
  		this.$router.push(url);
  	}
  },
  mounted () {
  	this.$indicator.open('加载中...');
		this.$ajax({
			method: 'post',
			  url: global.AJAXURL + 'wechatUser/balance',
			  params: {
			  	param: {
			  		"k": localStorage.TOKEN,
						"data": {},
						"version": "V1.0"
					}
			  }
			}).then((res) => {
				if (res.data.code === "0000") {
					let money = res.data.data.money
					this.money = money.toFixed(2);
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
<style  lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixin.styl';

.top
	height: 190px
	background: #494c53
	text-align: center
	padding-top: 38px
	.icon-yue
		background: url("./icon-yue.png") no-repeat center/contain
		width: 16px
		height: 13px
		vertical-align: middle
		display: inline-block
		margin-top: -5px
		margin-right: 5px
	.title
		color: #fff
		font-size: 13px
		vertical-align: top
	.money
		color: #fff
		font-size: 33px
		line-height: 78px
		height: 78px
	.recharge
		font-size: 17px
		color: $color
		a
			color: $color
.menu
	li
		float: left
		width: 50%
		text-align: center
		padding: 20px 0						
		display: flex
		flex-direction: column
		justify-content: center	
		background: #fff
		&:nth-of-type(2n+1)
			border-right: 1px solid #ccc			
		&:nth-of-type(1)
			border-bottom: 1px solid #ccc
		&:nth-of-type(2)
			border-bottom: 1px solid #ccc
		.img
			margin: 30px auto 20px
			width: 70px
			height: 50px
		.title
			font-size: 16px
			color: #333
				
		
</style>
