const { body, validationResult } = require('express-validator');

const reglasProducto = [
    body('categoria_id')
        .notEmpty().withMessage('El campo categoria_id es obligatorio.')
        .isInt({ min: 1 }).withMessage('categoria_id debe ser un número entero positivo.'),

    body('codigo')
        .trim()
        .notEmpty().withMessage('El campo codigo es obligatorio.')
        .isLength({ min: 3, max: 20 }).withMessage('codigo debe tener entre 3 y 20 caracteres.'),

    body('nombre')
        .trim()
        .notEmpty().withMessage('El campo nombre es obligatorio.')
        .isLength({ min: 2, max: 100 }).withMessage('nombre debe tener entre 2 y 100 caracteres.'),

    body('precio_venta')
        .notEmpty().withMessage('El campo precio_venta es obligatorio.')
        .isFloat({ min: 0.01 }).withMessage('precio_venta debe ser un número mayor a cero.'),

    body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('stock debe ser un número entero mayor o igual a cero.'),

    body('stock_minimo')
        .optional()
        .isInt({ min: 0 }).withMessage('stock_minimo debe ser un número entero mayor o igual a cero.')
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

module.exports = { reglasProducto, validar };