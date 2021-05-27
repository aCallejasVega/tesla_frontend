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
  getSucursal(sucursalId) {
    return Api().get(`api/sucursales/${sucursalId}`, this.headersConfig());
  },
  getLstSucursales() {
    return Api().get(`api/sucursales`, this.headersConfig());
  },
  getLstSucursales(recaudadorId) {
    if(recaudadorId != null)
      return Api().get(`api/sucursales/recaudadores/${recaudadorId}`, this.headersConfig());
    else  
      return Api().get(`api/sucursales/recaudadores`, this.headersConfig());
  },
  postSucursal(sucursalObj) {
    return Api().post(`api/sucursales`, sucursalObj, this.headersConfig());
  },
  putSucursalTransaccion(sucursalId, transaccion) {
    return Api().put(`api/sucursales/${sucursalId}/${transaccion}`, {}, this.headersConfig());
  },
  putLstSucursalTransaccion(sucursalIdLst, transaccion) {
    return Api().put(`api/sucursales/listas/${transaccion}`, sucursalIdLst, this.headersConfig());
  },
  
  
};
