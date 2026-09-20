const VentaModel = require('../models/ventaModel');

class VentaController {

    static async listar(req, res, next) {
        try {
            const ventas = await VentaModel.obtenerTodas();
            res.json({
                ok: true,
                mensaje: `${ventas.length} venta(s) encontrada(s).`,
                datos: ventas
            });
        } catch (error) {
            next(error);
        }
    }

    static async obtenerUna(req, res, next) {
        try {
            const venta = await VentaModel.obtenerPorId(req.params.id);
            if (!venta) {
                return res.status(404).json({ ok: false, mensaje: 'Venta no encontrada.' });
            }
            res.json({ ok: true, mensaje: 'Venta encontrada.', datos: venta });
        } catch (error) {
            next(error);
        }
    }

    static async crear(req, res, next) {
        try {
            const { cliente_id, metodo_pago, productos } = req.body;
            const resultado = await VentaModel.crear({ cliente_id, metodo_pago }, productos);

            res.status(201).json({
                ok: true,
                mensaje: 'Venta registrada exitosamente.',
                datos: resultado
            });
        } catch (error) {
            if (error.message.includes('Stock insuficiente')) {
                return res.status(400).json({ ok: false, mensaje: error.message });
            }
            next(error);
        }
    }

    static async anular(req, res, next) {
        try {
            const resultado = await VentaModel.anular(req.params.id);

            if (!resultado.encontrada) {
                return res.status(404).json({ ok: false, mensaje: 'Venta no encontrada.' });
            }

            if (resultado.yaAnulada) {
                return res.status(400).json({ ok: false, mensaje: 'Esta venta ya se encuentra anulada.' });
            }

            res.json({ ok: true, mensaje: 'Venta anulada exitosamente. Stock restaurado.' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = VentaController;