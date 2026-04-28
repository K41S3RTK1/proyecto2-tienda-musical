async function registrarVenta(event) {
  event.preventDefault();

  const mensaje = document.getElementById('mensaje');
  const resultado = document.getElementById('resultado-venta');

  const venta = {
    id_cliente: document.getElementById('id_cliente').value,
    id_empleado: document.getElementById('id_empleado').value,
    id_producto: document.getElementById('id_producto').value,
    cantidad: document.getElementById('cantidad').value,
    metodo_pago: document.getElementById('metodo_pago').value
  };

  try {
    const respuesta = await fetch('/ventas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(venta)
    });

    const data = await respuesta.json();

    if (data.ok) {
      mensaje.textContent = data.mensaje;
      mensaje.style.color = 'green';
      resultado.textContent = JSON.stringify(data, null, 2);
      document.getElementById('form-venta').reset();
    } else {
      mensaje.textContent = data.mensaje || 'No se pudo registrar la venta.';
      mensaje.style.color = 'red';
      resultado.textContent = JSON.stringify(data, null, 2);
    }
  } catch (error) {
    console.error('Error al registrar venta:', error);
    mensaje.textContent = 'Ocurrió un error al registrar la venta.';
    mensaje.style.color = 'red';
    resultado.textContent = error.message;
  }
}

document.getElementById('form-venta').addEventListener('submit', registrarVenta);