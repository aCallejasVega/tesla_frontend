import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/ant-design-vue.js';
import axios from 'axios';
import VueGoogleCharts from 'vue-google-charts';

const moment = require('moment');
require('moment/locale/es');

Vue.use(VueGoogleCharts)

Vue.use(require('vue-moment'), {
  moment
})
Vue.config.productionTip = false;
Vue.prototype.$http = axios;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
