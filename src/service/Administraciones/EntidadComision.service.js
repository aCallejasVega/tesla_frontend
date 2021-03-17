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
  getEntidadComision(entidadComisionId) {
    return Api().get(`api/comisiones/${entidadComisionId}`, this.headersConfig());
  },
  getlstEntidadesComisionesByEntidadId(entidadId) {
    return Api().get(`api/comisiones/entidades/${entidadId}`, this.headersConfig());
  },
  postEntidadComision(entidadComisionObj) {
    return Api().post(`api/comisiones`, entidadComisionObj, this.headersConfig());
  },
   
  
};
