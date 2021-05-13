import Api from "../api.services";
import moment from "moment";
import "moment/locale/es";
export default {
    headersConfig() {
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: `Bearer ${token}`
        };
        const configuracion = {
            headers
        };
        return configuracion;
    },
   

    findDeudasByParameterForReport(formBusqueda) {

        return Api().post(`api/ReportRecaudacion/findDeudasByParameter`, formBusqueda, this.headersConfig());
    },
    getEstadoHistoricos() {
        return Api().get(
            `api/historicoDeuda/findEstadoHistorico`,
            this.headersConfig()
        );
    },
    getEntidadesByRecaudadora() {
        return Api().get(`api/entidades/findEntidadByRecaudacionId`, this.headersConfig());
    },
    openModalGenerarReporte(formBusqueda) {

        return Api().post(`api/ReportRecaudacion/findDeudasByParameterForReport`, formBusqueda, {
            responseType: 'arraybuffer',
            headers: {
              'Accept': 'application/pdf',
              Authorization: `Bearer `+localStorage.getItem("token")
            }
      });
    },
    findDeudasCobradasByUsuarioCreacionForGrid(formBusqueda) {
        return Api().post(`api/ReportRecaudacion/findDeudasCobradasByUsuarioCreacionForGrid`, formBusqueda, {
            responseType: 'arraybuffer',
            headers: {
              'Accept': 'application/pdf',
              Authorization: `Bearer `+localStorage.getItem("token")
            }
      });
    },


};
