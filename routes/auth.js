const { Router } = require('express');
const { check } = require('express-validator');
const { login, renewToken } = require('../controllers/auth');
const { validarCampos, validarJWT } = require('../middlewares');

const router = Router();

router.post('/login', [
    check('username', 'El username es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

router.get('/renew',
    validarJWT,
    renewToken
)


module.exports = router;