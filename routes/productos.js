const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, eliminarProducto } = require('../controllers/productos');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');
const { tieneRole } = require('../middlewares/validar-admin-roles');

// Require middlewares & controllers 
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


// Init router
const router = Router();

// Routes
// {{url}}/api/productos

// Obtener todas las productos - publico
router.get('/', [
    validarCampos
], obtenerProductos)

// Get obtener un producto por id - publico
router.get('/:id', [
    check('id', 'No es un ID Válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto)

// Post crear un nuevo producto - privado - cualquier persona con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto)

// Put Actualizar - privado - cualquier con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID Válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto)

// Delete - borrar un producto
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID Válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], eliminarProducto)




// Export router
module.exports = router;