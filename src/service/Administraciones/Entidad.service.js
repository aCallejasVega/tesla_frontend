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
    return Api().get(`api/entidades/${entidadId}`, this.headersConfig());
  },
  getLstEntidad() {
    return Api().get(`api/entidades`, this.headersConfig());
  },
  postEntidad(entidadObj) {
    return Api().post(`api/entidades`, entidadObj, this.headersConfig());
  },
  putEntidadTransaccion(entidadId, transaccion) {
    return Api().put(`api/entidades/${entidadId}/${transaccion}`, {}, this.headersConfig());
  },
  putLstEntidadTransaccion(entidadIdLst, transaccion) {
    return Api().put(`api/entidades/listas/${transaccion}`, entidadIdLst, this.headersConfig());
  },
  
  //Recaudadores
  postEntidadRecaudador(recaudadorIdList, entidadId){
    return Api().post(`api/entidadesrecaudadores/entidades/${entidadId}`, recaudadorIdList, this.headersConfig());
  }, 
  //Flie
  postLogo(file, entidadId) {
    return Api().post(`api/entidades/upload/logo/${entidadId}`, {file}, this.headersConfig());
  },
  
  getLogo(entidadId) {
    return Api().get(`api/entidades/download/logo/${entidadId}`, this.headersConfig());
  },
  
};
