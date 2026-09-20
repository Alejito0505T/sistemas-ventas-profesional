async function cargarDashboard() {
    try {
        const resumen = await DashboardService.obtenerResumen();

        document.getElementById('kpiVentasMes').textContent =
            `$${Number(resumen.ventasDelMes.total).toLocaleString('es-CO')}`;
        document.getElementById('kpiProductos').textContent = resumen.totalProductos;
        document.getElementById('kpiClientes').textContent = resumen.totalClientes;
        document.getElementById('kpiStockBajo').textContent = resumen.productosStockBajo;

        renderizarVentasRecientes(resumen.ventasRecientes);
        renderizarTopProductos(resumen.topProductos);

    } catch (error) {
        Toast.error('No se pudo cargar el resumen del dashboard.');
    }
}

function renderizarVentasRecientes(ventas) {
    const contenedor = document.getElementById('listaVentasRecientes');

    if (ventas.length === 0) {
        contenedor.innerHTML = '<p style="text-align:center;color:#9CA3AF;padding:30px 0;">No hay ventas registradas todavía.</p>';
        return;
    }

    contenedor.innerHTML = ventas.map(v => {
        const badgeClase = v.estado === 'Activa' ? 'badge-verde' : 'badge-rojo';
        return `
            <div class="actividad-item">
                <div>
                    <strong>#${String(v.venta_id).padStart(4, '0')}</strong> — ${v.cliente_nombre}
                </div>
                <div style="display:flex;align-items:center;gap:10px;">
                    <span>$${Number(v.total).toLocaleString('es-CO')}</span>
                    <span class="badge ${badgeClase}">${v.estado}</span>
                </div>
            </div>
        `;
    }).join('');
}

function renderizarTopProductos(productos) {
    const contenedor = document.getElementById('listaTopProductos');

    if (productos.length === 0) {
        contenedor.innerHTML = '<p style="text-align:center;color:#9CA3AF;padding:30px 0;">Aún no hay ventas registradas.</p>';
        return;
    }

    contenedor.innerHTML = productos.map((p, indice) => `
        <div class="actividad-item">
            <div>
                <strong>${indice + 1}.</strong> ${p.nombre}
            </div>
            <div>
                ${p.unidades_vendidas} unidades
            </div>
        </div>
    `).join('');
}

cargarDashboard();