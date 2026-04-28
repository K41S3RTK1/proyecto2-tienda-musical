const express = require('express');
const router = express.Router();
const {
  obtenerVentasPorCategoria,
  obtenerProductosMasVendidos,
  obtenerVentasAltas,
  obtenerVistaVentas
} = require('../controllers/reportes.controller');

router.get('/ventas-por-categoria', obtenerVentasPorCategoria);
router.get('/productos-mas-vendidos', obtenerProductosMasVendidos);
router.get('/ventas-altas', obtenerVentasAltas);
router.get('/vista-ventas', obtenerVistaVentas);

module.exports = router;