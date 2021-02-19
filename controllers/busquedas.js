//getTodo

const { response, request } = require('express');
const bcryptjs = require('bcryptjs')
const Hospital = require('../models/hospital');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const { generarJWT } = require('../helpers/jwt');

const getTodo = async(req = request, res) => {
    
    //const hospitales = await Hospital.find().populate('usuario', 'nombre img');

    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    // const usuarios = await Usuario.find({ nombre: regex});
    // const hospitales = await Hospital.find({ nombre: regex});
    // const medicos = await Medico.find({ nombre: regex});

    const [usuarios, medicos, hospitales] = await Promise.all([
        Usuario.find({ nombre: regex}),
        Hospital.find({ nombre: regex}),
        Medico.find({ nombre: regex})
    ]);
    
    
    res.json({
        ok:true,
        usuarios,
        hospitales,
        medicos

    });
}

const getDocumentosColeccion = async(req = request, res) => {
    
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');
    let data =[];

    switch (tabla) {
        case 'medicos':
            data = await Medico.find({ nombre: regex})
                        .populate('usuario','nombre')
                        .populate('hospital','nombre img');
        break;
        case 'hospitales':
            data = await Hospital.find({ nombre: regex})
                        .populate('usuario','nombre img');
        break;
        case 'usuarios':
            data = await Usuario.find({ nombre: regex});
                        
        break;
        default:
           return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios/medicos/hospitales'
    
            })
    }
    console.log(data);
    res.json({
        ok:true,
        resultados: data
    })
}

module.exports = {
    getTodo,
    getDocumentosColeccion
}