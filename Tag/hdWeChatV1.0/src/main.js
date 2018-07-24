// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import routersConfig from './router/router.config.js'
import Axios from 'axios'
import './common/stylus/index.styl'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.min.css'
import './common/common.js'
Vue.prototype.$ajax = Axios
Vue.use(VueRouter)
Vue.use(Mint)
/* eslint-disable no-new */
const router = new VueRouter(routersConfig)

function updateToken () {
  Axios({
    method: 'post',
    url: global.AJAXURL + 'session/updateToken',
    params: {
      param: {}
    }
  })
  .then((res) => {
   if (res.data.code === "0000") {
      localStorage.TOKEN = res.data.data.token;
    } else {
      Mint.Toast(res.msg)
    }
  }, (res) => {
   if (res.status === 910) {
      updateToken();
    } else {
      Mint.Toast(res.msg)
    }
    Mint.Toast(res)
  })
}

function isOpenId (to, next) {
  Axios({
    method: 'post',
    url: global.AJAXURL + 'session/get',
    params: {
      param: {}
    }
  })
  .then((res) => {
    if (res.data.code === '0000') {
      let urlBack = window.location.href;
      let data = res.data.data;
      if (data.openId === null || data.openId === '') {
        window.location.href = global.AJAXURL + 'session/set?urlback=' + urlBack;
      } else {
        localStorage.OPENID = data.openId;
        localStorage.TOKEN = data.token;
        localStorage.ISBIND = data.isBind;
        if (localStorage.ISBIND == 1) {  // 通过vuex state获取当前的token是否存在
          next();
        } else {
          if (to.fullPath == '/parkPay-list') {
            next('/fastPay');
            return;
          }
          next({
            path: '/login',
            query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
          })
        }
        // window.location.href = urlBack;
      }
    } else {
      Mint.Toast(res.data.msg)
    }
  }, (res) => {
    if (res.status === 910) {
      updateToken();
    } else {
      Mint.Toast(res.msg)
    }
    Mint.Toast(res)
  })
}

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (localStorage.OPENID) {
      if (localStorage.ISBIND == 1) {  // 通过vuex state获取当前的token是否存在
        next();
      } else {
        if (to.fullPath == '/parkPay-list') {
          next('/fastPay');
          return;
        }
        next({
          path: '/login',
          query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
        })
      }
    } else {
      isOpenId(to, next);
    }
  } else {
    next();
  }
})

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
