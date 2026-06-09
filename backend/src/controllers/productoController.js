// “Base de datos falsa” en memoria
let productos = [];

// GET /api/productos
const getProductos = (req, res) => {
    res.json(productos);
};

// POST /api/productos
const crearProducto = (req, res) => {
    const nuevoProducto = {
        id: productos.length + 1,
        ...req.body
    };

    productos.push(nuevoProducto);
    res.json(nuevoProducto);
};

// DELETE /api/productos/:id
const eliminarProducto = (req, res) => {
    const id = parseInt(req.params.id);

    productos = productos.filter(p => p.id !== id);

    res.json({ mensaje: "Producto eliminado" });
};

// EXPORTACIÓN CORRECTA
module.exports = {
    getProductos,
    crearProducto,
    eliminarProducto
};