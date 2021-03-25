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
    return Api().get(`api/comisionesentidades/${entidadComisionId}`, this.headersConfig());
  },
  getlstEntidadesComisionesByEntidadId(entidadId) {
    return Api().get(`api/comisionesentidades/entidades/${entidadId}`, this.headersConfig());
  },
  postEntidadComision(entidadComisionObj) {
    return Api().post(`api/comisionesentidades`, entidadComisionObj, this.headersConfig());
  },
   
  
};
