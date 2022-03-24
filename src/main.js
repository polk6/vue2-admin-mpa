import Vue from 'vue';
import App from './App';
import router from './router/index';
import store from './store/index';

// import element-ui
import el from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(el);

// import custom css and js
import './assets/css/index.scss';
import { msg, utils, http } from './assets/js/index.js';
msg.install(Vue);
Vue.prototype.$msg = msg;
Vue.prototype.$utils = utils;
Vue.prototype.$http = http;

import { apiUrl } from './service/api.js';
Vue.prototype.$apiUrl = apiUrl;

// directives
import './directive/ak-tooltip-auto-show.js';

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
