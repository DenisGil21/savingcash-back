const {response, request} = require('express');
const Movimiento = require('../models/movimiento');

const movimientosGet = async(req = request, res = response) => {
    const {limite = 5, desde = 0} = req.query;
    
    const query = {activo:true};
    
    const [total, movimientos] = await Promise.all([
        Movimiento.countDocuments(query),
        Movimiento.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);
    res.json({
        total, movimientos
    });
} 

const movimientosPost = async(req, res = response) => {
    const {cantidad, tipo, concepto} = req.body;
    const uid = req.uid;

    
    try {
        const movimiento = new Movimiento({cantidad, tipo, concepto, usuario:uid});
        await movimiento.save();
        res.status(201).json({
            movimiento
        });

    }catch(error){
        res.status(500).json({
            msg: 'Error en el servidor'
        });
    }
}

const movimientosPut = async(req, res = response) => {
    const {id} = req.params;
    const {_id, activo,usuario, ...body} = req.body;    
    
    try {
        const movimiento = await Movimiento.findByIdAndUpdate(id, body,{new: true});
        await movimiento.save();
        res.status(201).json({
            movimiento
        });

    }catch(error){
        res.status(500).json({
            msg: 'Error en el servidor'
        });
    }
}

const movimientosDelete = async(req, res = response) => {
    const { id } = req.params;

    try {
        const movimiento = await Movimiento.findByIdAndUpdate(id, {activo: false}, {new: true});
        res.json({
            movimiento
        });
    } catch(error) {
        res.status(500).json({
            msg: 'Error en el servidor'
        });
    }

}

module.exports = {
    movimientosGet,
    movimientosPost,
    movimientosPut,
    movimientosDelete
}