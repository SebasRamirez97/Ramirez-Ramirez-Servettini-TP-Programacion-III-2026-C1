function verificarIdEntero(req, res, next){

    const idRecibido = req.params.id;

    const numeroConvertido = Number(idRecibido);

    if (isNaN(numeroConvertido) || !Number.isInteger(numeroConvertido) || numeroConvertido <= 0){

        return res.status(400).json({
            error: "El parametro ID debe ser un numero entero positivo"
        });
    }
    next();
}

module.exports = { verificarIdEntero };