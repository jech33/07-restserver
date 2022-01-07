const { Router } = require('express');
const { check } = require('express-validator');

// Require middlewares & controllers 
const { validarCampos } = require('../middlewares/validar-campos');
const { login, googleSignIn } = require('../controllers/auth');


// Init router
const router = Router();


// Routes
router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login);

router.post('/google', [
    check('id_token', 'id_token es necesario').not().isEmpty(),
    validarCampos
],googleSignIn);


// Export router
module.exports = router;
