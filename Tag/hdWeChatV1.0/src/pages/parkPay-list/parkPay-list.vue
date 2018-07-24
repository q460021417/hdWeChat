<template>
  <div class="container">
    <PageHeader :prveOpt="opt"></PageHeader>
    <div id="body">
      <mt-loadmore :top-method="loadTop" :auto-fill="false" ref="loadmore">
        <ul class="parkPay-list">
          <li v-for="item in items">
            <h2>{{item.plateNumber}} <span class="green" v-show="!item.exitTime">（未离场）</span><router-link class="btn-orange fr" :to="{path:'/pay',query:{backUrl:'/parkPay-list',parkRecordId:item.parkRecordId}}" v-show="item.parkState ==0 && item.lackMoney > 0 && item.orderState == 0">去支付</router-link></h2>
            <div class="parkPay-info">
              <dl class="clearfix">
                <dt>停车场</dt>
                <dd>{{item.parkName}}</dd>
              </dl>
              <dl class="clearfix">
                <dt>入场时间</dt>
                <dd>{{item.entryTime}}</dd>
              </dl>
              <dl class="clearfix">
                <dt>出场时间</dt>
                <dd><span :class="{'green':!item.exitTime}">{{item.exitTime?item.exitTime:'未离场'}}</span></dd>
              </dl>
            </div>
          </li>
        </ul>
      </mt-loadmore>
    </div>
    <div class="noRecord" v-show="items.length===0">
      <img src="./noRecord.png">
      <p>无待缴费订单</p>
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
        title: '停车缴费'
      },
      items: []
    }
  },
  components: {
    PageHeader
  },
  created () {
    this.$indicator.open('加载中...');
    this.getListDate();
  },
  methods: {
    // 下拉刷新
    loadTop () {
      var _this = this;
      var timer = setTimeout(function () {
        _this.getListDate();
        _this.$refs.loadmore.onTopLoaded();
        clearTimeout(timer);
      }, 1000)
    },
    // 获取数据
    getListDate () {
      this.$ajax({
        method: 'post',
        url: global.AJAXURL + 'lackMoney/getListMember',
        params: {
          param: {
            "k": localStorage.TOKEN,
            "version": "V1.0"
          }
        }
      })
      .then((res) => {
        if (res.data.code === '0000') {
          if (res.data.data != null) {
            this.items = res.data.data.PreChargeOrderVO;
          } else {
            // this.$toast(res.data.msg)
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*.container,
#body,
.mint-loadmore{
  height:100%;
}
*/
.parkPay-list li{
  margin-top:10px;
  padding-left:15px;
  background-color:#fff;
  border-top:1px solid #c9c9c9;
  border-bottom:1px solid #c9c9c9;
}

.parkPay-list li h2,
.parkPay-list li .parkPay-info{
  padding-top:12px;
  padding-bottom:12px;
  padding-right:15px;
}

.parkPay-list li h2{
  position: relative;
  font-size: 15px;
  color:#333;
  font-family: '黑体';
  border-bottom:1px solid #c9c9c9;
}

.parkPay-list li h2 .btn-orange{
  position: absolute;
  top:6px;
  right:15px;
  padding:6px 12px;
  border-radius: 3px;
}

.parkPay-info dl:not(:last-child){
  padding-bottom:5px;
}

.parkPay-info dl dt{
  float: left;
}

.parkPay-info dl dt,
.parkPay-info dl dd{
  font-size:14px;
  color:#666;
}

.parkPay-info dl dd{
  text-align: right;
}
</style>
