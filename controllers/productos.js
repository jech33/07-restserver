const { response } = require("express");
const { Categoria, Producto } = require('../models');




const crearProducto = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const productoDB = await Producto.findOne({ nombre });

    // Validar que la categoria exista

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        categoria: req.body.categoria,
        usuario: req.usuarioAutenticado._id
    }

    const producto = new Producto(data);

    // Guardar en DB
    await producto.save();

    res.status(201).json(producto);

}


const obtenerProductos = async (req, res = response) => {

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

const obtenerProducto = async (req, res = response) => {
    const id = req.params.id;

    const categoria = await Categoria.findById(id);

    res.json(categoria)
}

const actualizarProducto = async (req, res = response) => {

    const id = req.params.id;
    const nombre = req.body.nombre.toUpperCase();    
    
    await Categoria.findByIdAndUpdate(id, {nombre});
    const categoria = await Categoria.findById(id);
    
    res.json({
        "msg": "put API - controlador",
        categoria
    })

}

const eliminarProducto =  async (req, res = response) => {
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
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto
}