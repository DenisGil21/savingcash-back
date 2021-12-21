const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');


const usuariosGet = async (req = request, res = response) => {

    const {limite = 5, desde = 0} = req.query;
    
    const query = {activo:true};

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
}


const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, username, ...resto } = req.body;

    
    if (password) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });

    res.status(200).json(usuario);
}

const usuariosPost = async(req, res = response) => {

    const { nombre, username, password, rol } = req.body;
    const usuario = new Usuario({ nombre, username, password, rol });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //Guardar en DB
    await usuario.save();

    res.status(201).json({
        usuario,
    });
}

const usuariosDelete = async(req, res = response) => {
    const { id } = req.params;

    //Fisicamente se borra
    // const usuario = await Usuario.findByIdAndDelete(id);
    const usuario = await Usuario.findByIdAndUpdate(id, { activo: false }, { new: true });

    res.json({
        usuario
    });
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}