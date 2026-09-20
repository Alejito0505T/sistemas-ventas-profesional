const { body, validationResult } = require('express-validator');

const reglasVenta = [
    body('cliente_id')
        .notEmpty().withMessage('El campo cliente_id es obligatorio.')
        .isInt({ min: 1 }).withMessage('cliente_id debe ser un número entero positivo.'),

    body('metodo_pago')
        .trim()
        .notEmpty().withMessage('El campo metodo_pago es obligatorio.')
        .isIn(['Efectivo', 'Tarjeta Débito', 'Tarjeta Crédito', 'Transferencia'])
        .withMessage('metodo_pago debe ser Efectivo, Tarjeta Débito, Tarjeta Crédito o Transferencia.'),

    body('productos')
        .isArray({ min: 1 }).withMessage('Debe incluir al menos un producto en la venta.'),

    body('productos.*.producto_id')
        .notEmpty().withMessage('Cada producto debe tener un producto_id.')
        .isInt({ min: 1 }).withMessage('producto_id debe ser un número entero positivo.'),

    body('productos.*.cantidad')
        .notEmpty().withMessage('Cada producto debe tener una cantidad.')
        .isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero mayor a cero.'),

    body('productos.*.precio_unitario')
        .notEmpty().withMessage('Cada producto debe tener un precio_unitario.')
        .isFloat({ min: 0.01 }).withMessage('El precio_unitario debe ser mayor a cero.')
];

function validar(req, res, next) {
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error de validación en los datos enviados.',
            errores: errores.array().map(e => ({ campo: e.path, mensaje: e.msg }))
        });
    }

    next();
}

module.exports = { reglasVenta, validar };