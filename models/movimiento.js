const {Schema, model} =  require('mongoose');

const MovimientoSchema = Schema({
    cantidad: {
        type: Number,
        required: [true, 'La cantidad es obligatorio']
    },
    tipo: {
        type: String,
        required: true,
        enum: ['RETIRO', 'INGRESO']
    },
    concepto: {
        type: String,
        require: [true, 'El concepto es obligatorio']
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true
    },
    activo: {
        type: Boolean,
        default: true
    }
});

MovimientoSchema.methods.toJSON = function(){
    const {__v, ...movimiento} = this.toObject();
    return movimiento
}

module.exports = model('Movimiento', MovimientoSchema);
