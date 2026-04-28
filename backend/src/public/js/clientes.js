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
        `;

        tbody.appendChild(fila);
      });
    } else {
      tbody.innerHTML = `
        <tr>
          <td colspan="5">No se pudieron cargar los clientes.</td>
        </tr>
      `;
    }
  } catch (error) {
    console.error('Error al cargar clientes:', error);

    const tbody = document.querySelector('#tabla-clientes tbody');
    tbody.innerHTML = `
      <tr>
        <td colspan="5">Ocurrió un error al cargar los clientes.</td>
      </tr>
    `;
  }
}

async function crearCliente(event) {
  event.preventDefault();

  const mensaje = document.getElementById('mensaje');

  const cliente = {
    nombre: document.getElementById('nombre').value,
    apellido: document.getElementById('apellido').value,
    telefono: document.getElementById('telefono').value,
    correo: document.getElementById('correo').value
  };

  try {
    const respuesta = await fetch('/clientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cliente)
    });

    const data = await respuesta.json();

    if (data.ok) {
      mensaje.textContent = data.mensaje;
      mensaje.style.color = 'green';
      document.getElementById('form-cliente').reset();
      cargarClientes();
    } else {
      mensaje.textContent = data.mensaje || 'No se pudo crear el cliente.';
      mensaje.style.color = 'red';
    }
  } catch (error) {
    console.error('Error al crear cliente:', error);
    mensaje.textContent = 'Ocurrió un error al crear el cliente.';
    mensaje.style.color = 'red';
  }
}

document.getElementById('form-cliente').addEventListener('submit', crearCliente);

cargarClientes();