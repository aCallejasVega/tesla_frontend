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
        path: "/",
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
      {
        path: "/UploadFileAbonos",
        name: "UploadFileAbonos",
        component: UploadFileAbonos,
        meta: {
          libre: false
        }
      },
      {
        path: "/SearchServicios",
        name: "SearchServicios",
        component: SearchServicios,
        meta: {
          libre: false
        }
      },
      {
        path: "/PaymentsServicios/:servicioProductoId",
        name: "PaymentsServicios",
        component: PaymentsServicios,
        meta: {
          libre: false
        }
      },
      {
        path: "/EntidadReportesPagos",
        name: "EntidadReportesPagos",
        component: EntidadReportesPagos,
        meta: {
          libre: false
        }
      },
      {
        path: "/RecaudadoraReportesPagos",
        name: "RecaudadoraReportesPagos",
        component: RecaudadoraReportesPagos,
        meta: {
          libre: false
        }
      },
      {
        path: "/AdministracionReportesPagos",
        name: "AdministracionReportesPagos",
        component: AdministracionReportesPagos,
        meta: {
          libre: false
        }
      },

      {
        path: "/ReImpresionComprobantes",
        name: "ReImpresionComprobantes",
        component: ReImpresionComprobantes,
        meta: {
          libre: false
        }
      },
      {
        path: "AdminUsuarios/COBROS/ADM_ENTIDADES",
        name: "AdminUsuarios/COBROS/ADM_ENTIDADES",
        component: AdminUsuarios,
        meta: {
          libre: false
        }
      },
      {
        path: "AdminUsuarios/COBROS/ADM_RECAUDACION",
        name: "AdminUsuarios/COBROS/ADM_RECAUDACION",
        component: AdminUsuarios,
        meta: {
          libre: false
        }
      },
      {
        path: "AdminUsuarios/ADMIN",
        name: "AdminUsuarios/ADMIN",
        component: AdminUsuarios,
        meta: {
          libre: false
        }
      },
      
      {
        path: "/RegistroPersona",
        name: "RegistroPersona",
        component: RegistroPersona,
        meta: {
          libre: false
        }
      },
      {
        path: "/RecaudacionReporteCajero",
        name: "RecaudacionReporteCajero",
        component: RecaudacionReporteCajero,
        meta: {
          libre: false
        }
      },
      {
        path: "/GenerateCodigoControl",
        name: "GenerateCodigoControl",
        component: GenerateCodigoControl,
        meta: {
          libre: false
        }
      },  
      {
        path: "/SearchEntidadesDebts",
        name: "SearchEntidadesDebts",
        component: SearchEntidadesDebts,
        meta: {
          libre: false
        },
      },
      {
        path: "/LibroVentas",
        name: "LibroVentas",
        component: LibroVentas,
        meta: {
          libre: false
        }
      }, 
      {
        path: "/ListInvoices/:entidadId",
        name: "ListInvoicesA",
        component: ListInvoicesA,
        meta: {
          libre: false
        },
      },
      {
        path: "/ListInvoices/:entidadId",
        name: "ListInvoicesAR",
        component: ListInvoicesAR,
        meta: {
          libre: false
        },
      },
      {
        path: "/ListInvoices/:entidadId",
        name: "ListInvoicesR",
        component: ListInvoicesR,
        meta: {
          libre: false
        },
      },
      {
        path: "/SearchEntidadesInvoicesA",
        name: "SearchEntidadesInvoicesA",
        component: SearchEntidadesInvoicesA,
        meta: {
          libre: false
        },
      },
      {
        path: "/SearchEntidadesInvoicesAR",
        name: "SearchEntidadesInvoicesAR",
        component: SearchEntidadesInvoicesAR,
        meta: {
          libre: false
        },
      },
      {
        path: "/SearchEntidadesInvoicesR",
        name: "SearchEntidadesInvoicesR",
        component: SearchEntidadesInvoicesR,
        meta: {
          libre: false
        },
      },
      {
        path: "/Dosificaciones",
        name: "Dosificaciones",
        component: Dosificaciones,
        meta: {
          libre: false
        },
      },
      {
        path: "/RegCredenciales",
        name: "RegCredenciales",
        component: RegCredenciales,
        meta: {
          libre: false
        },
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
    } else {

      next();
    }
  } else {
    next({ name: "login" });
  }
});

export default router;
