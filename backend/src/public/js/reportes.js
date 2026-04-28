async function cargarVentasPorCategoria() {
  try {
    const respuesta = await fetch('/reportes/ventas-por-categoria');
    const data = await respuesta.json();
    const tbody = document.querySelector('#tabla-categorias tbody');
    tbody.innerHTML = '';

    if (data.ok) {
      data.reporte.forEach((fila) => {
        tbody.innerHTML += `
          <tr>
            <td>${fila.categoria}</td>
            <td>Q${fila.total_vendido}</td>
            <td>${fila.cantidad_detalles}</td>
          </tr>
        `;
      });
    }
  } catch (error) {
    console.error('Error al cargar ventas por categoría:', error);
  }
}

async function cargarProductosMasVendidos() {
  try {
    const respuesta = await fetch('/reportes/productos-mas-vendidos');
    const data = await respuesta.json();
    const tbody = document.querySelector('#tabla-productos-vendidos tbody');
    tbody.innerHTML = '';

    if (data.ok) {
      data.reporte.forEach((fila) => {
        tbody.innerHTML += `
          <tr>
            <td>${fila.id_producto}</td>
            <td>${fila.producto}</td>
            <td>${fila.unidades_vendidas}</td>
            <td>Q${fila.ingreso_total}</td>
          </tr>
        `;
      });
    }
  } catch (error) {
    console.error('Error al cargar productos más vendidos:', error);
  }
}

async function cargarVentasAltas() {
  try {
    const respuesta = await fetch('/reportes/ventas-altas');
    const data = await respuesta.json();
    const tbody = document.querySelector('#tabla-ventas-altas tbody');
    tbody.innerHTML = '';

    if (data.ok) {
      data.reporte.forEach((fila) => {
        tbody.innerHTML += `
          <tr>
            <td>${fila.id_venta}</td>
            <td>${fila.cliente}</td>
            <td>Q${fila.total}</td>
            <td>${new Date(fila.fecha).toLocaleString()}</td>
          </tr>
        `;
      });
    }
  } catch (error) {
    console.error('Error al cargar ventas altas:', error);
  }
}

async function cargarVistaVentas() {
  try {
    const respuesta = await fetch('/reportes/vista-ventas');
    const data = await respuesta.json();
    const tbody = document.querySelector('#tabla-vista-ventas tbody');
    tbody.innerHTML = '';

    if (data.ok) {
      data.reporte.forEach((fila) => {
        tbody.innerHTML += `
          <tr>
            <td>${fila.id_venta}</td>
            <td>${new Date(fila.fecha).toLocaleString()}</td>
            <td>${fila.cliente}</td>
            <td>${fila.empleado}</td>
            <td>${fila.metodo_pago}</td>
            <td>${fila.estado}</td>
            <td>Q${fila.total}</td>
          </tr>
        `;
      });
    }
  } catch (error) {
    console.error('Error al cargar vista de ventas:', error);
  }
}

cargarVentasPorCategoria();
cargarProductosMasVendidos();
cargarVentasAltas();
cargarVistaVentas();