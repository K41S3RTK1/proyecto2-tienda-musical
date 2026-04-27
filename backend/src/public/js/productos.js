async function cargarProductos() {
  try {
    const respuesta = await fetch('/productos');
    const data = await respuesta.json();

    const tbody = document.querySelector('#tabla-productos tbody');
    tbody.innerHTML = '';

    if (data.ok) {
      data.productos.forEach((producto) => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
          <td>${producto.id_producto}</td>
          <td>${producto.producto}</td>
          <td>${producto.marca}</td>
          <td>Q${producto.precio_venta}</td>
          <td>${producto.stock_actual}</td>
          <td>${producto.categoria}</td>
          <td>${producto.proveedor}</td>
          <td>
            <button onclick="eliminarProducto(${producto.id_producto})">Eliminar</button>
          </td>
        `;

        tbody.appendChild(fila);
      });
    } else {
      tbody.innerHTML = `
        <tr>
          <td colspan="8">No se pudieron cargar los productos.</td>
        </tr>
      `;
    }
  } catch (error) {
    console.error('Error al cargar productos:', error);

    const tbody = document.querySelector('#tabla-productos tbody');
    tbody.innerHTML = `
      <tr>
        <td colspan="8">Ocurrió un error al cargar los productos.</td>
      </tr>
    `;
  }
}

async function crearProducto(event) {
  event.preventDefault();

  const mensaje = document.getElementById('mensaje');

  const producto = {
    nombre: document.getElementById('nombre').value,
    descripcion: document.getElementById('descripcion').value,
    marca: document.getElementById('marca').value,
    precio_venta: document.getElementById('precio_venta').value,
    stock_actual: document.getElementById('stock_actual').value,
    stock_minimo: document.getElementById('stock_minimo').value,
    id_categoria: document.getElementById('id_categoria').value,
    id_proveedor: document.getElementById('id_proveedor').value
  };

  try {
    const respuesta = await fetch('/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(producto)
    });

    const texto = await respuesta.text();

    let data;
    try {
      data = JSON.parse(texto);
    } catch (e) {
      throw new Error(`La respuesta no vino en JSON. Respuesta: ${texto}`);
    }

    if (data.ok) {
      mensaje.textContent = data.mensaje;
      mensaje.style.color = 'green';
      document.getElementById('form-producto').reset();
      cargarProductos();
    } else {
      mensaje.textContent = data.mensaje || 'No se pudo crear el producto.';
      mensaje.style.color = 'red';
    }
  } catch (error) {
    console.error('Error al crear producto:', error);
    mensaje.textContent = error.message;
    mensaje.style.color = 'red';
  }
}

async function eliminarProducto(id) {
  const confirmar = confirm('¿Deseas eliminar este producto?');

  if (!confirmar) {
    return;
  }

  const mensaje = document.getElementById('mensaje');

  try {
    const respuesta = await fetch(`/productos/${id}`, {
      method: 'DELETE'
    });

    const data = await respuesta.json();

    if (data.ok) {
      mensaje.textContent = data.mensaje;
      mensaje.style.color = 'green';
      cargarProductos();
    } else {
      mensaje.textContent = data.mensaje || 'No se pudo eliminar el producto.';
      mensaje.style.color = 'red';
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    mensaje.textContent = 'Ocurrió un error al eliminar el producto.';
    mensaje.style.color = 'red';
  }
}

document.getElementById('form-producto').addEventListener('submit', crearProducto);

cargarProductos();