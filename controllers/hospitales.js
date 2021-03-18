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
    
    const id = req.params.id;
    const uid = req.uid;
    
    try {

        const hospital = await Hospital.findById( id );

        if(!hospital){
            return res.status(404).json({
                ok:true,
                msg: 'Hospital no encontrado por id'
            });
        }

        const cambiosHospital = {
            ...req.body,
            usuario:uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, {new: true});

        res.json({
            ok:true,
            hospital: hospitalActualizado

        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const borrarHospital = async (req, res = response) => {

    const id = req.params.id;


    try {

        const hospital = await Hospital.findById( id );

        if(!hospital){
            return res.status(404).json({
                ok:true,
                msg: 'Hospital no encontrado por id'
            });
        }

        await Hospital.findOneAndDelete( id );

        res.json({
            ok:true,
            msg: 'Hospital eliminado' 
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