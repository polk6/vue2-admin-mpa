import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
import { routerLazyLoading } from './router-lazy-loading';

// init
Vue.use(Router);
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
const originalReplace = Router.prototype.push;
Router.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => err);
};

// lazyload
const lazyload = (name) => () => import(`@/pages/${name}`);

// 业务路由
import tableDemoRouter from './tableDemo.router';
import schoolManagementRouter from './schoolManagement.router';
import directiveRouter from './directive.router';

let routes = [
  {
    path: '/',
    redirect: 'mpa-layout'
  },
  {
    path: '/mpa-layout',
    name: 'mpa-layout',
    component: lazyload('mpa-layout'),
    children: [].concat(schoolManagementRouter, tableDemoRouter, directiveRouter)
  }
];
// router register
const router = new Router({
  routes: routes
});

router.beforeEach((to, from, next) => {
  routerLazyLoading.show();
  next();

  // // 跳转前，判断是否含有登录信息
  // if (store.getters['accountStore/accountInfo'] == null) {
  //   let intervalCount = 0;
  //   let initInterval = setInterval(() => {
  //     intervalCount++;
  //     if (store.getters['accountStore/accountInfo'] != null || intervalCount >= 35) {
  //       clearInterval(initInterval);
  //       next();
  //     }
  //   }, 100);
  // } else {
  //   next();
  // }
});

router.afterEach((route) => {
  routerLazyLoading.hidden();
});

export default router;
