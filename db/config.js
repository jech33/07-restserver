const mongoose = require('mongoose')

const dbConnection = async() => {

    try {
        
        await mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } );

        console.log('Conectado correctamente a base de datos');

    } catch (error) {
        console.log(error);
        throw new Error('Error de conexión a la base de datos');
    }

}

module.exports = {
    dbConnection
}