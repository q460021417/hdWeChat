<template>
	<div>
		<PageHeader :prveOpt="opt"></PageHeader>
		<div id="body">
			<div class="icon icon-pay-ok"></div>
			<p class="pay-ok">缴费成功</p>
      <p>注册为邯郸爱泊车会员</p>
      <p>享受更多停车服务，<router-link class="orange" :to="{path:'/login'}" replace>立即注册>></router-link></p>
		</div>
	</div>
</template>

<script>
import PageHeader from '../../components/header/header'
export default {
  data () {
    return {
      opt: {
        backUrl: this.$route.query.backUrl,
        title: this.$route.query.title
      }
    }
  },
  components: {
    PageHeader
  }
}
</script>
<style scoped>
  .pay-ok{
    margin-bottom: 2rem
  }
  #body p:not(.pay-ok){
    text-align: center;
    line-height: 2;
    font-size: 1.5rem;
    color:#333;
  }
</style>
