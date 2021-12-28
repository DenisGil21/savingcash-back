const {response, request} = require('express');
const { calcularDatosAhorro } = require('../helpers/function-validators');
const Movimiento = require('../models/movimiento');

const movimientosGet = async(req = request, res = response) => {
    const {limite = 5, desde = 0, mes = null, anio = null} = req.query;

    const query = {
        activo:true, 
    };

    let filter = [{
        $project: {
           anio: { $year: "$fecha" },
           mes: { $month: "$fecha" },
        activo:1,
        document: "$$ROOT"
        }
      },
      {
        $match: {
        //   "anio": mes,
        //   "mes": mes
        activo : true
        }
      },
      {
        $replaceRoot: { "newRoot": "$document" }
      }
    ]
    if (mes) {
        filter[1].$match.mes = parseInt(mes);  

    }
    
    if (anio) {
        filter[1].$match.anio = parseInt(anio);    
    }
    
    const [total, movimientos] = await Promise.all([
        Movimiento.countDocuments(query),
        Movimiento.aggregate(filter)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    const dataDashboard = calcularDatosAhorro(movimientos);
    res.json({
        total,
        ...dataDashboard, 
        movimientos
    });
} 

const movimientosAniosGet = async(req, res = response) => {
    const anios = await Movimiento.aggregate([
        {
            $project:{
                anio: {$year: "$fecha"}
            }
        },
        {
            $group:{
                _id: "$anio",
            },
        }
    ]);

    res.json({
        anios
    })
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
    movimientosDelete,
    movimientosAniosGet
}