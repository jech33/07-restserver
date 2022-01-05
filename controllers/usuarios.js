const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { validationResult } = require('express-validator');

const usuariosGet = (req = request, res = response) => {

    const { nombre = "No name", q, apikey, page = 1, limit = 1 } = req.query;

    res.json({
        "msg": "get API - controlador",
        q,
        nombre,
        apikey,
        page,
        limit
    })
}

const usuariosPost = async (req = request, res = response) => {

    const { nombre, correo, password, rol  } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });
    
    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        return res.status(400).json({
            msg: "El correo ya está registrado"
        })
    }

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt )

    // Guardar en BD
    await usuario.save();

    res.json({
        msg: "post API - controlador",
        usuario
    })
}

const usuariosPut = (req = request, res = response) => {
    const id = req.params.id;
    res.json({
        "msg": "put API - controlador",
        id
    })
}

const usuariosPatch = (req = request, res = response) => {
    res.json({
        "msg": "patch API - controlador"
    })
}

const usuariosDelete = (req = request, res = response) => {
    res.json({
        "msg": "delete API - controlador"
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}