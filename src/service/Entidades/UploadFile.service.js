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
  processFile(archivoId) {
    return Api().post(`api/deudaCliente/processFile/${archivoId}`, {}, this.headersConfig());
  },
  findDeudasClientesByArchivoId(archivoId, page,paramBusqueda) {
    return Api().get(`api/deudaCliente/findDeudasClientesByArchivoId/${archivoId}/${page}/${paramBusqueda}`, this.headersConfig());
  },

};