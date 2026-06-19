// src/middlewares/validarId.js

const validarId = (req, res, next) => {
    const { id } = req.params;

    // 1. Validamos que no sea un "No-Número" (NaN)
    // 2. Con una expresión regular (^\d+$) nos aseguramos de que sean SOLO dígitos enteros (evita decimales como 12.5 o negativos)
    if (isNaN(id) || !/^\d+$/.test(id)) {
        return res.status(400).json({
            ok: false,
            msg: 'El parámetro ID debe ser un número entero válido.'
        });
    }

    // Opcional: Convertir el parámetro a tipo Number nativo para que tus controladores lo reciban limpio
    req.params.id = parseInt(id, 10);

    // Si todo está bien, pasa al siguiente controlador/middleware
    next();
};

module.exports = validarId;