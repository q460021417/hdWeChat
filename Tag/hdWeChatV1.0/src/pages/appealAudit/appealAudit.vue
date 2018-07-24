<template>
	<div>
		<PageHeader :prveOpt="opt"></PageHeader>
		<div id="body">
			<div class="top">
				<p class="title">您已提交申诉，我们会在3个工作日内<br />尽快为您审核。</p>
			</div>
			<div class="btn-wrapper">
				<router-link class="makeSure" :to="{path:'/myCar',query:''}">完成</router-link>
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
	        backUrl: 'findPlate',
	        title: '申诉审核'
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
		background: url(shenfen.png) no-repeat center;
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
		.makeSure
			display: block;
			width: 85%;
			height: 45px;
			line-height: 45px;
			text-align: center;
			color: #fff;
			background: #fa7a24;
			border-radius: 4px;
			font-size: 16px;
			margin: 10px auto;
</style>
