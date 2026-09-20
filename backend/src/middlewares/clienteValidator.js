const { body, validationResult } = require('express-validator');

const reglasCliente = [
    body('nombres')
        .trim()
        .notEmpty().withMessage('El campo nombres es obligatorio.')
        .isLength({ min: 2, max: 50 }).withMessage('Nombres debe tener entre 2 y 50 caracteres.'),

    body('apellidos')
        .trim()
        .notEmpty().withMessage('El campo apellidos es obligatorio.')
        .isLength({ min: 2, max: 50 }).withMessage('Apellidos debe tener entre 2 y 50 caracteres.'),

    body('tipo_doc')
        .trim()
        .notEmpty().withMessage('El campo tipo_doc es obligatorio.')
        .isIn(['CC', 'CE', 'NIT', 'TI', 'PP']).withMessage('tipo_doc debe ser CC, CE, NIT, TI o PP.'),

    body('num_doc')
        .trim()
        .notEmpty().withMessage('El campo num_doc es obligatorio.')
        .isLength({ min: 5, max: 20 }).withMessage('num_doc debe tener entre 5 y 20 caracteres.'),

    body('telefono')
        .optional({ checkFalsy: true })
        .isMobilePhone('es-CO').withMessage('El teléfono no tiene un formato válido.'),

    body('email')
        .optional({ checkFalsy: true })
        .isEmail().withMessage('El email no tiene un formato válido.')
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

module.exports = { reglasCliente, validar };