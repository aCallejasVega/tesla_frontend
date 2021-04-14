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
    findByEntidadIdForSelect() {
        return Api().get(`api/servicioProductos/findByEntidadIdForSelect`, this.headersConfig());
    },
    processFile(archivoId) {
        return Api().post(`api/entidadPago/processFile/${archivoId}`, {}, this.headersConfig());
    },
    findAbonosClientes(archivoId, page, paramBusqueda) {
        return Api().get(`api/entidadPago/findBeneficiarios/${archivoId}/${page}/${paramBusqueda}`, this.headersConfig());
    },

};
