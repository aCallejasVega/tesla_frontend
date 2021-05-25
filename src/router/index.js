import Vue from "vue";
import VueRouter from "vue-router";
import store from '../store';
import home from "../views/Home/Home.vue";
import Login from "../views/Home/Login.vue";
import UploadFile from "../views/Entidades/UploadFile.vue";
import HistoricoDeudas from "../views/Entidades/HistoricoDeudas.vue";
import HistoricoDeudasDetalle from "../views/Entidades/HistoricoDeudasDetalle";
import ReporteDeudasEntidades from "../views/Entidades/ReporteDeudasEntidades";
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
import UploadFileAbonos from "../views/Pagos/UploadFileAbonos";
import PaymentsServicios from "../views/Pagos/PaymentsServicios";
import SearchServicios from "../views/Pagos/SearchServicios";
import EntidadReportesPagos from "../views/Pagos/Reportes/EntidadReportesPagos";
import RecaudadoraReportesPagos from "../views/Pagos/Reportes/RecaudadoraReportesPagos";
import AdministracionReportesPagos from "../views/Pagos/Reportes/AdministracionReportesPagos";

import ReImpresionComprobantes from "../views/Pagos/ReImpresionComprobantes";
import AdminUsuarios from "../views/Administracion/AdminUsuarios";
import RegistroPersona from "../components/Administracion/RegistroPersona";
import RecaudacionReporteCajero from '../views/Recaudaciones/Reportes/RecaudacionReporteCajero';

import GenerateCodigoControl from "../views/Administracion/GenerateCodigoControl";
import LibroVentas from "../views/Entidades/Facturacion/LibroVentas";
import ListInvoicesA from "../views/Recaudaciones/Facturacion/ListInvoicesA";
import ListInvoicesR from "../views/Recaudaciones/Facturacion/ListInvoicesR";
import ListInvoicesAR from "../views/Recaudaciones/Facturacion/ListInvoicesAR";
import SearchEntidadesDebts from '../views/Recaudaciones/SearchEntidadesDebts';
import SearchEntidadesInvoicesAR from '../views/Recaudaciones/Facturacion/SearchEntidadesInvoicesAR';
import SearchEntidadesInvoicesA from '../views/Recaudaciones/Facturacion/SearchEntidadesInvoicesA';
import SearchEntidadesInvoicesR from '../views/Recaudaciones/Facturacion/SearchEntidadesInvoicesR';
import Dosificaciones from "../views/Entidades/Facturacion/AbmDosificaciones";
import RegCredenciales from "../views/Entidades/Facturacion/RegCredenciales";
import AdmEntSucursalEntidades from "../views/Entidades/Administracion/AdmEntSucursalesEntidades";
import AdmRecSucursales from "../views/Recaudaciones/Administracion/AdmRecSucursales";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: home,
    meta: {
      libre: false,
      rol: []
    },
    children: [

      {
        path: "/",
        name: "index",
        component: Index,
        meta: {
          libre: false,
          rol: []
        }
      },

      {
        path: "/UploadFile",
        name: "UploadFile",
        component: UploadFile,
        meta: {
          libre: false,
          rol: ['ROLES_MCAECA']
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/HistoricoDeudas",
        name: "HistoricoDeudas",
        component: HistoricoDeudas,
        meta: {
          libre: false,
          rol: ['ROLES_MCAEAH']
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }

      },
      {
        path: "/HistoricoDeudasDetalle/:archivoId",
        name: "HistoricoDeudasDetalle",
        component: HistoricoDeudasDetalle,
        meta: {
          libre: false,
          rol: []
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/ReporteDeudasEntidades",
        name: "ReporteDeudasEntidades",
        component: ReporteDeudasEntidades,
        meta: {
          libre: false,
          rol: []
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/EntidadDeudasCobradasPorArchivo",
        name: "EntidadDeudasCobradasPorArchivo",
        component: EntidadDeudasCobradasPorArchivo,
        meta: {
          libre: false,
          rol: ['ROLES_MCAERA']
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/EntidadReportesDeudasCobradas",
        name: "EntidadReportesDeudasCobradas",
        component: EntidadReportesDeudasCobradas,
        meta: {
          libre: false,
          rol: ['ROLES_MCAERG']
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/RecaudacionReportesDeudasCobradas",
        name: "RecaudacionReportesDeudasCobradas",
        component: RecaudacionReportesDeudasCobradas,
        meta: {
          libre: false,
          rol: ['ROLES_MCRGC']
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/AdminReportesDeudasCobradas",
        name: "AdminReportesDeudasCobradas",
        component: AdminReportesDeudasCobradas,
        meta: {
          libre: false,
          rol: ["ROLE_ADMINISTRACION"]
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/debts/:entidadId",
        name: "Debts",
        component: Debts,
        meta: {
          libre: false,
          rol: ['ROLES_MCARC']
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/AbmEntidades",
        name: "AbmEntidades",
        component: AbmEntidades,
        meta: {
          libre: false,
          rol: [
            "ROLE_ADMINISTRACION"
          ]
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/AbmSucursalesEntidades/:entidadId/:nombre",
        name: "AbmSucursalesEntidades",
        component: AbmSucursalesEntidades,
        meta: {
          libre: false,
          rol: ['ROLE_ADMINISTRACION']
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/AbmRecaudadores",
        name: "AbmRecaudadores",
        component: AbmRecaudadores,
        meta: {
          libre: false,
          rol: ['ROLE_ADMINISTRACION']
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/AbmSucursales/:recaudadorId/:nombre",
        name: "AbmSucursales",
        component: AbmSucursales,
        meta: {
          libre: false,
          rol: ['ROLE_ADMINISTRACION']
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/UploadFileAbonos",
        name: "UploadFileAbonos",
        component: UploadFileAbonos,
        meta: {
          libre: false,
          rol: ['ROLES_MPAPECA']
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/SearchServicios",
        name: "SearchServicios",
        component: SearchServicios,
        meta: {
          libre: false,
          rol: []
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/PaymentsServicios/:servicioProductoId",
        name: "PaymentsServicios",
        component: PaymentsServicios,
        meta: {
          libre: false,
          rol: []
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/EntidadReportesPagos",
        name: "EntidadReportesPagos",
        component: EntidadReportesPagos,
        meta: {
          libre: false,
          rol: []
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/RecaudadoraReportesPagos",
        name: "RecaudadoraReportesPagos",
        component: RecaudadoraReportesPagos,
        meta: {
          libre: false,
          rol: []
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/AdministracionReportesPagos",
        name: "AdministracionReportesPagos",
        component: AdministracionReportesPagos,
        meta: {
          libre: false,
          rol: ["ROLE_ADMINISTRACION"]
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },

      {
        path: "/ReImpresionComprobantes",
        name: "ReImpresionComprobantes",
        component: ReImpresionComprobantes,
        meta: {
          libre: false,
          rol: ['ROLES_MPAPRI']
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "AdminUsuarios/COBROS/ADM_ENTIDADES",
        name: "AdminUsuarios/COBROS/ADM_ENTIDADES",
        component: AdminUsuarios,
        meta: {
          libre: false,
          rol: ['ROLES_MCADAU']
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "AdminUsuarios/COBROS/ADM_RECAUDACION",
        name: "AdminUsuarios/COBROS/ADM_RECAUDACION",
        component: AdminUsuarios,
        meta: {
          libre: false,
          rol: ['ROLES_MCARAU']
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "AdminUsuarios/ADMIN",
        name: "AdminUsuarios/ADMIN",
        component: AdminUsuarios,
        meta: {
          libre: false,
          rol: ["ROLE_ADMINISTRACION"]
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },

      {
        path: "/RegistroPersona",
        name: "RegistroPersona",
        component: RegistroPersona,
        meta: {
          libre: false,
          rol: []
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/RecaudacionReporteCajero",
        name: "RecaudacionReporteCajero",
        component: RecaudacionReporteCajero,
        meta: {
          libre: false,
          rol: ['ROLES_MCARRCJ']

        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/GenerateCodigoControl",
        name: "GenerateCodigoControl",
        component: GenerateCodigoControl,
        meta: {
          libre: false,
          rol: []
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/SearchEntidadesDebts",
        name: "SearchEntidadesDebts",
        component: SearchEntidadesDebts,
        meta: {
          libre: false,
          rol: ['ROLES_MCARC']
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/LibroVentas",
        name: "LibroVentas",
        component: LibroVentas,
        meta: {
          libre: false,
          rol: ['ROLES_MCLV']
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/ListInvoices/:entidadId",
        name: "ListInvoicesA",
        component: ListInvoicesA,
        meta: {
          libre: false,
          rol: []
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/ListInvoices/:entidadId",
        name: "ListInvoicesAR",
        component: ListInvoicesAR,
        meta: {
          libre: false,
          rol: []
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/ListInvoices/:entidadId",
        name: "ListInvoicesR",
        component: ListInvoicesR,
        meta: {
          libre: false,
          rol: []
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/SearchEntidadesInvoicesA",
        name: "SearchEntidadesInvoicesA",
        component: SearchEntidadesInvoicesA,
        meta: {
          libre: false,
          rol: ['ROLES_MCRA']
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/SearchEntidadesInvoicesAR",
        name: "SearchEntidadesInvoicesAR",
        component: SearchEntidadesInvoicesAR,
        meta: {
          libre: false,
          rol: ['ROLES_MCRRA']
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/SearchEntidadesInvoicesR",
        name: "SearchEntidadesInvoicesR",
        component: SearchEntidadesInvoicesR,
        meta: {
          libre: false,
          rol: ['ROLES_MCARA']
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/Dosificaciones",
        name: "Dosificaciones",
        component: Dosificaciones,
        meta: {
          libre: false,
          rol: ['ROLES_MCED']
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/RegCredenciales",
        name: "RegCredenciales",
        component: RegCredenciales,
        meta: {
          libre: false,
          rol: []
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/RegCredenciales",
        name: "RegCredenciales",
        component: RegCredenciales,
        meta: {
          libre: false,
          rol: []
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/AdmEntSucursalEntidades",
        name: "AdmEntSucursalEntidades",
        component: AdmEntSucursalEntidades,
        meta: {
          libre: false,
          rol: ['ROLES_MCAEAE']
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "/AdmRecSucursales",
        name: "AdmRecSucursales",
        component: AdmRecSucursales,
        meta: {
          libre: false,
          rol: ['ROLES_MCARA']
        },
        beforeEnter: (to, from, next) => {
          if (tienePermiso(to, from.next)) {
            next();
          } else {
            next({ name: "index" });
          }
        }
      },
      {
        path: "*",
        name: "index",
        component: Index,
        meta: {
          libre: false,
          rol: []
        }
      },
    ]
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      libre: true,
      rol: []
    }
  },
  {
    path: "*",
    name: "login",
    component: Login,
    meta: {
      libre: true,
      rol: []
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
    } else {   
      next();
    }
  } else {
    next({ name: "login" });
  }
});


function tienePermiso(to, from, next) {
  let bandera = false;
  store.state.authorities.forEach((autorities) => {
    to.meta.rol.forEach((rol) => {
      if (autorities == rol) {
        bandera = true;
        return true;
      }
    });
  });
  return bandera;

}
export default router;
