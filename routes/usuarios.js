const { Router } = require('express');
const { check } = require('express-validator');

const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete } = require('../controllers/usuarios');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');
const { usernameExiste, existeUsuarioPorId } = require('../helpers');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validarCampos
], usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('username', 'El username es obligatorio').not().isEmpty(),
    check('username').custom(usernameExiste),
    check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validarCampos
], usuariosPost);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);


module.exports = router;