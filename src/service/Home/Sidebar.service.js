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
    return Api().get("api/Menu/menu", this.headersConfig());
  },
  getSubMenu() {
    return Api().get("api/Menu/subMenu", this.headersConfig());
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
  getDatosLogin(){
    return Api().get(`api/Menu/getDatosLogin`, this.headersConfig());
  },
  //Facturacion Computarizada
  getOperacionesFacturacionLst(tabla, estadoInicial){
    return Api().get(`api/menufacturas/operaciones/${tabla}/estados/${estadoInicial}`, this.headersConfig());    
  }
};
