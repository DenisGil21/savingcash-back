const { Router } = require('express');
const { check } = require('express-validator');
const { movimientosGet, movimientosPost, movimientosPut, movimientosDelete} = require('../controllers/movimientos');
const { validarJWT, validarCampos } = require('../middlewares');
const { existeMovimientoPorId } = require('../helpers');

const router = Router();

router.get('/', [
    validarJWT,
], movimientosGet);

router.post('/', [
    validarJWT,
    check('cantidad', 'La cantidad es obligatoria').not().isEmpty(),
    check('tipo', 'No es un tipo valido (RETIRO/INGRESO)').isIn(['RETIRO', 'INGRESO']),
    check('concepto', 'El concepto es obligatorio').not().isEmpty(),
    validarCampos
], movimientosPost);

router.put('/:id',[
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeMovimientoPorId),
    check('tipo', 'No es un tipo valido (RETIRO/INGRESO)').isIn(['RETIRO', 'INGRESO']),
    validarCampos
], movimientosPut);

router.delete('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeMovimientoPorId),
    validarCampos
], movimientosDelete)

module.exports = router;