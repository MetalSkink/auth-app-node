const express = require('express');
const cors = require('cors');
const path = require('path');
const { dbConnection } = require('./db/config');
require('dotenv').config();

//console.log(process.env);

//Crear el servidor de express
const app = express();

//conexion a la database
dbConnection();

// Directorio publico
app.use(express.static('public'))

//CORS
app.use(cors());

//Lectura y parseo del body
app.use(express.json());

//Rutas
app.use( '/api/auth', require('./routes/auth') );

//Manejar demas rutas
app.get( '*',(req,res)=>{
    res.sendFile(path.resolve( __dirname, 'public/index.html'))
} )

app.listen(process.env.PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});