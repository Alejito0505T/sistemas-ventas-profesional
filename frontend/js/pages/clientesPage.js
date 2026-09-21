let listaClientes = [];

async function cargarClientes() {
    try {
        listaClientes = await ClienteService.listar();
        renderizarTabla(listaClientes);
    } catch (error) {
        Toast.error('No se pudo conectar con el servidor.');
    }
}

function renderizarTabla(clientes) {
    const tbody = document.getElementById('tablaClientes');

    if (clientes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:30px;color:#9CA3AF;">No hay clientes registrados.</td></tr>';
        return;
    }

    tbody.innerHTML = clientes.map(c => `
        <tr>
            <td>${c.cliente_id}</td>
            <td><strong>${c.nombres} ${c.apellidos}</strong></td>
            <td>${c.tipo_doc} ${c.num_doc}</td>
            <td>${c.telefono || '—'}</td>
            <td><span class="badge ${c.activo ? 'badge-verde' : 'badge-rojo'}">${c.activo ? 'Activo' : 'Inactivo'}</span></td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="editarCliente(${c.cliente_id})">Editar</button>
                ${c.activo
                    ? `<button class="btn btn-danger btn-sm" onclick="eliminarCliente(${c.cliente_id})">Eliminar</button>`
                    : `<button class="btn btn-primary btn-sm" onclick="reactivarCliente(${c.cliente_id})">Reactivar</button>`
                }
           </td>
        </tr>
    `).join('');
}

function abrirFormularioNuevo() {
    document.getElementById('tituloModal').textContent = 'Nuevo Cliente';
    document.getElementById('formCliente').reset();
    document.getElementById('clienteId').value = '';
    Modal.abrir('modalCliente');
}

async function editarCliente(id) {
    const cliente = await ClienteService.obtenerPorId(id);
    document.getElementById('tituloModal').textContent = 'Editar Cliente';
    document.getElementById('clienteId').value = cliente.cliente_id;
    document.getElementById('nombres').value = cliente.nombres;
    document.getElementById('apellidos').value = cliente.apellidos;
    document.getElementById('tipoDoc').value = cliente.tipo_doc;
    document.getElementById('numDoc').value = cliente.num_doc;
    document.getElementById('telefono').value = cliente.telefono || '';
    Modal.abrir('modalCliente');
}

async function eliminarCliente(id) {
    if (!confirm('¿Eliminar este cliente?')) return;
    try {
        await ClienteService.eliminar(id);
        Toast.exito('Cliente eliminado.');
        cargarClientes();
    } catch (error) {
        Toast.error(error.message);
    }
}

async function reactivarCliente(id) {
    if (!confirm('¿Reactivar este cliente?')) return;
    try {
        await ClienteService.reactivar(id);
        Toast.exito('Cliente reactivado.');
        cargarClientes();
    } catch (error) {
        Toast.error(error.message);
    }
}

document.getElementById('formCliente').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const id = document.getElementById('clienteId').value;
    const datos = {
        nombres: document.getElementById('nombres').value,
        apellidos: document.getElementById('apellidos').value,
        tipo_doc: document.getElementById('tipoDoc').value,
        num_doc: document.getElementById('numDoc').value,
        telefono: document.getElementById('telefono').value
    };

    try {
        if (id) {
            await ClienteService.actualizar(id, datos);
            Toast.exito('Cliente actualizado.');
        } else {
            await ClienteService.crear(datos);
            Toast.exito('Cliente registrado.');
        }
        Modal.cerrar('modalCliente');
        cargarClientes();
    } catch (error) {
        Toast.error(error.message);
    }
});

document.getElementById('buscador').addEventListener('input', (evento) => {
    const filtro = evento.target.value.toLowerCase();
    const filtrados = listaClientes.filter(c =>
        `${c.nombres} ${c.apellidos}`.toLowerCase().includes(filtro)
    );
    renderizarTabla(filtrados);
});

Modal.inicializarCierreAlClickFuera();
cargarClientes();