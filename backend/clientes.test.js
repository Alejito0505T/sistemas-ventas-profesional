const request = require('supertest');
const express = require('express');
const clienteRoutes = require('./src/routes/clienteRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/clientes', clienteRoutes);
app.use(errorHandler);

describe('Módulo de Clientes - Pruebas Unitarias', () => {

    test('GET /api/clientes debe responder con código 200', async () => {
        const respuesta = await request(app).get('/api/clientes');
        expect(respuesta.statusCode).toBe(200);
    });

    test('GET /api/clientes debe responder con "ok": true', async () => {
        const respuesta = await request(app).get('/api/clientes');
        expect(respuesta.body.ok).toBe(true);
    });

    test('GET /api/clientes debe responder con un arreglo de datos', async () => {
        const respuesta = await request(app).get('/api/clientes');
        expect(Array.isArray(respuesta.body.datos)).toBe(true);
    });

    test('POST /api/clientes sin campos obligatorios debe responder 400', async () => {
        const respuesta = await request(app)
            .post('/api/clientes')
            .send({ telefono: '3001234567' });
        expect(respuesta.statusCode).toBe(400);
    });

    test('POST /api/clientes con email inválido debe responder 400 con el error específico', async () => {
        const respuesta = await request(app)
            .post('/api/clientes')
            .send({
                nombres: 'Test',
                apellidos: 'Validación',
                tipo_doc: 'CC',
                num_doc: '11111111',
                email: 'correo-invalido'
            });
        expect(respuesta.statusCode).toBe(400);
        expect(respuesta.body.errores.some(e => e.campo === 'email')).toBe(true);
    });

    test('GET /api/clientes/:id con ID inexistente debe responder 404', async () => {
        const respuesta = await request(app).get('/api/clientes/999999');
        expect(respuesta.statusCode).toBe(404);
    });

});