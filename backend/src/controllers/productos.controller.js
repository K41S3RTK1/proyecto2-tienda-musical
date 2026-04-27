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

const crearProducto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      marca,
      precio_venta,
      stock_actual,
      stock_minimo,
      id_categoria,
      id_proveedor
    } = req.body;

    if (
      !nombre ||
      !marca ||
      !precio_venta ||
      stock_actual === undefined ||
      stock_minimo === undefined ||
      !id_categoria ||
      !id_proveedor
    ) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Todos los campos obligatorios deben completarse.'
      });
    }

    if (
      Number(precio_venta) <= 0 ||
      Number(stock_actual) < 0 ||
      Number(stock_minimo) < 0
    ) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Verifica precio y stock. No pueden llevar valores inválidos.'
      });
    }

    const query = `
      INSERT INTO producto
      (nombre, descripcion, marca, precio_venta, stock_actual, stock_minimo, id_categoria, id_proveedor)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      nombre,
      descripcion || null,
      marca,
      precio_venta,
      stock_actual,
      stock_minimo,
      id_categoria,
      id_proveedor
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      ok: true,
      mensaje: 'Producto creado correctamente.',
      producto: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al crear producto',
      error: error.message
    });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const verificarQuery = `
      SELECT * FROM producto
      WHERE id_producto = $1;
    `;
    const verificarResult = await pool.query(verificarQuery, [id]);

    if (verificarResult.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'El producto no existe.'
      });
    }

    const deleteQuery = `
      DELETE FROM producto
      WHERE id_producto = $1
      RETURNING *;
    `;
    const deleteResult = await pool.query(deleteQuery, [id]);

    res.json({
      ok: true,
      mensaje: 'Producto eliminado correctamente.',
      producto: deleteResult.rows[0]
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al eliminar producto',
      error: error.message
    });
  }
};

module.exports = {
  obtenerProductos,
  crearProducto,
  eliminarProducto
};