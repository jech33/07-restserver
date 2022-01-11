
const { response } = require("express");
const { Categoria } = require('../models');




const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuarioAutenticado._id
    }

    const categoria = new Categoria(data);

    // Guardar en DB
    await categoria.save();

    res.status(201).json(categoria);

}


const obtenerCategorias = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(desde)
            .limit(limite)
            .populate('usuario')
    ]).catch((err) => {
        console.log(err);
        return err
    })

    categorias.forEach(categoria => {
        const {__v, password, ...usuario} = categoria.usuario._doc;
        categoria.usuario = {...usuario}
        console.log({...usuario})
    });

    res.json({
        total,
        categorias
    });
}

const obtenerCategoria = async (req, res = response) => {
    const id = req.params.id;

    const categoria = await Categoria.findById(id);

    res.json(categoria)
}

const actualizarCategoria = async (req, res = response) => {

    const id = req.params.id;
    const nombre = req.body.nombre.toUpperCase();    
    
    await Categoria.findByIdAndUpdate(id, {nombre});
    const categoria = await Categoria.findById(id);
    
    res.json({
        "msg": "put API - controlador",
        categoria
    })

}

const eliminarCategoria =  async (req, res = response) => {
    const { id } = req.params;

    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete(id);

    await Categoria.findByIdAndUpdate(id, { estado: false })
    const categoria = await Categoria.findById(id);
    const usuarioAutenticado = req.usuarioAutenticado;


    res.json({
        msg: `La categoria ${categoria.nombre} con id: ${categoria._id} ha sido eliminada`,
        categoria,
        usuarioAutenticado,
    })
}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    eliminarCategoria
}