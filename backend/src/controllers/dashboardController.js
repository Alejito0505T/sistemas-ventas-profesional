const pool = require('../config/database');

class DashboardController {

    static async obtenerResumen(req, res, next) {
        try {
            const [totalClientes] = await pool.query(
                'SELECT COUNT(*) AS total FROM clientes WHERE activo = 1'
            );

            const [totalProductos] = await pool.query(
                'SELECT COUNT(*) AS total FROM productos WHERE activo = 1'
            );

            const [productosStockBajo] = await pool.query(
                'SELECT COUNT(*) AS total FROM productos WHERE stock <= stock_minimo AND activo = 1'
            );

            const [ventasDelMes] = await pool.query(
                `SELECT COUNT(*) AS cantidad, COALESCE(SUM(total), 0) AS suma
                 FROM ventas
                 WHERE estado = 'Activa' AND MONTH(fecha_venta) = MONTH(NOW()) AND YEAR(fecha_venta) = YEAR(NOW())`
            );

            const [ventasRecientes] = await pool.query(
                `SELECT v.venta_id, CONCAT(c.nombres, ' ', c.apellidos) AS cliente_nombre, v.total, v.estado
                 FROM ventas v
                 JOIN clientes c ON c.cliente_id = v.cliente_id
                 ORDER BY v.fecha_venta DESC
                 LIMIT 5`
            );

            const [topProductos] = await pool.query(
                `SELECT p.nombre, SUM(d.cantidad) AS unidades_vendidas
                 FROM detalle_venta d
                 JOIN productos p ON p.producto_id = d.producto_id
                 JOIN ventas v ON v.venta_id = d.venta_id
                 WHERE v.estado = 'Activa'
                 GROUP BY p.producto_id, p.nombre
                 ORDER BY unidades_vendidas DESC
                 LIMIT 5`
            );

            res.json({
                ok: true,
                mensaje: 'Resumen obtenido exitosamente.',
                datos: {
                    totalClientes: totalClientes[0].total,
                    totalProductos: totalProductos[0].total,
                    productosStockBajo: productosStockBajo[0].total,
                    ventasDelMes: {
                        cantidad: ventasDelMes[0].cantidad,
                        total: ventasDelMes[0].suma
                    },
                    ventasRecientes,
                    topProductos
                }
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = DashboardController;