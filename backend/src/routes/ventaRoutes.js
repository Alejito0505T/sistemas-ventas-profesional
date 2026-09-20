const express = require('express');
const router = express.Router();
const VentaController = require('../controllers/ventaController');

router.get('/', VentaController.listar);
router.get('/:id', VentaController.obtenerUna);
router.post('/', VentaController.crear);
router.put('/:id/anular', VentaController.anular);

module.exports = router;