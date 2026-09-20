const express = require('express');
const router = express.Router();
const ProductoController = require('../controllers/productoController');
const { reglasProducto, validar } = require('../middlewares/productoValidator');

router.get('/stock-bajo', ProductoController.stockBajo);
router.get('/', ProductoController.listar);
router.get('/:id', ProductoController.obtenerUno);
router.post('/', reglasProducto, validar, ProductoController.crear);
router.put('/:id', reglasProducto, validar, ProductoController.actualizar);
router.delete('/:id', ProductoController.eliminar);

module.exports = router;