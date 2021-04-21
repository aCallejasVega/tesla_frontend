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
    cargarTiposEntidades() {
        return Api().get(`api/entidades/findTipoEntidadPagadoras`, this.headersConfig());
    },
    findByProductosByParametros(paramBusqueda) {
        return Api().get(`api/servicioProductos/findByProductos/busqueda/${paramBusqueda}`, this.headersConfig());
    },
    findByProductosByTipoEntidad(tipoEntidad) {
        return Api().get(`api/servicioProductos/findByProductos/tipo/${tipoEntidad}`, this.headersConfig());
    },

    getAbonosParaPagar(servicioProductoId,paramBusqueda) {
        return Api().get(`api/recaudadoraPagos/getBeneficiariosParaPagar/${servicioProductoId}/${paramBusqueda}`, this.headersConfig());
    },
    getAbonado(archivoId,codigoCliente,nroDocumentoCliente) {
        return Api().get(`api/recaudadoraPagos/getBeneficiario/${archivoId}/${codigoCliente}/${nroDocumentoCliente}`, this.headersConfig());
    },
    getServicioProductos(servicioProductoId){
        return Api().get(`api/servicioProductos/findById/${servicioProductoId}`, this.headersConfig());
    },
    realizarPago(pagosList) {

        return Api().post(`api/recaudadoraPagos/realizarPago`, pagosList, {
            responseType: 'arraybuffer',
            headers: {
              'Accept': 'application/pdf',
              Authorization: `Bearer `+localStorage.getItem("token")
            }
      });
    },
    verificarPeriodo(archivoId,codigoCliente,nroRegistro, periodo){
        return Api().get(`api/recaudadoraPagos/verificarPrelacion/${archivoId}/${codigoCliente}/${nroRegistro}/${periodo}`, this.headersConfig());
    },

};
