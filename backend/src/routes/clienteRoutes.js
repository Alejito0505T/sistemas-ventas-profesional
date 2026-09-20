const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/clienteController');
const { reglasCliente, validar } = require('../middlewares/clienteValidator');

router.get('/', ClienteController.listar);
router.get('/:id', ClienteController.obtenerUno);
router.post('/', reglasCliente, validar, ClienteController.crear);
router.put('/:id', reglasCliente, validar, ClienteController.actualizar);
router.delete('/:id', ClienteController.eliminar);

module.exports = router;