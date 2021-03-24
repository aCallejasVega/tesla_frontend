import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/ant-design-vue.js';
import axios from 'axios';
import VueGoogleCharts from 'vue-google-charts';
import Notifications from 'vue-notification';

const moment = require('moment');
require('moment/locale/es');

Vue.use(VueGoogleCharts)

Vue.use(Notifications)

Vue.use(require('vue-moment'), {
  moment
})
Vue.config.productionTip = false;
Vue.prototype.$http = axios;

import util from './lib/util';
Vue.use(util);

import VueProgressBar from 'vue-progressbar';
Vue.use(VueProgressBar, {
  color: 'rgb(224,206,206)',
  failedColor: 'red',
  height: '2px'
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');