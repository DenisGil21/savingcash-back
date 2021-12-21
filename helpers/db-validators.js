const Usuario = require('../models/usuario');
const Movimiento = require('../models/movimiento');

const usernameExiste = async(username = '') => {
    const existeUsername = await Usuario.findOne({ username });
    if (existeUsername) {
        throw new Error(`El username: ${username} ya esta registrado`)
    }
}

const existeUsuarioPorId = async(id = '') => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe: ${id}`)
    }
}

const existeMovimientoPorId = async(id='') => {
    const existeMovimiento = await Movimiento.findById(id);
    if (!existeMovimiento) {
        throw new Error(`El id no existe: ${id}`);
    } 
}


module.exports = {
    usernameExiste,
    existeUsuarioPorId,
    existeMovimientoPorId
}