<template>
	<div class="pay-rule">
		<div class="rule-wrapper">
			<img src="../../assets/img/icon-close.png" alt="" @click="isShowModule">
			<article>
				<h1>计费规则</h1>
				<ol v-show="chargeType===0">
					<li>白天：每车2小时内收费4元，不足2小时按2小时计算，超过两小时的每增加半小时加收1元。不足半小时按半小时计算。最高收费不得超过15元；</li>
					<li>夜晚：每车2小时内收费4元，不足2小时按2小时计算，超过两小时每增半小时加收0.5元。不足半小时按半小时计算。最高收费不得超过10元；</li>
					<li>5月-10月，白天:8:00-22:00，夜间:22:00-次日8:00。11月-次年4月，白天8:00-20:00 夜间：20:00-次日8:00；</li>
					<li>跨收费时段停放车辆，按停放时间分段计时收费（不能超过白天同时长收费标准）；</li>
					<li>20分钟内停车免费（含20分钟），超过20分钟按首停计时。</li>
				</ol>
				<ol v-show="chargeType===1">
					<li>白天：每车2小时内收费3元，不足2小时按2小时计算，超过两小时的每增加半小时加收0.5元。不足半小时按半小时计算。最高收费不得超过10元；</li>
					<li>夜晚：每车2小时内收费3元，不足2小时按2小时计算，超过两小时每增半小时加收0.5元。不足半小时按半小时计算。最高收费不得超过5元；</li>
					<li>5月-10月，白天:8:00-22:00，夜间:22:00-次日8:00。11月-次年4月，白天8:00-20:00 夜间：20:00-次日8:00；</li>
					<li>跨收费时段停放车辆，按停放时间分段计时收费（不能超过白天同时长收费标准）；</li>
					<li>20分钟内停车免费（含20分钟），超过20分钟按首停计时。</li>
				</ol>
				<ol v-show="chargeType===2">
					<li>白天：每车2小时内收费1元，不足2小时按2小时计算，超过两小时的每增加1小时加收0.5元。不足1小时按1小时计算。最高收费不得超过3元；</li>
					<li>夜晚：每车2小时内收费1元，不足2小时按2小时计算，超过两小时每增1小时加收0.5元。不足1小时按1小时计算。最高收费不得超过2元；</li>
					<li>5月-10月，白天:8:00-22:00，夜间:22:00-次日8:00。11月-次年4月，白天8:00-20:00 夜间：20:00-次日8:00；</li>
					<li>跨收费时段停放车辆，按停放时间分段计时收费（不能超过白天同时长收费标准）；</li>
					<li>20分钟内停车免费（含20分钟），超过20分钟按首停计时。</li>
				</ol>
			</article>
		</div>
	</div>
</template>
<script>
	export default {
		props: {
			chargeType: {
				type: Number
			}
		},
		methods: {
			isShowModule () {
				this.$emit('isShow', false);
			}
		}
	}
</script>
<style lang="stylus" scoped>
	.pay-rule
		position:fixed
		top: 0
		left: 0
		right: 0
		bottom: 0
		background: rgba(0, 0, 0, .4)
		z-index: 10
		.rule-wrapper
			position:fixed
			top: 60px
			left: 50%
			margin-left: -35%
			padding:15px
			width: 70%
			max-height: 70%
			background:#fff
			box-sizing:border-box
			overflow-y: auto
			img
				box-sizing:content-box
				width:16px
				position:absolute
				top:0px
				right:0px
				padding:5px
			article,h1
				margin: 0
				padding: 0
			article
				h1
					padding: 20px
					text-align: center
					font-size: 18px
					color: #009fe8
				ol
					margin: 0
					padding-left: 25px
				ol
					li
						list-style-type: decimal;
						line-height: 2
						font-size: 12px
						color:#333
</style>
