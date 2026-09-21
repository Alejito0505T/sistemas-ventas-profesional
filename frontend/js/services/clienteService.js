class ClienteService {

    static async listar() {
        const respuesta = await ApiClient.get('/clientes');
        return respuesta.datos;
    }

    static async obtenerPorId(id) {
        const respuesta = await ApiClient.get(`/clientes/${id}`);
        return respuesta.datos;
    }

    static async crear(cliente) {
        const respuesta = await ApiClient.post('/clientes', cliente);
        return respuesta.datos;
    }

    static async actualizar(id, cliente) {
        return await ApiClient.put(`/clientes/${id}`, cliente);
    }

    static async eliminar(id) {
        return await ApiClient.delete(`/clientes/${id}`);
    }
    static async reactivar(id) {
    return await ApiClient.put(`/clientes/${id}/reactivar`, {});
    }
}