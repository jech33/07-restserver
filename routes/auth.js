const { Router } = require('express');
const { check } = require('express-validator');

// Require middlewares & controllers 
const { validarCampos } = require('../middlewares/validar-campos');
const { login } = require('../controllers/auth');


// Init router
const router = Router();


// Routes
router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login);



// Export router
module.exports = router;
