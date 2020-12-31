const { response } = require('express');
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {
    
    const usuarios = await Usuario.find({}, 'nombre email role google');
    
    res.json({
        ok:true,
        usuarios
    });
}

const crearUsuario = async(req, res = response) => {
    
    //console.log(req.body);

    const {email, password, nombre} = req.body;
    

    try {

        const existeEmail = await Usuario.findOne({email});

        if( existeEmail ){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }


        const usuario = new Usuario( req.body );

        //Encriptar contraseña

        const salt = bcryptjs.genSaltSync();

        usuario.password = bcryptjs.hashSync(password, salt);

        await usuario.save();
        
        //Generar el TOKEN - JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok:true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado....'
        });
    }
}

const actualizarUsuario = async (req, res = response) => {
    
    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        //Actualizaciones
        const {password,google, email,...campos} = req.body;
        
        if(usuarioDB.email !== req.body.email){
            const existeEmail = await Usuario.findOne({ email });
            if(existeEmail){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email.'
                });
            }
        }
        
        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true});

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado....'
        });
    }

}

const borrarUsuario = async (req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);
        
        return res.json({
            ok:true,
            msg: 'Usuario eliminado'
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
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}