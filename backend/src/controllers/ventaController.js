const { Venta , Producto , VentaProductos} = require("../models/index");

const getVentas = async(req,res)=>{
    try{
        const ventas = await Venta.findAll({
            include: {
                model: Producto,
                through: { attributes : ['cantidad']}
            }
        });
        res.json(ventas);
    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Error al obtener los datos'});
    }
};

const crearVenta = async(req,res)=>{
    try{
        const nombreCliente = req.body.nombre_cliente;
        const precioTotal = parseFloat(req.body.precio_total);
        const productos = req.body.productos;

        const venta = await Venta.create({
            nombre_cliente: nombreCliente,
            precio_total: precioTotal
        });

        productos.forEach(async function(producto) {
            await venta.addProducto(producto.id ,{
                through: { cantidad : producto.cantidad}
            });
        });
        res.json(venta);
    }catch(error){
        res.status(500).json({ error: 'Error al registrar la venta' });
    }
};

const mostrarVentasPanel = async (req, res) => {
    try {
        // Usamos tu misma consulta exacta (le sumamos un ordenamiento opcional para ver las últimas primero)
        const ventasYProductos = await Venta.findAll({
            include: {
                model: Producto,
                through: { attributes : ['cantidad']}
            },
            order: [['id', 'DESC']]
        });

        // Despachamos la plantilla pasándole tus datos reales de MySQL
        res.render('ventas', { ventas: ventasYProductos });

    } catch (error) {
        console.error("Error al renderizar el panel de finanzas:", error);
        res.status(500).send('Error al cargar los datos en la plantilla.');
    }
};

module.exports = {crearVenta , getVentas, mostrarVentasPanel};