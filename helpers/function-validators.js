const calcularDatosAhorro = (movimientos) => {

    let ingresoMensual = 0, gastoMensual = 0, saldoTotal = 0;

    const fechaActual = new Date();
    let fechaMovimiento;

    movimientos.forEach(movimiento => {
        fechaMovimiento = new Date (movimiento.fecha)
        if (fechaActual.getFullYear === fechaMovimiento.getFullYear &
            fechaActual.getMonth === fechaMovimiento.getMonth) {
                if (movimiento.tipo === 'INGRESO') {
                    ingresoMensual += movimiento.cantidad;
                } else {
                    gastoMensual += movimiento.cantidad;
                }
        }

        saldoTotal += movimiento.cantidad;

    });

    return {
        ingresoMensual,
        gastoMensual,
        saldoTotal
    }

}

module.exports = {
    calcularDatosAhorro
}