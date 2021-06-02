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
    /*linealChart(formBusqueda) {
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

        return Api().post(`api/ReportEntidad/linealChart`, formBusqueda, this.headersConfig());
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

        return Api().post(`api/ReportEntidad/pieChart`, formBusqueda, this.headersConfig());
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

        return Api().post(`api/ReportEntidad/columnChart`, formBusqueda, this.headersConfig());
    },
*/

    findDeudasByParameterForReport(formBusqueda) {

        return Api().post(`api/ReportEntidad/findDeudasByParameter`, formBusqueda, this.headersConfig());
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
    openModalGenerarReporte(formBusqueda) {

        return Api().post(`api/ReportEntidad/findDeudasByParameterForReport`, formBusqueda, {
            responseType: 'arraybuffer',
            headers: {
              'Accept': 'application/pdf',
              Authorization: `Bearer `+localStorage.getItem("token")
            }
      });
    },

    /*
     Archivos Historicos Deudas
    */ 
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
          `api/ReportEntidad/findArchivos/${paginacion}/${fechaInicio}/${fechaFin}/${estado}`,
          this.headersConfig()
        );
      },
    
     
    
      findDominioByDominio() {
        return Api().get(
          `api/dominios/findByDominio/tipo_reporte_id`,
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

      openReportesPorArchivo(formBusqueda) {


        let urlReporte = `api/ReportEntidad/findDeudasByArchivoIdAndEstado/${formBusqueda.archivoId}/${formBusqueda.export}`;
        return Api().get(urlReporte, {
            responseType: 'arraybuffer',
            headers: {
              'Accept': 'application/pdf',
              Authorization: `Bearer `+localStorage.getItem("token")
            }
      });
    },

     /*
     REPORTES LA RAZON
    */ 
     downloaArchivo(formBusqueda) {

        return Api().post(`api/ReportLaRazon/downloaArchivo`, formBusqueda, {
            responseType: 'arraybuffer',
            headers: {
              'Accept': 'text/csv',
              Authorization: `Bearer ` + localStorage.getItem("token")
            }
      });
    },


};
