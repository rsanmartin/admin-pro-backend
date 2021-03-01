/*
    Ruta: /api/auth
*/ 

const { Router} = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('.././middlewares/validar-campos');
const {login, googleSignIn} = require('../controllers/auth');

const router = Router();

router.post('/',[
    check('email','El email debe ser válido').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty()
    ,
    validarCampos,
],
    login
);

router.post('/google',[
    check('token', 'El token es obligatorio').not().isEmpty()
    ,
    validarCampos,
],
    googleSignIn
);



module.exports = router;