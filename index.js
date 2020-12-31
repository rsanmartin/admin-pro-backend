require('dotenv').config();
const cors = require('cors')
const express = require('express');
const {dbConnection} = require('./database/config');


//Crear el servidor de express
const app  = express();

//configurar CORS
app.use(cors());


//Lectura y parseo del body
app.use( express.json() )

//db
dbConnection();

//Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));


app.listen( process.env.PORT, () =>{
    console.log( 'Servidor corriendo en puerto ' + process.env.PORT );
})