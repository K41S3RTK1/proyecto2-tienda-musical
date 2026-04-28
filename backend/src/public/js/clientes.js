let clienteEnEdicion = null;

async function cargarClientes() {
  try {
    const respuesta = await fetch('/clientes');
    const data = await respuesta.json();

    const tbody = document.querySelector('#tabla-clientes tbody');
    tbody.innerHTML = '';

    if (data.ok) {
      data.clientes.forEach((cliente) => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
          <td>${cliente.id_cliente}</td>
          <td>${cliente.nombre}</td>
          <td>${cliente.apellido}</td>
          <td>${cliente.telefono}</td>
          <td>${cliente.correo}</td>
          <td>
            <button onclick='editarCliente(${JSON.stringify(cliente)})'>Editar</button>
            <button onclick="eliminarCliente(${cliente.id_cliente})">Eliminar</button>
          </td>
        `;

        tbody.appendChild(fila);
      });
    } else {
      tbody.innerHTML = `
        <tr>
          <td colspan="6">No se pudieron cargar los clientes.</td>
        </tr>
      `;
    }
  } catch (error) {
    console.error('Error al cargar clientes:', error);

    const tbody = document.querySelector('#tabla-clientes tbody');
    tbody.innerHTML = `
      <tr>
        <td colspan="6">Ocurrió un error al cargar los clientes.</td>
      </tr>
    `;
  }
}

function editarCliente(cliente) {
  clienteEnEdicion = cliente.id_cliente;

  document.getElementById('id_cliente').value = cliente.id_cliente;
  document.getElementById('nombre').value = cliente.nombre;
  document.getElementById('apellido').value = cliente.apellido;
  document.getElementById('telefono').value = cliente.telefono;
  document.getElementById('correo').value = cliente.correo;

  document.getElementById('titulo-formulario').textContent = 'Editar cliente';
  document.getElementById('btn-guardar').textContent = 'Actualizar cliente';
  document.getElementById('btn-cancelar').style.display = 'inline-block';
}

function cancelarEdicion() {
  clienteEnEdicion = null;
  document.getElementById('form-cliente').reset();
  document.getElementById('id_cliente').value = '';
  document.getElementById('titulo-formulario').textContent = 'Agregar cliente';
  document.getElementById('btn-guardar').textContent = 'Guardar cliente';
  document.getElementById('btn-cancelar').style.display = 'none';
}

async function guardarCliente(event) {
  event.preventDefault();

  const mensaje = document.getElementById('mensaje');

  const cliente = {
    nombre: document.getElementById('nombre').value,
    apellido: document.getElementById('apellido').value,
    telefono: document.getElementById('telefono').value,
    correo: document.getElementById('correo').value
  };

  try {
    let url = '/clientes';
    let method = 'POST';

    if (clienteEnEdicion) {
      url = `/clientes/${clienteEnEdicion}`;
      method = 'PUT';
    }

    const respuesta = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cliente)
    });

    const data = await respuesta.json();

    if (data.ok) {
      mensaje.textContent = data.mensaje;
      mensaje.style.color = 'green';
      cancelarEdicion();
      cargarClientes();
    } else {
      mensaje.textContent = data.mensaje || 'No se pudo guardar el cliente.';
      mensaje.style.color = 'red';
    }
  } catch (error) {
    console.error('Error al guardar cliente:', error);
    mensaje.textContent = 'Ocurrió un error al guardar el cliente.';
    mensaje.style.color = 'red';
  }
}

async function eliminarCliente(id) {
  const confirmar = confirm('¿Deseas eliminar este cliente?');

  if (!confirmar) {
    return;
  }

  const mensaje = document.getElementById('mensaje');

  try {
    const respuesta = await fetch(`/clientes/${id}`, {
      method: 'DELETE'
    });

    const data = await respuesta.json();

    if (data.ok) {
      mensaje.textContent = data.mensaje;
      mensaje.style.color = 'green';
      cargarClientes();
    } else {
      mensaje.textContent = data.mensaje || 'No se pudo eliminar el cliente.';
      mensaje.style.color = 'red';
    }
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    mensaje.textContent = 'Ocurrió un error al eliminar el cliente.';
    mensaje.style.color = 'red';
  }
}

document.getElementById('form-cliente').addEventListener('submit', guardarCliente);
document.getElementById('btn-cancelar').addEventListener('click', cancelarEdicion);

cargarClientes();