const { z } = require("zod");

function validarCrearProducto(req, res, next) {
    try {
        const esquemaCrear = z.object({
            precio: z.coerce.number({ message: "El precio debe ser un número" }).positive({ message: "El precio debe ser un número positivo" }),
            imagen: z.string({ message: "La imagen es obligatoria y debe ser un texto" })
        });

        const datosAValidar = {
            precio: req.body.precio,
            imagen: req.file ? req.file.filename : undefined
        };

        esquemaCrear.parse(datosAValidar);
        
        next();
    } catch (error) {
        res.status(400).json({ 
            error: "Datos inválidos", 
            detalles: error.errors ? error.errors.map(e => e.message) : error.message 
        });
    }
}

function validarEditarProducto(req, res, next) {
    try {
        const esquemaEditar = z.object({
            precio: z.coerce.number({ message: "El precio debe ser un número" }).positive({ message: "El precio editado debe ser positivo" }).optional(),
            imagen: z.string({ message: "La imagen debe ser un texto" }).optional()
        });

        const datosAValidar = {
            precio: req.body.precio ? req.body.precio : undefined,
            imagen: req.file ? req.file.filename : undefined
        };

        esquemaEditar.parse(datosAValidar);
        
        next();
    } catch (error) {
        res.status(400).json({ 
            error: "Datos inválidos al editar", 
            detalles: error.errors ? error.errors.map(e => e.message) : error.message 
        });
    }
}

module.exports = {
    validarCrearProducto,
    validarEditarProducto
};