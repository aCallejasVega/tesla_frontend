import Api from "../api.services";

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
  getDosificacionesLst() {
    return Api().get(`api/dosificaciones`, this.headersConfig());
  },
  getDosificacionById(dosificacionId) {
    return Api().get(`api/dosificaciones/${dosificacionId}`, this.headersConfig());
  },
  postDosificacion(dosificacionObj) {
    return Api().post(`api/dosificaciones`, dosificacionObj, this.headersConfig());
  },
  putTransaccion(dosificacionId, transaccion) {
    return Api().put(`api/dosificaciones/${dosificacionId}/transacciones/${transaccion}`, null, this.headersConfig());
  },
  getDosificacionesLstAlertas() {
    return Api().get(`api/dosificaciones/alertas`, this.headersConfig());
  },
};
