const { z } = require("zod");

// 🛡️ MIDDLEWARE PARA CREAR PRODUCTO
const validarCrearProducto = (req, res, next) => {
    // 1. Definimos el contrato de Zod para las dos cosas que querés cuidar
    const EsquemaCrear = z.object({
        precio: z.coerce.number().positive("El precio debe ser un número positivo"),
        imagen: z.string({ required_error: "La imagen es obligatoria" }) // Exige que sea un texto (el filename)
    });

    // 2. Le pasamos los datos que dejaron las etapas anteriores
    const precioRecibido = req.body.precio;
    // Si Multer subió la foto con éxito, req.file va a existir y tendrá un filename
    const fotoRecibida = req.file ? req.file.filename : undefined;

    // 3. El .parse() de tu profesor: si el precio es negativo o la foto es undefined, ACÁ explota y frena el flujo hacia la BD
    EsquemaCrear.parse({
        precio: precioRecibido,
        imagen: fotoRecibida
    });

    next();
};

// 🛡️ MIDDLEWARE PARA EDITAR PRODUCTO (En la tabla inline, la foto es opcional si dejan la vieja)
const validarEditarProducto = (req, res, next) => {
    const EsquemaEditar = z.object({
        precio: z.coerce.number().positive("El precio editado debe ser positivo").optional(),
        imagen: z.string().optional()
    });

    EsquemaEditar.parse({
        precio: req.body.precio,
        imagen: req.file ? req.file.filename : undefined
    });

    next();
};

module.exports = {
    validarCrearProducto,
    validarEditarProducto
};