import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/ant-design-vue.js';
import axios from 'axios';
const moment = require('moment')
require('moment/locale/es')

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
