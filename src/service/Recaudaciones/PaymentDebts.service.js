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
  cargarTiposEntidades() {
    return Api().get(`api/entidades/tipos`, this.headersConfig());
  },
  cargarEntidades(tipo) {
    return Api().get(`api/entidades/tipos/${tipo}`, this.headersConfig());
  },
  cargarTodasEntidades() {
    return Api().get(`api/entidades`, this.headersConfig());
  },
  cargarClientes(entidadId,datoCliente) {
    return Api().get(`api/entidades/${entidadId}/clientes/${datoCliente}`, this.headersConfig());
  },
  cargarServicioDeudas(entidadId,codigoCliente) {
    return Api().get(`api/entidades/${entidadId}/clientes/${codigoCliente}/deudas`, this.headersConfig());
  },

};
