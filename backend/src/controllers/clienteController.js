const ClienteModel = require('../models/clienteModel');

class ClienteController {

    static async listar(req, res, next) {
        try {
            const clientes = await ClienteModel.obtenerTodos();
            res.json({
                ok: true,
                mensaje: `${clientes.length} cliente(s) encontrado(s).`,
                datos: clientes
            });
        } catch (error) {
            next(error);
        }
    }

    static async obtenerUno(req, res, next) {
        try {
            const cliente = await ClienteModel.obtenerPorId(req.params.id);
            if (!cliente) {
                return res.status(404).json({
                    ok: false,
                    mensaje: 'Cliente no encontrado.'
                });
            }
            res.json({ ok: true, mensaje: 'Cliente encontrado.', datos: cliente });
        } catch (error) {
            next(error);
        }
    }

    static async crear(req, res, next) {
        try {
            const { nombres, apellidos, tipo_doc, num_doc } = req.body;

            if (!nombres || !apellidos || !tipo_doc || !num_doc) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Los campos nombres, apellidos, tipo_doc y num_doc son obligatorios.'
                });
            }

            const nuevoCliente = await ClienteModel.crear(req.body);
            res.status(201).json({
                ok: true,
                mensaje: 'Cliente registrado exitosamente.',
                datos: nuevoCliente
            });
        } catch (error) {
            next(error);
        }
    }

    static async actualizar(req, res, next) {
        try {
            const { nombres, apellidos, tipo_doc, num_doc } = req.body;

            if (!nombres || !apellidos || !tipo_doc || !num_doc) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Los campos nombres, apellidos, tipo_doc y num_doc son obligatorios.'
                });
            }

            const actualizado = await ClienteModel.actualizar(req.params.id, req.body);
            if (!actualizado) {
                return res.status(404).json({ ok: false, mensaje: 'Cliente no encontrado.' });
            }
            res.json({ ok: true, mensaje: 'Cliente actualizado exitosamente.' });
        } catch (error) {
            next(error);
        }
    }

    static async eliminar(req, res, next) {
        try {
            const eliminado = await ClienteModel.eliminar(req.params.id);
            if (!eliminado) {
                return res.status(404).json({ ok: false, mensaje: 'Cliente no encontrado.' });
            }
            res.json({ ok: true, mensaje: 'Cliente eliminado exitosamente.' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ClienteController;