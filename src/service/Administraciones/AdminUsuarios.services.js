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
  getOperaciones(tablaId, estadoInicial) {
    return Api().get(`api/Menu/operaciones/${tablaId}/${estadoInicial}`, this.headersConfig());
  },
  findPersonas(formBusqueda) {
    return Api().post(`api/personas/findPersonas`, formBusqueda, this.headersConfig());
  },
  getDominioExtensionDocumento() {
    return Api().get(`api/dominios/extension_documento_id`, this.headersConfig());
  },
  getDominioTipoDocumento() {
    return Api().get(`api/dominios/tipo_documento_id`, this.headersConfig());
  },
  getDominioCiudad() {
    return Api().get(`api/dominios/ciudad_id`, this.headersConfig());
  },
  savePersona(form) {
    return Api().post(`api/personas/savePersona`, form, this.headersConfig());
  },
  updatePersona(form) {
    return Api().post(`api/personas/updatePersona`, form, this.headersConfig());
  },
  cambiarEstadoPersona(form) {
    return Api().post(`api/personas/cambiarEstado`, form, this.headersConfig());
  },
  getSucursalesByEntidad() {
    return Api().get(`api/sucursalesentidades/entidades`, this.headersConfig());
  },
  getSucursalesByRecaudadora() {
    return Api().get(`api/sucursales/findByRecaudadoraId`, this.headersConfig());
  },
  generarCredenciales(personaId) {
    return Api().post(`api/personas/generarCredenciales/${personaId}`, {}, this.headersConfig());
  },
  generarCredenciales(personaId) {
    return Api().post(`api/personas/generarCredenciales/${personaId}`, {}, this.headersConfig());
  },
  findRolesForTransfer(subModulo, modulo) {
    return Api().get(`api/Rol/findRolesForTransfer/${subModulo}/${modulo}`, this.headersConfig());
  },
  findRolesForTransferByUsuario(subModulo, modulo, usuarioId) {
    return Api().get(`api/Rol/findRolesForTransferByUsuario/${subModulo}/${modulo}/${usuarioId}`, this.headersConfig());
  },
  getModuloUsuario() {
    return Api().get(`api/Rol/getModuloUsuario`, this.headersConfig());
  },
  savePrivilegio(datosRoles) {
    return Api().post(`api/Rol/savePrivilegio`, datosRoles, this.headersConfig());
  },
  findAllEntidad() {
    return Api().get(`api/entidades/findAllEntidad`, this.headersConfig());
  },
  findAllRecaudadoras() {
    return Api().get(`api/recaudadores/findAllRecaudadoras`, this.headersConfig());
  },
  findModulos() {
    return Api().get(`api/Rol/findModulos`, this.headersConfig());
  },
  findPrivilegiosByModuloId(moduloId) {
    return Api().get(`api/Rol/findPrivilegiosByModuloId/${moduloId}`, this.headersConfig());
  },

  findPrivilegiosByUsuarioId(usuarioId) {
    return Api().get(`api/Rol/findPrivilegiosByUsuarioId/${usuarioId}`, this.headersConfig());
  },

  findModuloByUsuarioId(usuarioId) {
    return Api().get(`api/Rol/findModuloByUsuarioId/${usuarioId}`, this.headersConfig());
  },

  findPrivilegiosByUsuarioIdSession(subModulo) {
    return Api().get(`api/Rol/findPrivilegiosByUsuarioIdForTransfer/${subModulo}`, this.headersConfig());
  },

  findModuloByUsuarioSession() {
    return Api().get(`api/Rol/findModuloByUsuarioSession`, this.headersConfig());
  },


};