<template>
	<div>
		<PageHeader :prveOpt="opt"></PageHeader>
		<div id="body">
			<div class="icon icon-pay-ok"></div>
			<p class="pay-ok">查询失败</p>
		</div>
	</div>
</template>

<script>
import PageHeader from '../../components/header/header'
export default {
  data () {
    return {
      opt: {
        backUrl: '/fastPay',
        title: '停车缴费'
      }
    }
  },
  components: {
    PageHeader
  },
  mounted () {
  }
}
</script>
