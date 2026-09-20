const express = require('express');
const router = express.Router();
const ProductoController = require('../controllers/productoController');

router.get('/stock-bajo', ProductoController.stockBajo);
router.get('/', ProductoController.listar);
router.get('/:id', ProductoController.obtenerUno);
router.post('/', ProductoController.crear);
router.put('/:id', ProductoController.actualizar);
router.delete('/:id', ProductoController.eliminar);

module.exports = router;