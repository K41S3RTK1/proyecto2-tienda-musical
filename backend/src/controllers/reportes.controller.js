const pool = require('../config/db');

const obtenerVentasPorCategoria = async (req, res) => {
  try {
    const query = `
      SELECT
        c.nombre AS categoria,
        SUM(dv.subtotal) AS total_vendido,
        COUNT(dv.id_detalle_venta) AS cantidad_detalles
      FROM detalle_venta dv
      INNER JOIN producto p ON dv.id_producto = p.id_producto
      INNER JOIN categoria c ON p.id_categoria = c.id_categoria
      GROUP BY c.nombre
      ORDER BY total_vendido DESC;
    `;

    const result = await pool.query(query);

    res.json({
      ok: true,
      reporte: result.rows
    });
  } catch (error) {
    console.error('Error al obtener ventas por categoría:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener ventas por categoría',
      error: error.message
    });
  }
};

const obtenerProductosMasVendidos = async (req, res) => {
  try {
    const query = `
      WITH resumen_productos AS (
        SELECT
          p.id_producto,
          p.nombre AS producto,
          SUM(dv.cantidad) AS unidades_vendidas,
          SUM(dv.subtotal) AS ingreso_total
        FROM detalle_venta dv
        INNER JOIN producto p ON dv.id_producto = p.id_producto
        GROUP BY p.id_producto, p.nombre
      )
      SELECT
        id_producto,
        producto,
        unidades_vendidas,
        ingreso_total
      FROM resumen_productos
      ORDER BY unidades_vendidas DESC, ingreso_total DESC;
    `;

    const result = await pool.query(query);

    res.json({
      ok: true,
      reporte: result.rows
    });
  } catch (error) {
    console.error('Error al obtener productos más vendidos:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener productos más vendidos',
      error: error.message
    });
  }
};

const obtenerVentasAltas = async (req, res) => {
  try {
    const query = `
      SELECT
        v.id_venta,
        CONCAT(c.nombre, ' ', c.apellido) AS cliente,
        v.total,
        v.fecha
      FROM venta v
      INNER JOIN cliente c ON v.id_cliente = c.id_cliente
      WHERE v.total > (
        SELECT AVG(total)
        FROM venta
      )
      ORDER BY v.total DESC;
    `;

    const result = await pool.query(query);

    res.json({
      ok: true,
      reporte: result.rows
    });
  } catch (error) {
    console.error('Error al obtener ventas altas:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener ventas altas',
      error: error.message
    });
  }
};

const obtenerVistaVentas = async (req, res) => {
  try {
    const query = `
      SELECT *
      FROM vista_reporte_ventas
      ORDER BY fecha;
    `;

    const result = await pool.query(query);

    res.json({
      ok: true,
      reporte: result.rows
    });
  } catch (error) {
    console.error('Error al obtener reporte desde la vista:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener reporte desde la vista',
      error: error.message
    });
  }
};

module.exports = {
  obtenerVentasPorCategoria,
  obtenerProductosMasVendidos,
  obtenerVentasAltas,
  obtenerVistaVentas
};