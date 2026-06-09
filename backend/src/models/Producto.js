let productos = [];

// GET
const getProductos = (req, res) => {
    res.json(productos);
};

// POST
const crearProducto = (req, res) => {
    const nuevo = {
        id: productos.length + 1,
        ...req.body
    };
    productos.push(nuevo);
    res.json(nuevo);
};

// DELETE
const eliminarProducto = (req, res) => {
    const id = parseInt(req.params.id);
    productos = productos.filter(p => p.id !== id);
    res.json({ mensaje: "Producto eliminado" });
};

module.exports = {
    getProductos,
    crearProducto,
    eliminarProducto
};