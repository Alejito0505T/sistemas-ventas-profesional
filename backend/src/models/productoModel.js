const pool = require('../config/database');

class ProductoModel {

    static async obtenerTodos() {
        const [filas] = await pool.query(
            `SELECT p.*, c.nombre AS categoria_nombre
             FROM productos p
             JOIN categorias c ON c.categoria_id = p.categoria_id
             ORDER BY p.nombre`
        );
        return filas;
    }

    static async obtenerPorId(id) {
        const [filas] = await pool.query(
            `SELECT p.*, c.nombre AS categoria_nombre
             FROM productos p
             JOIN categorias c ON c.categoria_id = p.categoria_id
             WHERE p.producto_id = ?`,
            [id]
        );
        return filas[0];
    }

    static async obtenerStockBajo() {
        const [filas] = await pool.query(
            `SELECT p.*, c.nombre AS categoria_nombre
             FROM productos p
             JOIN categorias c ON c.categoria_id = p.categoria_id
             WHERE p.stock <= p.stock_minimo AND p.activo = 1`
        );
        return filas;
    }

    static async crear(datos) {
        const { categoria_id, codigo, nombre, descripcion, precio_venta, stock, stock_minimo } = datos;
        const [resultado] = await pool.query(
            `INSERT INTO productos (categoria_id, codigo, nombre, descripcion, precio_venta, stock, stock_minimo, activo)
             VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
            [categoria_id, codigo, nombre, descripcion, precio_venta, stock || 0, stock_minimo || 5]
        );
        return { producto_id: resultado.insertId, ...datos };
    }

    static async actualizar(id, datos) {
        const { categoria_id, codigo, nombre, descripcion, precio_venta, stock, stock_minimo } = datos;
        const [resultado] = await pool.query(
            `UPDATE productos
             SET categoria_id = ?, codigo = ?, nombre = ?, descripcion = ?, precio_venta = ?, stock = ?, stock_minimo = ?
             WHERE producto_id = ?`,
            [categoria_id, codigo, nombre, descripcion, precio_venta, stock, stock_minimo, id]
        );
        return resultado.affectedRows > 0;
    }

    static async eliminar(id) {
        const [resultado] = await pool.query(
            'UPDATE productos SET activo = 0 WHERE producto_id = ?',
            [id]
        );
        return resultado.affectedRows > 0;
    }
}

module.exports = ProductoModel;