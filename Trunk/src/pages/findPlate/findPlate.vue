<template>
	<div>
		<PageHeader :prveOpt="opt"></PageHeader>
		<div id="body">
			<div class="content">	
				<form name="form" ref="form" enctype="multipart/form-data">				
					<div class="carCard">
						<p class="title">上传行驶证（上传完整清晰的行驶证照片）</p>
						<div class="carCard_img" ref="carImg">							
							<input accept="image/*" type="file" name="driverImg" @change="uploadPic('carImg', $event)" style="opacity: 0; width: 100%; height: 100%;" />							
						</div>
					</div>				
					<div class="idCard">
						<p class="title">上传身份证（上传完整清晰的身份证照片）</p>
						<div class="idCard_img" ref="idImg">
							<input accept="image/*" type="file" name="cardImg" @change="uploadPic('idImg', $event)" style="opacity: 0; width: 100%; height: 100%;"/>
						</div>
					</div>	
				</form>	
			</div>
			<div class="btn-wrapper">
				<a class="makeSure" :class="{active: active}" @click="appeal">申诉找回</a>
			</div>
		</div>
	</div>
</template>

<script>
	import PageHeader from '../../components/header/header'
	export default {
	  data () {
	    return {
	      idCard_img: '',
	      carCard_img: '',
	      plateNumber: '',
	      opt: {
	        backUrl: 'myCar',
	        title: '找回车辆'
	      }
	    }
	  },
	  components: {
	    PageHeader
	  },
	  mounted () {
	  	console.log(this.$route);
	  	this.plateNumber = this.$route.query.plateNumber;
	  },
	  methods: {
	  	appeal () {
	  		if (this.active) {
	  			this.$indicator.open('加载中...');
	  			let form = this.$refs.form;
            	let formData = new FormData(form);
            	let param = {
				  			"k": localStorage.TOKEN,
								"data": {"plateNumber": this.plateNumber},
								"version": "V1.0"
							};
            	formData.append("param", JSON.stringify(param));
				this.$ajax({
					method: 'post',
					  url: global.AJAXURL + 'carAppeal/appeal',
					  data: formData,
					  headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                      }
					}).then((res) => {
						if (res.data.code === "0000") {
							this.$router.push('/appealAudit');
						}	else {
					 		this.$toast(res.data.msg);
					 	}
					 	this.$indicator.close();
				}).catch((error) => {
				    this.$indicator.close();
		        this.$toast(error);
				 });
	  		}
	  	},
	  	uploadPic (type, e) {
	  		let files = e.target.files || e.dataTransfer.files;
		    if (!files.length) return;
	  		this.createImage(files, type);
	  	},
	  	createImage (file, type) {
	  	  let _this = this;
	      let reader = null;
	      let imgUrl = '';
	      reader = new window.FileReader();
	      reader.readAsDataURL(file[0]);
	      reader.onload = function () {
	      	imgUrl = this.result;
	        _this.$refs[type].style.backgroundImage = `url(${imgUrl})`;
	        _this.$refs[type].style.backgroundSize = 'contain';
	        if (type === 'idImg') {
	  			_this.idCard_img = imgUrl;
	  		} else {
	  			_this.carCard_img = imgUrl;
	  		}
	      }
	    }
	  },
	  computed: {
	  	// 按钮激活状态，图片上传完成激活。
	  	active () {
	  		if (this.carCard_img && this.idCard_img) {
	  			return true;
	  		} else {
	  			return false;
	  		}
	  	}
	  }
	}
	
</script>

<style lang="stylus" scoped>
	.content		
		.title			
			color: #666;
			font-size: 14px;	
			height: 40px;
			line-height: 40px;	
			padding-left: 10px;	
		.carCard_img,.idCard_img
			height: 180px;
			width: 300px;
			border: 1px solid #b7b7b7;
			border-radius: 8px;
			margin: 0 auto;		
			background-size: 80px 65px;
			background-color: #fff;
			background-repeat: no-repeat;
			background-position: center;
		.carCard_img
			background-image: url(carCard.png);
		.idCard_img
			background-image: url(IDCard.png);
	.btn-wrapper		
		.makeSure
			text-align: center;
			display: block;
			width: 100%;
			height: 50px;
			line-height: 50px;
			background-color: #fff;
			color: #b7b7b7;
			border-top: 1px solid #b7b7b7;	
			position: absolute;	
			bottom: 0px;
			font-size: 17px;
			&.active
				color: #fff;
				background-color: #fa7a24;
				border-top: 1px solid #fa7a24;
</style>
