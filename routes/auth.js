const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//Crear un usuario
router.post( '/new', [
    check('name','el nombre es obligatorio').not().isEmpty(),
    check('email','el email es obligatorio').isEmail(),
    check('password','la contraseña debe ser minimo de 6 caracteres').isLength({min:6}),
    validarCampos
], crearUsuario);


//Login usuario
router.post( '/', [ 
    check('email','el email es obligatorio').isEmail(),
    check('password','la contraseña debe ser minimo de 6 caracteres').isLength({min:6}),
    validarCampos
], loginUsuario);

//Revalidar Token
router.get( '/renew', [
    validarJWT
], revalidarToken);


module.exports = router;