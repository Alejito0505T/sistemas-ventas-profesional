const pool = require('../config/database');

class VentaModel {

    static async obtenerTodas() {
        const [filas] = await pool.query(
            `SELECT v.*, CONCAT(c.nombres, ' ', c.apellidos) AS cliente_nombre
             FROM ventas v
             JOIN clientes c ON c.cliente_id = v.cliente_id
             ORDER BY v.fecha_venta DESC`
        );
        return filas;
    }

    static async obtenerPorId(id) {
        const [ventas] = await pool.query(
            `SELECT v.*, CONCAT(c.nombres, ' ', c.apellidos) AS cliente_nombre
             FROM ventas v
             JOIN clientes c ON c.cliente_id = v.cliente_id
             WHERE v.venta_id = ?`,
            [id]
        );

        if (ventas.length === 0) return null;

        const [detalles] = await pool.query(
            `SELECT d.*, p.nombre AS producto_nombre
             FROM detalle_venta d
             JOIN productos p ON p.producto_id = d.producto_id
             WHERE d.venta_id = ?`,
            [id]
        );

        return { ...ventas[0], detalles };
    }

    static async crear(datosVenta, productos) {
        const conexion = await pool.getConnection();

        try {
            await conexion.beginTransaction();

            const { cliente_id, metodo_pago } = datosVenta;

            let subtotal = 0;
            for (const item of productos) {
                subtotal += item.precio_unitario * item.cantidad;
            }
            const iva = subtotal * 0.19;
            const total = subtotal + iva;

            const [resultadoVenta] = await conexion.query(
                `INSERT INTO ventas (cliente_id, fecha_venta, subtotal, descuento, iva, total, metodo_pago, estado)
                 VALUES (?, NOW(), ?, 0, ?, ?, ?, 'Activa')`,
                [cliente_id, subtotal, iva, total, metodo_pago]
            );

            const ventaId = resultadoVenta.insertId;

            for (const item of productos) {
                const subtotalItem = item.precio_unitario * item.cantidad;

                await conexion.query(
                    `INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario, subtotal)
                     VALUES (?, ?, ?, ?, ?)`,
                    [ventaId, item.producto_id, item.cantidad, item.precio_unitario, subtotalItem]
                );

                const [productoActual] = await conexion.query(
                    'SELECT stock FROM productos WHERE producto_id = ?',
                    [item.producto_id]
                );

                if (productoActual[0].stock < item.cantidad) {
                    throw new Error(`Stock insuficiente para el producto ID ${item.producto_id}`);
                }

                await conexion.query(
                    'UPDATE productos SET stock = stock - ? WHERE producto_id = ?',
                    [item.cantidad, item.producto_id]
                );
            }

            await conexion.commit();

            return { venta_id: ventaId, subtotal, iva, total };

        } catch (error) {
            await conexion.rollback();
            throw error;
        } finally {
            conexion.release();
        }
    }

    static async anular(id) {
        const conexion = await pool.getConnection();

        try {
            await conexion.beginTransaction();

            const [venta] = await conexion.query(
                'SELECT estado FROM ventas WHERE venta_id = ?',
                [id]
            );

            if (venta.length === 0) {
                await conexion.rollback();
                return { encontrada: false };
            }

            if (venta[0].estado === 'Anulada') {
                await conexion.rollback();
                return { encontrada: true, yaAnulada: true };
            }

            const [detalles] = await conexion.query(
                'SELECT producto_id, cantidad FROM detalle_venta WHERE venta_id = ?',
                [id]
            );

            for (const item of detalles) {
                await conexion.query(
                    'UPDATE productos SET stock = stock + ? WHERE producto_id = ?',
                    [item.cantidad, item.producto_id]
                );
            }

            await conexion.query(
                'UPDATE ventas SET estado = "Anulada" WHERE venta_id = ?',
                [id]
            );

            await conexion.commit();
            return { encontrada: true, yaAnulada: false };

        } catch (error) {
            await conexion.rollback();
            throw error;
        } finally {
            conexion.release();
        }
    }
}

module.exports = VentaModel;