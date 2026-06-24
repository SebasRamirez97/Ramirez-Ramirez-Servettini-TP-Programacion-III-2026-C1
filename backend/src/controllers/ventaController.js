const {
    buscarVentasDB,
    buscarVentasPanelDB,
    crearVentaDB
} = require("../services/venta.service");

// 🌐 1. OPERACIONES DE LA API (RESPUESTAS JSON)

const getVentas = async (req, res) => {
    try {
        const ventas = await buscarVentasDB();
        res.json(ventas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
};

const crearVenta = async (req, res) => {
    try {
        const nombreCliente = req.body.nombre_cliente;
        const precioTotal = parseFloat(req.body.precio_total);
        const productos = req.body.productos;

        // Delegamos toda la lógica de inserciones y relaciones al servicio
        const nuevaVenta = await crearVentaDB({
            nombre_cliente: nombreCliente,
            precio_total: precioTotal,
            productos: productos
        });

        res.json(nuevaVenta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar la venta' });
    }
};

// 🖥️ 2. OPERACIONES DE RENDERIZADO (VISTAS EJS)

const mostrarVentasPanel = async (req, res) => {
    try {
        // El servicio hace el JOIN de MySQL y nos da la lista limpia
        const ventasYProductos = await buscarVentasPanelDB();
        
        // El controlador dibuja la plantilla ventas.ejs
        res.render('ventas', { ventas: ventasYProductos });
    } catch (error) {
        console.error("Error al renderizar el panel de finanzas:", error);
        res.status(500).send('Error al cargar los datos en la plantilla.');
    }
};

module.exports = { 
    crearVenta, 
    getVentas, 
    mostrarVentasPanel 
};