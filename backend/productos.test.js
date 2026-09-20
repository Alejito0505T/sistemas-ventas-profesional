const request = require('supertest');
const express = require('express');
const productoRoutes = require('./src/routes/productoRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/productos', productoRoutes);
app.use(errorHandler);

describe('Módulo de Productos - Pruebas Unitarias', () => {

    test('GET /api/productos debe responder con código 200', async () => {
        const respuesta = await request(app).get('/api/productos');
        expect(respuesta.statusCode).toBe(200);
    });

    test('GET /api/productos debe responder con un arreglo de datos', async () => {
        const respuesta = await request(app).get('/api/productos');
        expect(Array.isArray(respuesta.body.datos)).toBe(true);
    });

    test('GET /api/productos/stock-bajo debe responder con código 200', async () => {
        const respuesta = await request(app).get('/api/productos/stock-bajo');
        expect(respuesta.statusCode).toBe(200);
    });

    test('POST /api/productos con precio_venta negativo debe responder 400', async () => {
        const respuesta = await request(app)
            .post('/api/productos')
            .send({
                categoria_id: 1,
                codigo: 'TEST-001',
                nombre: 'Producto de prueba',
                precio_venta: -100
            });
        expect(respuesta.statusCode).toBe(400);
        expect(respuesta.body.errores.some(e => e.campo === 'precio_venta')).toBe(true);
    });

    test('POST /api/productos sin categoria_id debe responder 400', async () => {
        const respuesta = await request(app)
            .post('/api/productos')
            .send({
                codigo: 'TEST-002',
                nombre: 'Producto sin categoría',
                precio_venta: 10000
            });
        expect(respuesta.statusCode).toBe(400);
    });

    test('GET /api/productos/:id con ID inexistente debe responder 404', async () => {
        const respuesta = await request(app).get('/api/productos/999999');
        expect(respuesta.statusCode).toBe(404);
    });

});