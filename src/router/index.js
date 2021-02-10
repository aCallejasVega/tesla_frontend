import Vue from "vue";
import VueRouter from "vue-router";
import home from "../views/Home/Home.vue";
import Login from "../views/Home/Login.vue";
import UploadFile from "../views/Entidades/UploadFile.vue";
import SearchEntidades from '../views/Recaudaciones/SearchEntidades.vue';
import Debts from '../views/Recaudaciones/Debts.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: home,
    meta: {
      libre: false
    },
    children: [
      {
        path: "/UploadFile",
        name: "UploadFile",
        component: UploadFile,
        meta: {
          libre: false
        }
      },
      {
        path: "/search",
        name: "SearchEntidades",
        component: SearchEntidades,
        meta: {
          libre: false
        }
      },
      {
        path: "/debts/:entidadId",
        name: "Debts",
        component: Debts,
        meta: {
          libre: false
        }
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      libre: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.matched.some(record => record.meta.libre)) {
    next();
  } else if (token) {
    next();
  } else {
    next({ name: "login" });
  }
});

export default router;
