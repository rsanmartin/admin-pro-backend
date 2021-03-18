const { response } = require('express');
const bcryptjs = require('bcryptjs')
const Medico = require('../models/medico');
const { generarJWT } = require('../helpers/jwt');
const hospital = require('../models/hospital');

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
    
    const id = req.params.id;
    const uid = req.uid;
    try {

        const medico = await Medico.findById( id );

        if ( !medico ){
            return res.status(404).json({
                ok:true,
                msg: 'Médico no encontrado por id'
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario:uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, {new: true});

        res.json({
            ok:true,
            medico: medicoActualizado
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
    const id = req.params.id;
    try {
        
        const medico = await Medico.findById( id );

        if(!medico){
            return res.status(404).json({
                ok:true,
                msg: 'Medico no encontrado por id'
            });
        }

        await Medico.findOneAndDelete( id );

        res.json({
            ok:true,
            msg: 'Medico eliminado'
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