const pool = require('../config/db');

const obtenerClientes = async (req, res) => {
  try {
    const query = `
      SELECT
        id_cliente,
        nombre,
        apellido,
        telefono,
        correo
      FROM cliente
      ORDER BY id_cliente;
    `;

    const result = await pool.query(query);

    res.json({
      ok: true,
      clientes: result.rows
    });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener clientes',
      error: error.message
    });
  }
};

const crearCliente = async (req, res) => {
  try {
    const { nombre, apellido, telefono, correo } = req.body;

    if (!nombre || !apellido || !telefono || !correo) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Todos los campos son obligatorios.'
      });
    }

    const query = `
      INSERT INTO cliente (nombre, apellido, telefono, correo)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [nombre, apellido, telefono, correo];
    const result = await pool.query(query, values);

    res.status(201).json({
      ok: true,
      mensaje: 'Cliente creado correctamente.',
      cliente: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear cliente:', error);

    if (error.code === '23505') {
      return res.status(400).json({
        ok: false,
        mensaje: 'Ya existe un cliente con ese correo.'
      });
    }

    res.status(500).json({
      ok: false,
      mensaje: 'Error al crear cliente',
      error: error.message
    });
  }
};

module.exports = {
  obtenerClientes,
  crearCliente
};