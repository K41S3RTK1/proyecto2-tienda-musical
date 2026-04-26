const pool = require('../config/db');

const obtenerProductos = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id_producto,
        p.nombre AS producto,
        p.marca,
        p.precio_venta,
        p.stock_actual,
        c.nombre AS categoria,
        pr.nombre AS proveedor
      FROM producto p
      INNER JOIN categoria c ON p.id_categoria = c.id_categoria
      INNER JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor
      ORDER BY p.id_producto;
    `;

    const result = await pool.query(query);

    res.json({
      ok: true,
      productos: result.rows
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener productos',
      error: error.message
    });
  }
};

module.exports = {
  obtenerProductos
};