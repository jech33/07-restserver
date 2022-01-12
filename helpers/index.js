

const dbvalidators = require('./db-validators')
const generarJWT = require('./generar-jwt')
const googleVerify = require('./google-verify')
const subirArchivo = require('./subir-archivo')


module.exports = {
    ...dbvalidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo,
}