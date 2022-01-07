const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


//// Controller logic

const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try { 

        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - correo"
            })
        }

        // Verificar si el usuario está activo en la base de datos
        if (!usuario.estado) {
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - estado: false"
            })
        }

        // Verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - estado: password"
            })
        }

        // Generar JWT
        const token = await generarJWT(usuario.id)


        res.json({
            msg: 'Login ok',
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Hable con el administrador"
        })
    }

}


const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body;

    try {

        const { correo, nombre, img} = await googleVerify( id_token );
        
        let usuario = await Usuario.findOne({ correo });
        
        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: ':P',
                google: true,
                rol: 'USUARIO_ROLE'
            };
            
            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario está en DB
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );


        res.json({
            usuario,
            token
        })

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: "el token no se pudo verificar"
        })
    }


}



module.exports = {
    login,
    googleSignIn
}