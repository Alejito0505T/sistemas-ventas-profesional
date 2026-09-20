const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/clienteController');

router.get('/', ClienteController.listar);
router.get('/:id', ClienteController.obtenerUno);
router.post('/', ClienteController.crear);
router.put('/:id', ClienteController.actualizar);
router.delete('/:id', ClienteController.eliminar);

module.exports = router;