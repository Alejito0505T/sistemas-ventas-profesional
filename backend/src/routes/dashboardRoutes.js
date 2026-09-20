const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');

router.get('/resumen', DashboardController.obtenerResumen);

module.exports = router;