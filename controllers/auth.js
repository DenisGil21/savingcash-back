const { response } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers');

const login = async(req, res = response) => {

    const { username, password } = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({ username });
        if (!usuario) {
            return res.status(400).json({
                msj: 'Usuario / Password no son correctos'
            });
        }
        // Si el usuario está activo
        if (!usuario.activo) {
            return res.status(400).json({
                msj: 'Usuario / Password no son correctos'
            });
        }
        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msj: 'Usuario / Password no son correctos'
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

const renewToken = async(req, res = response) => {

    const uid = req.uid;

    //Generar el TOKEN -jwt
    const token = await generarJWT(uid);

    //Obtener usuario por uid
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        token,
        usuario,
    });
}


module.exports = {
    login,
    renewToken
}