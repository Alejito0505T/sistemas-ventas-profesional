const request = require('supertest');
const express = require('express');
const ventaRoutes = require('./src/routes/ventaRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/ventas', ventaRoutes);
app.use(errorHandler);

describe('Módulo de Ventas - Pruebas Unitarias', () => {

    test('GET /api/ventas debe responder con código 200', async () => {
        const respuesta = await request(app).get('/api/ventas');
        expect(respuesta.statusCode).toBe(200);
    });

    test('GET /api/ventas debe responder con un arreglo de datos', async () => {
        const respuesta = await request(app).get('/api/ventas');
        expect(Array.isArray(respuesta.body.datos)).toBe(true);
    });

    test('POST /api/ventas con arreglo de productos vacío debe responder 400', async () => {
        const respuesta = await request(app)
            .post('/api/ventas')
            .send({
                cliente_id: 1,
                metodo_pago: 'Efectivo',
                productos: []
            });
        expect(respuesta.statusCode).toBe(400);
        expect(respuesta.body.errores.some(e => e.campo === 'productos')).toBe(true);
    });

    test('POST /api/ventas con metodo_pago inválido debe responder 400', async () => {
        const respuesta = await request(app)
            .post('/api/ventas')
            .send({
                cliente_id: 1,
                metodo_pago: 'Criptomoneda',
                productos: [{ producto_id: 1, cantidad: 1, precio_unitario: 10000 }]
            });
        expect(respuesta.statusCode).toBe(400);
        expect(respuesta.body.errores.some(e => e.campo === 'metodo_pago')).toBe(true);
    });

    test('GET /api/ventas/:id con ID inexistente debe responder 404', async () => {
        const respuesta = await request(app).get('/api/ventas/999999');
        expect(respuesta.statusCode).toBe(404);
    });

    test('PUT /api/ventas/:id/anular con ID inexistente debe responder 404', async () => {
        const respuesta = await request(app).put('/api/ventas/999999/anular');
        expect(respuesta.statusCode).toBe(404);
    });

});