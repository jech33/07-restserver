

const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

CategoriaSchema.methods.toJSON = function() {
    const { __v, _id, ...categorias } = this.toObject();
    return {
        "_id": _id, 
        ...categorias
    };
}

module.exports = model( 'Categoria', CategoriaSchema);