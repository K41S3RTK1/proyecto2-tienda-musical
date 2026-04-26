const express = require('express');
const path = require('path');
const pool = require('./config/db');
const productosRoutes = require('./routes/productos.routes');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/productos-page', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'productos.html'));
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS fecha_actual');
    res.json({
      ok: true,
      mensaje: 'Conexión a PostgreSQL exitosa',
      fecha: result.rows[0].fecha_actual,
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al conectar con PostgreSQL',
      error: error.message,
    });
  }
});

app.use('/productos', productosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});