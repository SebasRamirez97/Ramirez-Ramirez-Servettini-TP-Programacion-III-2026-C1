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

module.exports = {crearVenta , getVentas};