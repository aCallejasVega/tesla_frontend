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
  getSucursalEntidad(sucursalEntidadId) {
    return Api().get(`api/sucursalesentidades/${sucursalEntidadId}`, this.headersConfig());
  },
  getlstSucursalesEntidades() {
    return Api().get(`api/sucursalesentidades`, this.headersConfig());
  },
  getLstSucursalEntidadByEntidadId(entidadId) {
    return Api().get(`api/sucursalesentidades/entidades/${entidadId}`, this.headersConfig());
  },
  postSucursalEntidad(sucursalEntidadObj) {
    console.log(JSON.stringify(sucursalEntidadObj))
    return Api().post(`api/sucursalesentidades`, sucursalEntidadObj, this.headersConfig());
  },
  putSucursalEntidadTransaccion(sucursalEntidadId, transaccion) {
    return Api().put(`api/sucursalesentidades/${sucursalEntidadId}/${transaccion}`, {}, this.headersConfig());
  },
  putLstSucursalEntidadTransaccion(sucursaEntidadlIdLst, transaccion) {
    return Api().put(`api/sucursalesentidades/listas/${transaccion}`, sucursaEntidadlIdLst, this.headersConfig());
  },
  
};
