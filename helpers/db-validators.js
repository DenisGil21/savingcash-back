const Usuario = require('../models/usuario');


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


module.exports = {
    usernameExiste,
    existeUsuarioPorId,
}