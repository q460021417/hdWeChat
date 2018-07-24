<template>
	<div>
		<PageHeader :prveOpt="opt"></PageHeader>
		<div id="body">
			<div class="top">
				<p class="title">添加失败</p>
			</div>
			<div class="btn-wrapper">
				<router-link class="addAgain" :to="{path:'/addCar',query:''}">重新添加</router-link>
				<router-link class="findPlate" :to="{path:'/findPlate',query:{plateNumber: $route.query.plateNumber}}">找回车牌</router-link>
			</div>
		</div>
	</div>
</template>

<script>
	import PageHeader from '../../components/header/header'
	export default {
	  data () {
	    return {
	      opt: {
	        backUrl: 'addCar',
	        title: '添加失败'
	      }
	    }
	  },
	  components: {
	    PageHeader
	  },
	  mounted () {
	  	console.log(this.$route)
	  },
	  methods: {
	  }
	}
	
</script>

<style lang="stylus" scoped>
	.top
		height: 250px;
		background: url(tianjiashibai.png) no-repeat center;
		position: relative;
		background-size: 80px 65px;
		.title
			text-align: center;
			color: #666;
			font-size: 14px;
			position: absolute;
			top: 180px;
			width: 100%;
	.btn-wrapper
		text-align: center;
		.addAgain,.findPlate
			display: inline-block;
			width: 127px;
			height: 45px;
			line-height: 45px;
			text-align: center;
			font-size: 16px;
		.addAgain
			color: #fa7a24;
			border: 1px solid #fa7a24;
			border-radius: 4px;
			margin-right: 22px;
		.findPlate
			background: #fa7a24;
			color: #fff;
			border-radius: 4px;
</style>
