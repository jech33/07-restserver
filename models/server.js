const express = require('express')
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios'

        // Middlewares
        this.middlewares();

        // App routes
        this.routes();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Receive and handle JSON Data
        this.app.use(express.json());

        // Public directory
        this.app.use(express.static('public'));
    }

    routes() {

        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Rest server listening at http://localhost:${this.port}`)
        })
    }
}

module.exports = Server;