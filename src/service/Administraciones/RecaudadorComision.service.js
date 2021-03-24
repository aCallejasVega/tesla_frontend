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
  getRecaudadorComision(recaudadorComisionId) {
    return Api().get(`api/comisionesrecaudadores/${recaudadorComisionId}`, this.headersConfig());
  },
  getlstRecaudadoresComisionesByRecaudadorId(recaudadorId) {
    return Api().get(`api/comisionesrecaudadores/recaudadores/${recaudadorId}`, this.headersConfig());
  },
  postRecaudadorComision(recaudadorComisionObj) {
    return Api().post(`api/comisionesrecaudadores`, recaudadorComisionObj, this.headersConfig());
  },
   
  
};
