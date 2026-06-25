const { Venta, Producto } = require("../models/index");

// POST: http://localhost:3000/api/ventas/crear
const crearVenta = async (req, res) => {
    try {
        const nombreCliente = req.body.nombre_cliente;
        const precioTotal = parseFloat(req.body.precio_total);
        const productos = req.body.productos;

        if (!productos || productos.length === 0) {
            return res.status(400).json({ error: 'La venta debe contener productos.' });
        }

        // Guarda la cabecera en la tabla 'ventas'
        const venta = await Venta.create({
            nombre_cliente: nombreCliente || 'Cliente Anónimo',
            precio_total: precioTotal
        });

        // Bucle for...of síncrono para Sequelize
        for (const producto of productos) {
            await venta.addProducto(producto.id, {
                through: { cantidad: producto.cantidad }
            });
        }

        res.status(201).json(venta);
    } catch (error) {
        console.error("Error al registrar la venta:", error);
        res.status(500).json({ error: 'Error al registrar la venta' });
    }
};

// GET: http://localhost:3000/api/ventas
const getVentas = async (req, res) => {
    try {
        const ventas = await Venta.findAll({
            include: {
                model: Producto,
                through: { attributes: ['cantidad'] }
            }
        });
        res.json(ventas);
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
};

module.exports = { crearVenta, getVentas };