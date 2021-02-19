const { response } = require('express');
const bcryptjs = require('bcryptjs')
const Hospital = require('../models/hospital');
const { generarJWT } = require('../helpers/jwt');

const getHospitales = async(req, res) => {
    
    const hospitales = await Hospital.find().populate('usuario', 'nombre img');
    
    res.json({
        ok:true,
        hospitales
    });
}

const crearHospital = async(req, res = response) => {
    
    
    const uid = req.uid;
    const hospital = new Hospital( {
        usuario: uid,
        ...req.body
    } );
    

    console.log(uid);

    try {

       const hospitalDB = await hospital.save();


        res.json({
            ok:true,
            hospital: hospitalDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado....'
        });
    }
}

const actualizarHospital = async (req, res = response) => {
    
    try {

        res.json({
            ok:true,
            msg: 'Actualizar hospital'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado....'
        });
    }

}

const borrarHospital = async (req, res = response) => {

    try {
        res.json({
            ok:true,
            msg: 'Eliminar hospital'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado....'
        });
    }
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}