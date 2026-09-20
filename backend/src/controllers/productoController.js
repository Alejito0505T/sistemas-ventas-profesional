const ProductoModel = require('../models/productoModel');

class ProductoController {

    static async listar(req, res, next) {
        try {
            const productos = await ProductoModel.obtenerTodos();
            res.json({
                ok: true,
                mensaje: `${productos.length} producto(s) encontrado(s).`,
                datos: productos
            });
        } catch (error) {
            next(error);
        }
    }

    static async obtenerUno(req, res, next) {
        try {
            const producto = await ProductoModel.obtenerPorId(req.params.id);
            if (!producto) {
                return res.status(404).json({
                    ok: false,
                    mensaje: 'Producto no encontrado.'
                });
            }
            res.json({ ok: true, mensaje: 'Producto encontrado.', datos: producto });
        } catch (error) {
            next(error);
        }
    }

    static async stockBajo(req, res, next) {
        try {
            const productos = await ProductoModel.obtenerStockBajo();
            res.json({
                ok: true,
                mensaje: `${productos.length} producto(s) con stock bajo.`,
                datos: productos
            });
        } catch (error) {
            next(error);
        }
    }

    static async crear(req, res, next) {
        try {
            const { categoria_id, codigo, nombre, precio_venta } = req.body;

            if (!categoria_id || !codigo || !nombre || !precio_venta) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Los campos categoria_id, codigo, nombre y precio_venta son obligatorios.'
                });
            }

            const nuevoProducto = await ProductoModel.crear(req.body);
            res.status(201).json({
                ok: true,
                mensaje: 'Producto registrado exitosamente.',
                datos: nuevoProducto
            });
        } catch (error) {
            next(error);
        }
    }

    static async actualizar(req, res, next) {
        try {
            const { categoria_id, codigo, nombre, precio_venta } = req.body;

            if (!categoria_id || !codigo || !nombre || !precio_venta) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Los campos categoria_id, codigo, nombre y precio_venta son obligatorios.'
                });
            }

            const actualizado = await ProductoModel.actualizar(req.params.id, req.body);
            if (!actualizado) {
                return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado.' });
            }
            res.json({ ok: true, mensaje: 'Producto actualizado exitosamente.' });
        } catch (error) {
            next(error);
        }
    }

    static async eliminar(req, res, next) {
        try {
            const eliminado = await ProductoModel.eliminar(req.params.id);
            if (!eliminado) {
                return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado.' });
            }
            res.json({ ok: true, mensaje: 'Producto eliminado exitosamente.' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProductoController;