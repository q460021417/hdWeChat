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
					<a class="btn btn-block btn-orange" @click="searchPlateNumber">确定</a>
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
	      opt: {
	        backUrl: '',
	        title: '快速缴费'
	      },
	      plateNumber: ''
	    }
	  },
	  components: {
	    PageHeader
	  },
	  methods: {
	  	// 车牌号校验
	  	checkPlateNumber (plateNumber) {
				var re = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/;
				if (plateNumber.search(re) === -1) {
					return false;
				} else {
					return true;
				}
			},
			// 车牌查询
			searchPlateNumber () {
				if (!this.checkPlateNumber(this.plateNumber)) {
					this.$toast('请输入正确的车牌号码');
					return;
				}
				this.$indicator.open('加载中...')
				// 查询车牌号信息
				this.$ajax({
	        method: 'post',
	        url: global.AJAXURL + 'lackMoney/getLackMoneysByPlateNumber',
	        params: {
	          param: {
	            "data": {
	            	plateNumber: this.plateNumber
	            }
	          }
	        }
	      })
	      .then((res) => {
	        if (res.data.code === '0000') {
	        	if (res.data.data.lackMoneys > 0) {
	        		this.$router.replace({
								path: '/fastParkPay',
								query: {
									backUrl: '/fastPay',
									plateNumber: this.plateNumber,
									lackMoney: res.data.data.lackMoneys
								}
							})
	        	} else {
	        		this.$toast('未查询到需要交费的订单，请重新查询！')
	        	}
	        } else {
	        	this.$toast(res.data.msg)
	        }
	        this.$indicator.close()
	      }, (res) => {
	      	this.$indicator.close()
	        this.$toast(res)
	      })
			}
	  }
	}
</script>
