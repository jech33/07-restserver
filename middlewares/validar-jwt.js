const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: "No ha especificado token en la petición"
        })
    }

    try {
        
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY);

        req.uid = uid;

        // leer el usuario que corresponde al uid
        const usuarioAutenticado = await Usuario.findById(uid);

        if (!usuarioAutenticado) {
            return res.status(401).json({
                msg: "Token no válido - usuario no existe en BD"
            })
        }

        // Verificar si el uid tiene estado true
        if (!usuarioAutenticado.estado) {
            return res.status(401).json({
                msg: "Token no válido - usuario con estado false"
            })
        }

        req.usuarioAutenticado = usuarioAutenticado;

        next();        
    } catch (error) {
        console.log(token);
        return res.status(401).json({
            msg: "Token no válido"
        })    
    }

}


module.exports = {
    validarJWT
}