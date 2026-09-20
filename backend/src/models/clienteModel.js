const pool = require('../config/database');

class ClienteModel {

    static async obtenerTodos() {
        const [filas] = await pool.query(
            'SELECT * FROM clientes ORDER BY apellidos, nombres'
        );
        return filas;
    }

    static async obtenerPorId(id) {
        const [filas] = await pool.query(
            'SELECT * FROM clientes WHERE cliente_id = ?',
            [id]
        );
        return filas[0];
    }

    static async crear(datos) {
        const { nombres, apellidos, tipo_doc, num_doc, telefono, email, direccion } = datos;
        const [resultado] = await pool.query(
            `INSERT INTO clientes (nombres, apellidos, tipo_doc, num_doc, telefono, email, direccion, activo)
             VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
            [nombres, apellidos, tipo_doc, num_doc, telefono, email, direccion]
        );
        return { cliente_id: resultado.insertId, ...datos };
    }

    static async actualizar(id, datos) {
        const { nombres, apellidos, tipo_doc, num_doc, telefono, email, direccion } = datos;
        const [resultado] = await pool.query(
            `UPDATE clientes
             SET nombres = ?, apellidos = ?, tipo_doc = ?, num_doc = ?, telefono = ?, email = ?, direccion = ?
             WHERE cliente_id = ?`,
            [nombres, apellidos, tipo_doc, num_doc, telefono, email, direccion, id]
        );
        return resultado.affectedRows > 0;
    }

    static async eliminar(id) {
        const [resultado] = await pool.query(
            'UPDATE clientes SET activo = 0 WHERE cliente_id = ?',
            [id]
        );
        return resultado.affectedRows > 0;
    }
}

module.exports = ClienteModel;