const { response } = require("express");
const { Producto } = require('../models');




const crearProducto = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();
    const { categoria } = req.body;

    const productoDB = await Producto.findOne({ nombre });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        categoria,
        usuario: req.usuarioAutenticado._id
    }

    const producto = new Producto(data);

    // Guardar en DB
    await producto.save();

    const productoJSON = await Producto.findById(producto._id)
        .populate('categoria', 'nombre')
        .populate('usuario', {
            correo: 1
        })

    res.status(201).json({
        msg: 'Producto creado correctamente',
        producto: productoJSON
    });

}


const obtenerProductos = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(desde)
            .limit(limite)
            .populate('categoria', 'nombre')
            .populate('usuario', {
                correo: 1
            })
    ]).catch((err) => {
        console.log(err);
        return err
    })

    res.json({
        total,
        productos
    });
}

const obtenerProducto = async (req, res = response) => {
    const id = req.params.id;

    const producto = await Producto.findById(id)
        .populate('categoria', 'nombre')
        .populate('usuario', 'correo');

    res.json(producto)
}

const actualizarProducto = async (req, res = response) => {

    const id = req.params.id;
    const nombre = req.body.nombre.toUpperCase();
    const { precio, disponible } = req.body

    await Producto.findByIdAndUpdate(id, { nombre, precio, disponible });
    const producto = await Producto.findById(id);

    res.json({
        "msg": "put API - controlador",
        producto
    })

}

const eliminarProducto = async (req, res = response) => {
    const { id } = req.params;

    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete(id);

    await Producto.findByIdAndUpdate(id, { estado: false, disponible: false })
    const producto = await Producto.findById(id);
    const usuarioAutenticado = req.usuarioAutenticado;


    res.json({
        msg: `El producto ${producto.nombre} con id: ${producto._id} ha sido eliminado`,
        producto,
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