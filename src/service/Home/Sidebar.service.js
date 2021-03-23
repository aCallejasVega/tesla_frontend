import Api from '../api.services';

export default {
  headersConfig() {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${token}`,
    };
    const configuracion = {
      headers,
    };
    return configuracion;
  },
 
  getMenu() {
    return Api().get("api/Menu/", this.headersConfig());
  },

  getOpciones(tabla) {
    return Api().get(`api/Menu/getOperaciones/${tabla}`, this.headersConfig());
  },

  getOpcionesByEstado(tabla, estadoInicial) {
    if(estadoInicial != null)
      return Api().get(`api/Menu/operaciones/${tabla}/${estadoInicial}`, this.headersConfig());
    else 
      return Api().get(`api/Menu/operaciones/${tabla}`, this.headersConfig());
  },

};
