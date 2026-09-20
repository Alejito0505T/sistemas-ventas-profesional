const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : 'https://sistemas-ventas-profesional.onrender.com/';

class ApiClient {

    static async get(endpoint) {
        const respuesta = await fetch(`${API_BASE_URL}${endpoint}`);
        return this.procesarRespuesta(respuesta);
    }

    static async post(endpoint, datos) {
        const respuesta = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        return this.procesarRespuesta(respuesta);
    }

    static async put(endpoint, datos) {
        const respuesta = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        return this.procesarRespuesta(respuesta);
    }

    static async delete(endpoint) {
        const respuesta = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE'
        });
        return this.procesarRespuesta(respuesta);
    }

    static async procesarRespuesta(respuesta) {
        const datos = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(datos.mensaje || 'Error en la petición');
        }
        return datos;
    }
}