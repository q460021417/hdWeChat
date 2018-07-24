import ParkPayList from '../pages/parkPay-list/parkPay-list'
import ParkInfoList from '../pages/parkInfo-list/parkInfo-list'
import parkListDetail from '../pages/parkList-detail/parkList-detail'
import Pay from '../pages/pay/pay'
import PayOk from '../pages/payOk/payOk'
import FastPay from '../pages/fastPay/fastPay'
import PersonCenter from '../pages/personCenter/personCenter'
import Recharge from '../pages/recharge/recharge'
import MyCar from '../pages/myCar/myCar'
import FastParkPay from '../pages/fastParkPay/fastParkPay'
import PayFailure from '../pages/payFailure/payFailure'
import AddCar from '../pages/addCar/addCar'
import AddCarFail from '../pages/addCarFail/addCarFail'
import FindPlate from '../pages/findPlate/findPlate'
import ParkRecord from '../pages/parkRecord/parkRecord'
import RecordDetail from '../pages/recordDetail/recordDetail'
import AppealAudit from '../pages/appealAudit/appealAudit'
import Login from '../pages/login/Login'
import Agreement from '../pages/agreement/Agreement'

export default {
  mode: 'history',
  routes: [
    {
      path: '/parkPay-list',
      name: 'ParkPayList',
      component: ParkPayList,
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      }
    },
    {
      path: '/parkInfo-list',
      name: 'ParkInfoList',
      component: ParkInfoList
    },
    {
      path: '/parkList-detail',
      name: 'parkListDetail',
      component: parkListDetail
    },
    {
      path: '/pay',
      name: 'Pay',
      component: Pay,
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      }
    },
    {
      path: '/payOk',
      name: 'PayOk',
      component: PayOk
    },
    {
      path: '/fastPay',
      name: 'FastPay',
      component: FastPay
    },
    {
      path: '/personCenter',
      name: 'PersonCenter',
      component: PersonCenter,
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      }
    },
    {
      path: '/recharge',
      name: 'Recharge',
      component: Recharge,
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      }
    },
    {
      path: '/myCar',
      name: 'MyCar',
      component: MyCar,
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      }
    },
    {
      path: '/fastParkPay',
      name: 'FastParkPay',
      component: FastParkPay
    },
    {
      path: '/payFailure',
      name: 'PayFailure',
      component: PayFailure
    },
    {
      path: '/addCar',
      name: 'AddCar',
      component: AddCar,
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      }
    },
    {
      path: '/addCarFail',
      name: 'AddCarFail',
      component: AddCarFail,
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      }
    },
    {
      path: '/findPlate',
      name: 'FindPlate',
      component: FindPlate,
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      }
    },
    {
      path: '/parkRecord',
      name: 'ParkRecord',
      component: ParkRecord,
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      }
    },
    {
      path: '/recordDetail',
      name: 'RecordDetail',
      component: RecordDetail,
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      }
    },
    {
      path: '/appealAudit',
      name: 'AppealAudit',
      component: AppealAudit,
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/agreement',
      name: 'Agreement',
      component: Agreement
    }
  ]
};
