let carrito = [];
let metodoPagoSeleccionado = 'Efectivo';
let listaClientesCache = [];
let listaProductosCache = [];

async function cargarVentas() {
    try {
        const ventas = await VentaService.listar();
        renderizarTablaVentas(ventas);
    } catch (error) {
        Toast.error('No se pudo conectar con el servidor.');
    }
}

function renderizarTablaVentas(ventas) {
    const tbody = document.getElementById('tablaVentas');

    if (ventas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:30px;color:#9CA3AF;">No hay ventas registradas.</td></tr>';
        return;
    }

    tbody.innerHTML = ventas.map(v => {
        const fecha = new Date(v.fecha_venta).toLocaleDateString('es-CO');
        const badgeClase = v.estado === 'Activa' ? 'badge-verde' : 'badge-rojo';
        const botonAnular = v.estado === 'Activa'
            ? `<button class="btn btn-danger btn-sm" onclick="anularVenta(${v.venta_id})">Anular</button>`
            : '<span style="color:#9CA3AF;font-size:12px;">—</span>';

        return `
            <tr>
                <td><strong>#${String(v.venta_id).padStart(4, '0')}</strong></td>
                <td>${v.cliente_nombre}</td>
                <td>${fecha}</td>
                <td>$${Number(v.total).toLocaleString('es-CO')}</td>
                <td>${v.metodo_pago}</td>
                <td><span class="badge ${badgeClase}">${v.estado}</span></td>
                <td>${botonAnular}</td>
            </tr>
        `;
    }).join('');
}

async function cargarDatosFormulario() {
    try {
        listaClientesCache = await ClienteService.listar();
        listaProductosCache = await ProductoService.listar();

        const selectCliente = document.getElementById('selectCliente');
        selectCliente.innerHTML = listaClientesCache
            .filter(c => c.activo)
            .map(c => `<option value="${c.cliente_id}">${c.nombres} ${c.apellidos}</option>`)
            .join('');

        const selectProducto = document.getElementById('selectProducto');
        selectProducto.innerHTML = listaProductosCache
            .filter(p => p.activo && p.stock > 0)
            .map(p => `<option value="${p.producto_id}" data-precio="${p.precio_venta}">${p.nombre} — $${Number(p.precio_venta).toLocaleString('es-CO')}</option>`)
            .join('');

    } catch (error) {
        Toast.error('No se pudieron cargar los datos del formulario.');
    }
}

function agregarAlCarrito() {
    const selectProducto = document.getElementById('selectProducto');
    const cantidadInput = document.getElementById('cantidadProducto');

    const productoId = Number(selectProducto.value);
    const cantidad = Number(cantidadInput.value);

    if (!productoId || cantidad < 1) {
        Toast.error('Selecciona un producto y una cantidad válida.');
        return;
    }

    const producto = listaProductosCache.find(p => p.producto_id === productoId);

    if (cantidad > producto.stock) {
        Toast.error(`Solo hay ${producto.stock} unidades disponibles de ${producto.nombre}.`);
        return;
    }

    const itemExistente = carrito.find(item => item.producto_id === productoId);

    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({
            producto_id: productoId,
            nombre: producto.nombre,
            precio_unitario: producto.precio_venta,
            cantidad: cantidad
        });
    }

    cantidadInput.value = 1;
    renderizarCarrito();
}

function quitarDelCarrito(productoId) {
    carrito = carrito.filter(item => item.producto_id !== productoId);
    renderizarCarrito();
}

function cambiarCantidadCarrito(productoId, delta) {
    const item = carrito.find(i => i.producto_id === productoId);
    if (!item) return;

    item.cantidad += delta;

    if (item.cantidad <= 0) {
        quitarDelCarrito(productoId);
        return;
    }

    renderizarCarrito();
}

function renderizarCarrito() {
    const contenedor = document.getElementById('carritoItems');

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p style="text-align:center;color:#9CA3AF;padding:30px;">Agrega productos al carrito</p>';
        actualizarResumen();
        return;
    }

    contenedor.innerHTML = carrito.map(item => `
        <div class="carrito-item">
            <div class="item-info">
                <div class="item-name">${item.nombre}</div>
                <div class="item-price">$${Number(item.precio_unitario).toLocaleString('es-CO')} c/u</div>
            </div>
            <div class="item-qty">
                <button onclick="cambiarCantidadCarrito(${item.producto_id}, -1)">−</button>
                <span>${item.cantidad}</span>
                <button onclick="cambiarCantidadCarrito(${item.producto_id}, 1)">+</button>
            </div>
        </div>
    `).join('');

    actualizarResumen();
}

function actualizarResumen() {
    const subtotal = carrito.reduce((suma, item) => suma + (item.precio_unitario * item.cantidad), 0);
    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    document.getElementById('resumenSubtotal').textContent = `$${subtotal.toLocaleString('es-CO')}`;
    document.getElementById('resumenIva').textContent = `$${iva.toLocaleString('es-CO')}`;
    document.getElementById('resumenTotal').textContent = `$${total.toLocaleString('es-CO')}`;
}

document.getElementById('metodosPago').addEventListener('click', (evento) => {
    const metodoDiv = evento.target.closest('.metodo-item');
    if (!metodoDiv) return;

    document.querySelectorAll('.metodo-item').forEach(el => el.classList.remove('seleccionado'));
    metodoDiv.classList.add('seleccionado');
    metodoPagoSeleccionado = metodoDiv.dataset.metodo;
});

async function registrarVenta() {
    const clienteId = Number(document.getElementById('selectCliente').value);

    if (!clienteId) {
        Toast.error('Selecciona un cliente.');
        return;
    }

    if (carrito.length === 0) {
        Toast.error('Agrega al menos un producto al carrito.');
        return;
    }

    const datosVenta = {
        cliente_id: clienteId,
        metodo_pago: metodoPagoSeleccionado,
        productos: carrito.map(item => ({
            producto_id: item.producto_id,
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario
        }))
    };

    try {
        await VentaService.crear(datosVenta);
        Toast.exito('Venta registrada exitosamente.');
        cerrarModalVenta();
        cargarVentas();
    } catch (error) {
        Toast.error(error.message);
    }
}

function cerrarModalVenta() {
    Modal.cerrar('modalNuevaVenta');
    carrito = [];
    renderizarCarrito();
}

async function anularVenta(id) {
    if (!confirm('¿Anular esta venta? El stock de los productos será restaurado.')) return;

    try {
        await VentaService.anular(id);
        Toast.exito('Venta anulada. Stock restaurado.');
        cargarVentas();
    } catch (error) {
        Toast.error(error.message);
    }
}

Modal.inicializarCierreAlClickFuera();
cargarVentas();
cargarDatosFormulario();