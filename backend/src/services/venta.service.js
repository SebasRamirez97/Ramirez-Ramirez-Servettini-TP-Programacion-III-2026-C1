const { Venta, Producto } = require("../models/index");

const buscarVentasDB = async () => {
    return await Venta.findAll({
        include: {
            model: Producto,
            through: { attributes : ['cantidad']}
        }
    });
};

const buscarVentasPanelDB = async () => {
    return await Venta.findAll({
        include: {
            model: Producto,
            through: { attributes : ['cantidad']}
        },
        order: [['id', 'DESC']] // Ordenamiento para el panel EJS
    });
};

const crearVentaDB = async ({ nombre_cliente, precio_total, productos }) => {
    // 1. Insertamos el registro principal de la venta
    const venta = await Venta.create({
        nombre_cliente,
        precio_total
    });

    // 2. Asociamos los productos en la tabla intermedia
    // Usamos un bucle for...of para asegurar que Sequelize resuelva de forma ordenada 
    // cada asociación en la base de datos antes de dar por terminado el servicio.
    for (const producto of productos) {
        await venta.addProducto(producto.id, {
            through: { cantidad: producto.cantidad }
        });
    }

    return venta;
};

module.exports = {
    buscarVentasDB,
    buscarVentasPanelDB,
    crearVentaDB
};