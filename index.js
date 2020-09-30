require('dotenv').config();
const cors = require('cors')
const express = require('express');
const {dbConnection} = require('./database/config');


//Crear el servidor de express
const app  = express();

//configurar CORS
app.use(cors());

//db
dbConnection();

//Rutas
app.get('/', (req, res) => {
    res.json({
        ok:true,
        msg: 'Hola Mundo'  
    })
});

app.listen( process.env.PORT, () =>{
    console.log( 'Servidor corriendo en puerto ' + process.env.PORT );
})