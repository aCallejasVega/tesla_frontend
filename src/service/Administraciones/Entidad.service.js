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
  getEntidad(entidadId) {
    return Api().get(`api/adm/entidades/${entidadId}`, this.headersConfig());
  },
  getLstEntidad() {
    return Api().get(`api/adm/entidades`, this.headersConfig());
  },
  postEntidad(entidadObj) {
    console.log(JSON.stringify(entidadObj))
    return Api().post(`api/adm/entidades`, entidadObj, this.headersConfig());
  },
  putEntidadTransaccion(entidadId, transaccion) {
    return Api().put(`api/adm/entidades/${entidadId}/${transaccion}`, {}, this.headersConfig());
  },
  putLstEntidadTransaccion(entidadIdLst, transaccion) {
    return Api().put(`api/adm/entidades/listas/${transaccion}`, entidadIdLst, this.headersConfig());
  },
  

  
  
};
