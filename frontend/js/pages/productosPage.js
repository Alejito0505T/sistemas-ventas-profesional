let listaProductos = [];

async function cargarProductos() {
    try {
        listaProductos = await ProductoService.listar();
        renderizarProductos(listaProductos);
        verificarStockBajo();
    } catch (error) {
        Toast.error('No se pudo conectar con el servidor.');
    }
}

function renderizarProductos(productos) {
    const grid = document.getElementById('gridProductos');

    if (productos.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#9CA3AF;">No hay productos registrados.</div>';
        return;
    }

    grid.innerHTML = productos.map(p => {
        const stockBadge = p.stock === 0 ? 'badge-rojo' : p.stock <= p.stock_minimo ? 'badge-amarillo' : 'badge-verde';
        const stockTexto = p.stock === 0 ? 'Agotado' : `${p.stock} uds`;

        return `
            <div class="product-card">
                <div class="prod-icon">📦</div>
                <div class="prod-code">${p.codigo} · ${p.categoria_nombre}</div>
                <div class="prod-name">${p.nombre}</div>
                <div class="prod-price">$${Number(p.precio_venta).toLocaleString('es-CO')}</div>
                <div class="prod-stock">
                    <span class="badge ${stockBadge}">${stockTexto}</span>
                    <span style="color:#9CA3AF;">Mín: ${p.stock_minimo}</span>
                </div>
                <div class="prod-actions">
                    <button class="btn btn-secondary btn-sm" onclick="editarProducto(${p.producto_id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${p.producto_id})">Eliminar</button>
                </div>
            </div>
        `;
    }).join('');
}

async function verificarStockBajo() {
    try {
        const productosStockBajo = await ProductoService.obtenerStockBajo();
        const contenedor = document.getElementById('alertaStockBajo');

        if (productosStockBajo.length > 0) {
            contenedor.innerHTML = `
                <div style="background:#FEF3C7;color:#92400E;padding:12px 18px;border-radius:8px;margin-bottom:18px;font-size:13px;">
                    ⚠ ${productosStockBajo.length} producto(s) con stock bajo o agotado.
                </div>
            `;
        } else {
            contenedor.innerHTML = '';
        }
    } catch (error) {
        console.error('Error al verificar stock bajo:', error.message);
    }
}

function abrirFormularioNuevo() {
    document.getElementById('tituloModal').textContent = 'Nuevo Producto';
    document.getElementById('formProducto').reset();
    document.getElementById('productoId').value = '';
    document.getElementById('stockMinimo').value = '5';
    Modal.abrir('modalProducto');
}

async function editarProducto(id) {
    const producto = await ProductoService.obtenerPorId(id);
    document.getElementById('tituloModal').textContent = 'Editar Producto';
    document.getElementById('productoId').value = producto.producto_id;
    document.getElementById('codigo').value = producto.codigo;
    document.getElementById('categoriaId').value = producto.categoria_id;
    document.getElementById('nombre').value = producto.nombre;
    document.getElementById('precioVenta').value = producto.precio_venta;
    document.getElementById('stock').value = producto.stock;
    document.getElementById('stockMinimo').value = producto.stock_minimo;
    Modal.abrir('modalProducto');
}

async function eliminarProducto(id) {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
        await ProductoService.eliminar(id);
        Toast.exito('Producto eliminado.');
        cargarProductos();
    } catch (error) {
        Toast.error(error.message);
    }
}

document.getElementById('formProducto').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const id = document.getElementById('productoId').value;
    const datos = {
        categoria_id: Number(document.getElementById('categoriaId').value),
        codigo: document.getElementById('codigo').value,
        nombre: document.getElementById('nombre').value,
        precio_venta: Number(document.getElementById('precioVenta').value),
        stock: Number(document.getElementById('stock').value),
        stock_minimo: Number(document.getElementById('stockMinimo').value)
    };

    try {
        if (id) {
            await ProductoService.actualizar(id, datos);
            Toast.exito('Producto actualizado.');
        } else {
            await ProductoService.crear(datos);
            Toast.exito('Producto registrado.');
        }
        Modal.cerrar('modalProducto');
        cargarProductos();
    } catch (error) {
        Toast.error(error.message);
    }
});

document.getElementById('buscador').addEventListener('input', (evento) => {
    const filtro = evento.target.value.toLowerCase();
    const filtrados = listaProductos.filter(p =>
        p.nombre.toLowerCase().includes(filtro) || p.codigo.toLowerCase().includes(filtro)
    );
    renderizarProductos(filtrados);
});

Modal.inicializarCierreAlClickFuera();
cargarProductos();