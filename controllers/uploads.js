//getTodo
const path = require('path');
const fs = require('fs');

const { response, request } = require('express');
const { v4: uuidv4 } = require('uuid');
const bcryptjs = require('bcryptjs')
const { generarJWT } = require('../helpers/jwt');
const { actualizarImagen } = require('../helpers/actualizar-imagen');


const fileUpload = async(req = request, res) => {
    
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales','medicos','usuarios'];

    if(!tiposValidos.includes(tipo)){
        return res.status(400).json({
            ok: false,
            msg: 'No es un médico,usuario u hospital'
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo'
        });
    }


    const file = req.files.imagen;
    console.log(file);

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado [ nombreCortado.length -1 ];

    //validar extensión
    const extensionesValidas = ['png','jpg','jpeg','gif'];

    if( !extensionesValidas.includes( extensionArchivo ) ){
        return res.status(400).json({
            ok: false,
            msg: 'No es una extensión permitida'
        });
    }

    const nombreArchivo =  `${ uuidv4() }.${ extensionArchivo }`;

    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

      // Use the mv() method to place the file somewhere on your server
    file.mv(path, (err) =>  {
    if (err){
        console.log(err);
        return res.status(500).json({
            ok: false,
            msg: 'Error al mover la imagen'
        });
    }


    actualizarImagen (tipo, id, nombreArchivo);

    res.json({
        ok:true,
        msg: 'Archivo Subido',
        nombreArchivo: nombreArchivo
    });
  });
}

const retornaImagen = (req, res) =>{
    const tipo = req.params.tipo;
    const foto = req.params.foto;
    const pathImg = path.join(__dirname,`../uploads/${ tipo }/${ foto }`);

    if( fs.existsSync( pathImg ) ){
        res.sendFile( pathImg ); 
    } else {
        const pathImg = path.join(__dirname,`../uploads/no-img.jpg`);
        res.sendFile( pathImg );
    }
}


module.exports = {
    fileUpload,
    retornaImagen
}