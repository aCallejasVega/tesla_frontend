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

};
