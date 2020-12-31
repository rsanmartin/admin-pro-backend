const { response } = require('express');
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

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

module.exports = {
    login
}