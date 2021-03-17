import Vue from "vue";
import VueRouter from "vue-router";
import home from "../views/Home/Home.vue";
import Login from "../views/Home/Login.vue";
import UploadFile from "../views/Entidades/UploadFile.vue";
import HistoricoDeudas from "../views/Entidades/HistoricoDeudas.vue";
import HistoricoDeudasDetalle from "../views/Entidades/HistoricoDeudasDetalle";
import ReporteDeudasEntidades from "../views/Entidades/ReporteDeudasEntidades";
import SearchEntidades from '../views/Recaudaciones/SearchEntidades.vue';
import Debts from '../views/Recaudaciones/Debts.vue';
import AbmEntidades from '../views/Administracion/AbmEntidades.vue';
import AbmSucursalesEntidades from '../views/Administracion/AbmSucursaleseEntidades.vue';
import AbmRecaudadores from '../views/Administracion/AbmRecaudadores.vue';
import decode from 'jwt-decode';
import AbmSucursales from '../views/Administracion/AbmSucursales.vue';

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
        path: "/SearchEntidades",
        name: "SearchEntidades",
        component: SearchEntidades,
        meta: {
          libre: false
        },
        
      },
      {
        path: "/HistoricoDeudas",
        name: "HistoricoDeudas",
        component: HistoricoDeudas,
        meta: {
          libre: false
        },
      
      }, 
      {
        path: "/HistoricoDeudasDetalle/:archivoId",
        name: "HistoricoDeudasDetalle",
        component: HistoricoDeudasDetalle,
        meta: {
          libre: false
        },
      },
      {
        path: "/ReporteDeudasEntidades",
        name: "ReporteDeudasEntidades",
        component: ReporteDeudasEntidades,
        meta: {
          libre: false
        },
      },
      {
        path: "/debts/:entidadId",
        name: "Debts",
        component: Debts,
        meta: {
          libre: false
        }
      },
      {
        path: "/AbmEntidades",
        name: "AbmEntidades",
        component: AbmEntidades,
        meta: {
          libre: false
        }
      },
      {
        path: "/sucursalesentidades/:entidadId",
        name: "AbmSucursalesEntidades",
        component: AbmSucursalesEntidades,
        meta: {
          libre: false
        }
      },
      {
        path: "/AbmRecaudadores",
        name: "AbmRecaudadores",
        component: AbmRecaudadores,
        meta: {
          libre: false
        }
      },
      {
        path: "/sucursales/:recaudadorId",
        name: "AbmSucursales",
        component: AbmSucursales,
        meta: {
          libre: false
        }
      },
      
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
    const { exp } = decode(token);    
    if (exp < (new Date().getTime() + 1) / 1000) {   
      localStorage.clear();
      next({ name: "login" });
    }else{      
      
      next();
    }    
  } else {    
    next({ name: "login" });
  }
});

export default router;
