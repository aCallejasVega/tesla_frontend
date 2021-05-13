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
        return Api().get(`api/servicioProductos/findServiciosForRecaudadorId`, this.headersConfig());
    },
    reImpresionGrid(paramBusquedas) {
        return Api().post(`api/recaudadoraPagos/reImpresionGrid`,paramBusquedas, this.headersConfig());
    },
    imprimirComprobantePago(codigoTransaccion) {
        return Api().get(`api/recaudadoraPagos/imprimirComprobantePago/${codigoTransaccion}`,  {
            responseType: 'arraybuffer',
            headers: {
                'Accept': 'application/pdf',
                Authorization: `Bearer ` + localStorage.getItem("token")
            }
        });
    },
    
};
