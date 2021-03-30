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
import EntidadDeudasCobradasPorArchivo from '../views/Entidades/Reportes/EntidadDeudasCobradasPorArchivo.vue';
import EntidadReportesDeudasCobradas from '../views/Entidades/Reportes/EntidadReportesDeudasCobradas.vue';
import RecaudacionReportesDeudasCobradas from '../views/Recaudaciones/Reportes/RecaudacionReportesDeudasCobradas.vue';
import AbmSucursales from '../views/Administracion/AbmSucursales.vue';
import Index from "../views/Home/Index.vue";
import AdminReportesDeudasCobradas from "../views/Administracion/Reportes/AdminReportesDeudasCobradas.vue";

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
        path: "*",        
        component: Index,
        meta: {
          libre: false
        }
      },
      {
        path: "/index",
        name: "index",
        component: Index,
        meta: {
          libre: false
        }
      },
      {
        path: "/UploadFile",
        name: "UploadFile",
        component: UploadFile,
        meta: {
          libre: false
        }
      },
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
        path: "/EntidadDeudasCobradasPorArchivo",
        name: "EntidadDeudasCobradasPorArchivo",
        component: EntidadDeudasCobradasPorArchivo,
        meta: {
          libre: false
        },
      },
      {
        path: "/EntidadReportesDeudasCobradas",
        name: "EntidadReportesDeudasCobradas",
        component: EntidadReportesDeudasCobradas,
        meta: {
          libre: false
        },
      },
      {
        path: "/RecaudacionReportesDeudasCobradas",
        name: "RecaudacionReportesDeudasCobradas",
        component: RecaudacionReportesDeudasCobradas,
        meta: {
          libre: false
        },
      },
      {
        path: "/AdminReportesDeudasCobradas",
        name: "AdminReportesDeudasCobradas",
        component: AdminReportesDeudasCobradas,
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
        path: "/AbmSucursalesEntidades/:entidadId/:nombre",
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
        path: "/AbmSucursales/:recaudadorId/:nombre",
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
