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
  /*getActividadesEconomicasFilter(codigoActividadEconomica) {
    if(codigoActividadEconomica != null || codigoActividadEconomica != '')
      return Api().get(`api/actividadeseconomicas/${codigoActividadEconomica}`, this.headersConfig());
    else  
      return Api().get(`api/actividadeseconomicas`, this.headersConfig());
  },*/
  getActividadesEconomicasByCodigo(codigoActividadEconomica) {
      return Api().get(`api/actividadeseconomicas/${codigoActividadEconomica}`, this.headersConfig());
  },
  getActividadesEconomicas(entidadId) {
    if(entidadId != null)
      return Api().get(`api/actividadeseconomicas/entidades/${entidadId}`, this.headersConfig());
    else 
      return Api().get(`api/actividadeseconomicas`, this.headersConfig());
  }
};
