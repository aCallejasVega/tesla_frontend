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
    return Api().get(`api/adm/entidadessucursales/${sucursalEntidadId}`, this.headersConfig());
  },
  getLstSucursalEntidad() {
    return Api().get(`api/adm/sucursalesentidades`, this.headersConfig());
  },
  getLstSucursalEntidadByEntidadId(entidadId) {
    return Api().get(`api/adm/sucursalesentidades/entidades/${entidadId}`, this.headersConfig());
  },
  postSucursalEntidad(sucursalEntidadObj) {
    console.log(JSON.stringify(sucursalEntidadObj))
    return Api().post(`api/adm/sucursalesentidades`, sucursalEntidadObj, this.headersConfig());
  },
  putSucursalEntidadTransaccion(sucursalEntidadId, transaccion) {
    return Api().put(`api/adm/sucursalesentidades/${sucursalEntidadId}/${transaccion}`, {}, this.headersConfig());
  },
  
};
