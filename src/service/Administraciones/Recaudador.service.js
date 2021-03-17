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
  getRecaudador(recaudadorId) {
    return Api().get(`api/recaudadores/${recaudadorId}`, this.headersConfig());
  },
  getLstRecaudadores() {
    return Api().get(`api/recaudadores`, this.headersConfig());
  },
  postRecaudador(recaudadorObj) {
    console.log(JSON.stringify(recaudadorObj))
    return Api().post(`api/recaudadores`, recaudadorObj, this.headersConfig());
  },
  putRecaudadorTransaccion(recaudadorId, transaccion) {
    return Api().put(`api/recaudadores/${recaudadorId}/${transaccion}`, {}, this.headersConfig());
  },
  putLstRecaudadorTransaccion(recaudadorIdLst, transaccion) {
    return Api().put(`api/recaudadores/listas/${transaccion}`, recaudadorIdLst, this.headersConfig());
  },

  //Entidades
  postEntidadRecaudador(entidadIdList, recaudadorId){
    return Api().post(`api/entidadesrecaudadores/recaudadores/${recaudadorId}`, entidadIdList, this.headersConfig());
  }, 
  
};
