const { validationResult } = require('express-validator');

// Middleware para validar campos ingresados en request
const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    next(); // Ejecuta el siguiente middleware o argumento ()
}


module.exports = {
    validarCampos
}