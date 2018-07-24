<template>
	<div>
		<PageHeader :prveOpt="opt"></PageHeader>
		<div id="body">
			<div class="section">
				<div class="row">
					<input class="form-control" type="text" maxlength="7" name="plateNumber" placeholder="请输入车牌号" v-model="plateNumber">
					<p>如：京A88888</p>
				</div>
			</div>
			<div class="section">
				<div class="row">
					<a class="btn btn-block btn-orange" @click="addCar()">确定</a>
				</div>
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
	      opt: {
	        backUrl: 'myCar',
	        title: '添加车辆'}
		}
	},
	components: {
		PageHeader
	},
	mounted () {
		console.log(this.$route)
	},
	methods: {
		addCar () {
			if (!/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(this.plateNumber.toUpperCase())) {
				this.$toast("车牌号不合法！");
				return;
			}
			this.$ajax({
				method: 'post',
				url: global.AJAXURL + 'car/add',
				params: {
					param: {
						"k": localStorage.TOKEN,
						"data": {
							"plateNumber": this.plateNumber.toUpperCase(),
							"source": "wechat"
						},
						"version": "V1.0"
					}
				}
			}).then((res) => {
				if (res.data.code === "0000") {
					this.$toast(res.data.msg);
					this.$router.push({path: '/myCar'});
				} else {
					this.$toast(res.data.msg);
					this.$router.push({path: "/addCarFail", query: {'plateNumber': this.plateNumber}});
				}
				this.$indicator.close();
			}).catch((error) => {
				this.$indicator.close();
				this.$toast(error);
			});
		}
	}
}</script>

