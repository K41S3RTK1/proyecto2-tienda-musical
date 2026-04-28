const pool = require('../config/db');

const registrarVenta = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      id_cliente,
      id_empleado,
      id_producto,
      cantidad,
      metodo_pago
    } = req.body;

    if (!id_cliente || !id_empleado || !id_producto || !cantidad || !metodo_pago) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Todos los campos son obligatorios.'
      });
    }

    if (Number(cantidad) <= 0) {
      return res.status(400).json({
        ok: false,
        mensaje: 'La cantidad debe ser mayor que 0.'
      });
    }

    await client.query('BEGIN');

    const productoQuery = `
      SELECT id_producto, nombre, precio_venta, stock_actual
      FROM producto
      WHERE id_producto = $1;
    `;
    const productoResult = await client.query(productoQuery, [id_producto]);

    if (productoResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        ok: false,
        mensaje: 'El producto no existe.'
      });
    }

    const producto = productoResult.rows[0];

    if (Number(producto.stock_actual) < Number(cantidad)) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        ok: false,
        mensaje: 'No hay suficiente stock para realizar la venta.'
      });
    }

    const clienteQuery = `
      SELECT id_cliente
      FROM cliente
      WHERE id_cliente = $1;
    `;
    const clienteResult = await client.query(clienteQuery, [id_cliente]);

    if (clienteResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        ok: false,
        mensaje: 'El cliente no existe.'
      });
    }

    const empleadoQuery = `
      SELECT id_empleado
      FROM empleado
      WHERE id_empleado = $1;
    `;
    const empleadoResult = await client.query(empleadoQuery, [id_empleado]);

    if (empleadoResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        ok: false,
        mensaje: 'El empleado no existe.'
      });
    }

    const precio_unitario = Number(producto.precio_venta);
    const subtotal = precio_unitario * Number(cantidad);
    const total = subtotal;

    const insertVentaQuery = `
      INSERT INTO venta (fecha, metodo_pago, estado, total, id_cliente, id_empleado)
      VALUES (CURRENT_TIMESTAMP, $1, 'Completada', $2, $3, $4)
      RETURNING *;
    `;
    const ventaResult = await client.query(insertVentaQuery, [
      metodo_pago,
      total,
      id_cliente,
      id_empleado
    ]);

    const venta = ventaResult.rows[0];

    const insertDetalleQuery = `
      INSERT INTO detalle_venta (cantidad, precio_unitario, subtotal, id_venta, id_producto)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const detalleResult = await client.query(insertDetalleQuery, [
      cantidad,
      precio_unitario,
      subtotal,
      venta.id_venta,
      id_producto
    ]);

    const updateStockQuery = `
      UPDATE producto
      SET stock_actual = stock_actual - $1
      WHERE id_producto = $2
      RETURNING *;
    `;
    const stockResult = await client.query(updateStockQuery, [cantidad, id_producto]);

    await client.query('COMMIT');

    res.status(201).json({
      ok: true,
      mensaje: 'Venta registrada correctamente.',
      venta: venta,
      detalle_venta: detalleResult.rows[0],
      producto_actualizado: stockResult.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al registrar venta:', error);

    res.status(500).json({
      ok: false,
      mensaje: 'Error al registrar la venta',
      error: error.message
    });
  } finally {
    client.release();
  }
};

module.exports = {
  registrarVenta
};