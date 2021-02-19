const { response } = require('express');
const bcryptjs = require('bcryptjs')
const Medico = require('../models/medico');
const { generarJWT } = require('../helpers/jwt');

const getMedicos = async(req, res) => {
    
    const medicos = await Medico.find()
    .populate('usuario', 'nombre img')
    .populate('hospital', 'nombre')


    res.json({
        ok:true,
        medicos: medicos
    });
}

const crearMedico = async(req, res = response) => {
    
    const uid = req.uid;
    const medico = new Medico( {
        usuario: uid,
        ...req.body
    } );


    try {

        const medicoDB = await medico.save();


        res.json({
            ok:true,
            medico: medicoDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado....'
        });
    }
}

const actualizarMedico = async (req, res = response) => {
    
    try {

        res.json({
            ok:true,
            msg: 'Actualizar Medico'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado....'
        });
    }

}

const borrarMedico = async (req, res = response) => {

    try {
        res.json({
            ok:true,
            msg: 'Eliminar Medico'
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
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}