const express = require('express');
const router = express.Router();
const { registrarVenta } = require('../controllers/ventas.controller');

router.post('/', registrarVenta);

module.exports = router;