const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, eliminarProducto } = require('../controllers/productos');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { tieneRole } = require('../middlewares/validar-admin-roles');

// Require middlewares & controllers 
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


// Init router
const router = Router();

// Routes
// {{url}}/api/categorias

// Obtener todas las categorias - publico
router.get('/', [
    validarCampos
], obtenerProductos)

// Get obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID Válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerProducto)

// Post crear una nueva categoria - privado - cualquier persona con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearProducto)

// Put Actualizar - privado - cualquier con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID Válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarProducto)

// Delete - borrar una categoria
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID Válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], eliminarProducto)




// Export router
module.exports = router;