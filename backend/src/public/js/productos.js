let productoEnEdicion = null;

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
            <button onclick='editarProducto(${JSON.stringify(producto)})'>Editar</button>
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

function editarProducto(producto) {
  productoEnEdicion = producto.id_producto;

  document.getElementById('id_producto').value = producto.id_producto;
  document.getElementById('nombre').value = producto.producto;
  document.getElementById('descripcion').value = producto.descripcion || '';
  document.getElementById('marca').value = producto.marca;
  document.getElementById('precio_venta').value = producto.precio_venta;
  document.getElementById('stock_actual').value = producto.stock_actual;
  document.getElementById('stock_minimo').value = producto.stock_minimo;
  document.getElementById('id_categoria').value = producto.id_categoria;
  document.getElementById('id_proveedor').value = producto.id_proveedor;

  document.getElementById('titulo-formulario').textContent = 'Editar producto';
  document.getElementById('btn-guardar').textContent = 'Actualizar producto';
  document.getElementById('btn-cancelar').style.display = 'inline-block';
}

function cancelarEdicion() {
  productoEnEdicion = null;
  document.getElementById('form-producto').reset();
  document.getElementById('id_producto').value = '';
  document.getElementById('titulo-formulario').textContent = 'Agregar producto';
  document.getElementById('btn-guardar').textContent = 'Guardar producto';
  document.getElementById('btn-cancelar').style.display = 'none';
}

async function guardarProducto(event) {
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
    let url = '/productos';
    let method = 'POST';

    if (productoEnEdicion) {
      url = `/productos/${productoEnEdicion}`;
      method = 'PUT';
    }

    const respuesta = await fetch(url, {
      method,
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
      cancelarEdicion();
      cargarProductos();
    } else {
      mensaje.textContent = data.mensaje || 'No se pudo guardar el producto.';
      mensaje.style.color = 'red';
    }
  } catch (error) {
    console.error('Error al guardar producto:', error);
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

document.getElementById('form-producto').addEventListener('submit', guardarProducto);
document.getElementById('btn-cancelar').addEventListener('click', cancelarEdicion);

cargarProductos();