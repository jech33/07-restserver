# WebServer + RestServer

Reminder! Execute ```npm install``` to install dependencies and node modules.

Now hosted on heroku! -> https://rest-server-node-0-experto.herokuapp.com/api/usuarios
<br/><br/>

# Dev notes

This backend project uses nodeJS to run an API Rest server, containing all the info in a mongo database with different collections.

The structure of the project goes as follows:
```
app
   ├── controllers           # Functions that control the actions on every API route
   ├── db                    # Database config file
   ├── middlewares           # Local developed middlewares to implement in the project
   ├── models                # Project classes (server) including db schemas
   ├── public                # Public archives like index.html
   └── routes                # All valid routes of the project
```
<br/>

### Classes

There's three important files in the models folder:
- **role.js**: it contains a mongoose schema with all valid user roles
- **server.js**: it contains the initial configuration to run the server
- **usuario.js**: it contains a mongoose schema with all users
<br/>

### Mongoose schemas

Mongoose schemas maps to a MongoDB collection and defines the shape of the documents within that collection.
To use a schema definition, the schema needs to be converted into a Model we can work with.
The model can be used to make queries to the database.
<br/><br/>

### Mongo DB

The mongo db is stored in MongoDB Atlas, and can be accessed by Mongo Compass too.
To view the cluster in Mongo Atlas I have to login with my gmail account to MongoDB Atlas and search for MiClusterCafe cluster.
The mongodb connection link is defined in the .env file that is ignored in github (.gitignore).
<br/><br/>

### Controllers

These files controls the logic of every route defined in the routes folder, for example:
> ```router.get('/', (req, res) => {});``` is a router function that handles a get request
> 
> ```router.get('/', usuariosGet);``` now we are handling the request in the usuarioGet function definition
> 
> ```usuarioGet``` is the controller, aka the function that handles the request and returns a response:
>
> ```
>  const usuariosGet = (req = request, res = response) => {
>
>      const { nombre = "No name", q, apikey, page = 1, limit = 1 } = req.query;
>
>      res.json({
>          "msg": "get API - controlador",
>          q,
>          nombre,
>          apikey,
>          page,
>          limit
>      })
>  }
> ```

Pull request test
