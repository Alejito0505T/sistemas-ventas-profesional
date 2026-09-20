class ProductoService {

    static async listar() {
        const respuesta = await ApiClient.get('/productos');
        return respuesta.datos;
    }

    static async obtenerPorId(id) {
        const respuesta = await ApiClient.get(`/productos/${id}`);
        return respuesta.datos;
    }

    static async obtenerStockBajo() {
        const respuesta = await ApiClient.get('/productos/stock-bajo');
        return respuesta.datos;
    }

    static async crear(producto) {
        const respuesta = await ApiClient.post('/productos', producto);
        return respuesta.datos;
    }

    static async actualizar(id, producto) {
        return await ApiClient.put(`/productos/${id}`, producto);
    }

    static async eliminar(id) {
        return await ApiClient.delete(`/productos/${id}`);
    }
}