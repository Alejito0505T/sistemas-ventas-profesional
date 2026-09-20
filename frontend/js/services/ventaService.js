class VentaService {

    static async listar() {
        const respuesta = await ApiClient.get('/ventas');
        return respuesta.datos;
    }

    static async obtenerPorId(id) {
        const respuesta = await ApiClient.get(`/ventas/${id}`);
        return respuesta.datos;
    }

    static async crear(venta) {
        const respuesta = await ApiClient.post('/ventas', venta);
        return respuesta.datos;
    }

    static async anular(id) {
        return await ApiClient.put(`/ventas/${id}/anular`, {});
    }
}