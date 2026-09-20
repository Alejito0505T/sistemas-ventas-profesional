require('dotenv').config();
const express = require('express');
const cors = require('cors');

const clienteRoutes = require('./src/routes/clienteRoutes');
const productoRoutes = require('./src/routes/productoRoutes');
const ventaRoutes = require('./src/routes/ventaRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        nombre: 'API Sistema de Gestión de Ventas e Inventario',
        version: '2.0.0',
        endpoints: {
            clientes: {
                'GET    /api/clientes': 'Listar todos los clientes',
                'GET    /api/clientes/:id': 'Obtener un cliente por ID',
                'POST   /api/clientes': 'Registrar un nuevo cliente',
                'PUT    /api/clientes/:id': 'Actualizar un cliente',
                'DELETE /api/clientes/:id': 'Eliminar un cliente'
            }
        }
    });
});

app.use('/api/clientes', clienteRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/ventas', ventaRoutes);
app.use((req, res) => {
    res.status(404).json({
        ok: false,
        mensaje: `La ruta "${req.method} ${req.path}" no existe.`
    });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});