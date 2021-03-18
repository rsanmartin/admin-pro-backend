const { response } = require('express');
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
 
const login = async(req, res = response) => {

    const { email, password } = req.body;
    
    try {

        const usuarioDB = await Usuario.findOne({email});
        
        
        // verificar
        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'email no encontrado'
            })
        }

        const validPassword = bcryptjs.compareSync(password, usuarioDB.password);

        if (!validPassword){
            return res.status(400).json({
                ok: true,
                msg: 'Contraseña no válida'
            });
        }

        //Generar el TOKEN - JWT
        const token = await generarJWT(usuarioDB.id);


        return res.json({
            ok: true,
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

const googleSignIn = async(req, res = response) => {

    const googleToken = req.body.token;

    try {
        const {name, email, picture} = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if( !usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        } else {
            //existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        //Guardar usuario
        await usuario.save();

        //Generar el TOKEN - JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            token
        });

    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'token inválido'
        });
    }

    
}

const renewToken = async(req, res = response) => {

    const uid = req.uid;
    
    //Generar el TOKEN - JWT
    const token = await generarJWT(uid);

    res.json({
        ok: true,
        token
    });

}

module.exports = {
    login,
    googleSignIn,
    renewToken
}