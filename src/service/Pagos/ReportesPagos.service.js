import Api from '../api.services';
import moment from "moment";
import "moment/locale/es";
export default {
    headersConfig() {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            Authorization: `Bearer ${token}`,
        };
        const configuracion = {
            headers,
        };
        return configuracion;
    },

    getServiciosProductos() {
        return Api().get(`api/servicioProductos/findByEntidadIdForSelect`, this.headersConfig());
    },
    getRecaudadoresByEntidad() {
        return Api().get(`api/recaudadores/findRecaudadoresByEntidadId`, this.headersConfig());
    },
    getEstadoHistoricos() {
        return Api().get(`api/historicoDeuda/findEstadoHistoricoPagos`, this.headersConfig());
    },
    listForGridEntidad(formBusqueda) {
       
        return Api().post(`api/reportePagos/listForGridEntidad`, formBusqueda, this.headersConfig());
    },
    listForReportEntidad(formBusqueda) {
       
        return Api().post(`api/reportePagos/listForReportEntidad`, formBusqueda,  {
            responseType: 'arraybuffer',
            headers: {
                'Accept': 'application/pdf',
                Authorization: `Bearer ` + localStorage.getItem("token")
            }
        });
    },
    findServiciosForRecaudadorId() {       
        return Api().get(`api/servicioProductos/findServiciosForRecaudadorId`, this.headersConfig());
    },
    listForGridRecaudacion(formBusqueda) {       
        return Api().post(`api/reportePagos/listForGridRecaudacion`, formBusqueda, this.headersConfig());
    },
    listForReportRecaudacion(formBusqueda) {       
        return Api().post(`api/reportePagos/listForReportRecaudacion`, formBusqueda,  {
            responseType: 'arraybuffer',
            headers: {
                'Accept': 'application/pdf',
                Authorization: `Bearer ` + localStorage.getItem("token")
            }
        });
    },
    findForSelect() {       
        return Api().get(`api/servicioProductos/findForSelect`, this.headersConfig());
    },
    findRecaudadoresByEntidadId(servicioProductoId) {       
        return Api().get(`api/recaudadores/findRecaudadoresByservicioProductoId/${servicioProductoId}`, this.headersConfig());
    },
    listForGridAdministracion(formBusqueda) {       
        return Api().post(`api/reportePagos/listForGridAdministracion`, formBusqueda, this.headersConfig());
    },
    listForReportAdministracion(formBusqueda) {       
        return Api().post(`api/reportePagos/listForReportAdministracion`, formBusqueda,  {
            responseType: 'arraybuffer',
            headers: {
                'Accept': 'application/pdf',
                Authorization: `Bearer ` + localStorage.getItem("token")
            }
        });
    },

};
