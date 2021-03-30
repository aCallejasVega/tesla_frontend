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

  findArchivos(paginacion, fechaInicio, fechaFin, estado) {

    if (fechaInicio == "Invalid date" || fechaInicio == "null" || fechaInicio == null) {
      fechaInicio = moment("01/01/2021", "DD/MM/YYYY");
    } else {
      fechaInicio = moment(fechaInicio, "DD/MM/YYYY");
    }
    if (fechaFin == "Invalid date" || fechaFin == "null" || fechaFin == null) {
      fechaFin = moment("01/01/2100", "DD/MM/YYYY");
    } else {
      fechaFin = moment(fechaFin, "DD/MM/YYYY");
    }
    if (estado == "") {
      estado = "null";
    }

    return Api().get(
      `api/historicoDeuda/findArchivos/${paginacion}/${fechaInicio}/${fechaFin}/${estado}`,
      this.headersConfig()
    );
  },

  findDeudasArchivoHistorico(archivoId, paginacion, parametroBusqueda) {
    return Api().get(
      `api/historicoDeuda/groupByDeudasClientes/${archivoId}/${paginacion}/${parametroBusqueda}`,
      this.headersConfig()
    );

  },

  findDominioByDominio() {
    return Api().get(
      `api/dominio/findByDominio/tipo_reporte_id`,
      this.headersConfig()
    );

  },
  getEstadoHistoricos() {
    return Api().get(
      `api/historicoDeuda/findEstadoHistorico`,
      this.headersConfig()
    );
  },
  getRecaudadoresByEntidad() {
    return Api().get(`api/recaudadores/findRecaudadoresByEntidadId`, this.headersConfig());

  },
  getCsv(archivoId) {
    return Api().get(`api/historicoDeuda/getCsv/${archivoId}`, {
      responseType: 'arraybuffer',
      headers: {
        'Accept': 'text/csv',
        Authorization: `Bearer ` + localStorage.getItem("token")
      }
    });
  },
};
