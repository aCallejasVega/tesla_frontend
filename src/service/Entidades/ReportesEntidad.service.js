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
  linealChart(formBusqueda) {
    if (formBusqueda.fechaInicio == "Invalid date" || formBusqueda.fechaInicio == "null" || formBusqueda.fechaInicio == null) {
        formBusqueda.fechaInicio = moment("01/01/2021", "DD/MM/YYYY");
    } else {
        formBusqueda.fechaInicio = moment(formBusqueda.fechaInicio, "DD/MM/YYYY");
    }
    if (formBusqueda.fechaFin == "Invalid date" || formBusqueda.fechaFin == "null" || formBusqueda.fechaFin == null) {
        formBusqueda.fechaFin = moment("01/01/2100", "DD/MM/YYYY");
    } else {
        formBusqueda.fechaFin = moment(formBusqueda.fechaFin, "DD/MM/YYYY");
    }
    if (formBusqueda.estado == "" || formBusqueda.estado == null) {
        formBusqueda.estado = "%";
    }
    if (formBusqueda.recaudadorId == "" || formBusqueda.recaudadorId == null) {
        formBusqueda.recaudadorId = "%";
    }
   
    return Api().post(`api/ReportEntidad/linealChart`,formBusqueda,this.headersConfig() );
  },
  pieChart(formBusqueda) {
    if (formBusqueda.fechaInicio == "Invalid date" || formBusqueda.fechaInicio == "null" || formBusqueda.fechaInicio == null) {
        formBusqueda.fechaInicio = moment("01/01/2021", "DD/MM/YYYY");
    } else {
        formBusqueda.fechaInicio = moment(formBusqueda.fechaInicio, "DD/MM/YYYY");
    }
    if (formBusqueda.fechaFin == "Invalid date" || formBusqueda.fechaFin == "null" || formBusqueda.fechaFin == null) {
        formBusqueda.fechaFin = moment("01/01/2100", "DD/MM/YYYY");
    } else {
        formBusqueda.fechaFin = moment(formBusqueda.fechaFin, "DD/MM/YYYY");
    }
    if (formBusqueda.estado == "" || formBusqueda.estado == null) {
        formBusqueda.estado = "%";
    }
    if (formBusqueda.recaudadorId == "" || formBusqueda.recaudadorId == null) {
        formBusqueda.recaudadorId = "%";
    }
   
    return Api().post(`api/ReportEntidad/pieChart`,formBusqueda,this.headersConfig() );
  },
  columnChart(formBusqueda) {
    if (formBusqueda.fechaInicio == "Invalid date" || formBusqueda.fechaInicio == "null" || formBusqueda.fechaInicio == null) {
        formBusqueda.fechaInicio = moment("01/01/2021", "DD/MM/YYYY");
    } else {
        formBusqueda.fechaInicio = moment(formBusqueda.fechaInicio, "DD/MM/YYYY");
    }
    if (formBusqueda.fechaFin == "Invalid date" || formBusqueda.fechaFin == "null" || formBusqueda.fechaFin == null) {
        formBusqueda.fechaFin = moment("01/01/2100", "DD/MM/YYYY");
    } else {
        formBusqueda.fechaFin = moment(formBusqueda.fechaFin, "DD/MM/YYYY");
    }
    if (formBusqueda.estado == "" || formBusqueda.estado == null) {
        formBusqueda.estado = "%";
    }
    if (formBusqueda.recaudadorId == "" || formBusqueda.recaudadorId == null) {
        formBusqueda.recaudadorId = "%";
    }
   
    return Api().post(`api/ReportEntidad/columnChart`,formBusqueda,this.headersConfig() );
  }

};
