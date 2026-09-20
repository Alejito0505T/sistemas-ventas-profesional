const express = require('express');
const router = express.Router();
const VentaController = require('../controllers/ventaController');
const { reglasVenta, validar } = require('../middlewares/ventaValidator');

router.get('/', VentaController.listar);
router.get('/:id', VentaController.obtenerUna);
router.post('/', reglasVenta, validar, VentaController.crear);
router.put('/:id/anular', VentaController.anular);

module.exports = router;