class DashboardService {

    static async obtenerResumen() {
        const respuesta = await ApiClient.get('/dashboard/resumen');
        return respuesta.datos;
    }
}