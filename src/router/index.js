import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home/Home.vue';

import Login from '../views/Home/Login.vue';
import UploadFile from '../views/Entidades/UploadFile.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      libre: false,
    },
  },
  {
    path: '/',
    name: 'login',
    component: Login,
    meta: {
      libre: true,
    },
  },
  {
    path: '/UploadFile',
    name: 'UploadFile',
    component: UploadFile,
    meta: {
      libre: false,
    },
  },

];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.matched.some((record) => record.meta.libre)) {
    next();
  } else if (token) {
    next();
  } else {
    next({ name: 'login' });
  }
});

export default router;
