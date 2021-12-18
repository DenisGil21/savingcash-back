const { response } = require("express");
const Usuario = require('../models');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");

const login = async(req, res = response) => {

    const { username, password } = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({ username });
        if (!usuario) {
            return res.status(400).json({
                msj: 'Usuario / Password no son correctos - correo'
            });
        }
        // Si el usuario está activo
        if (!usuario.activo) {
            return res.status(400).json({
                msj: 'Usuario / Password no son correctos - activo: false'
            });
        }
        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msj: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el admin'
        });
    }

}


module.exports = {
    login
}