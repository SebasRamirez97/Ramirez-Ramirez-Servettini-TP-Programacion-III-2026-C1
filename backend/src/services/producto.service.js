const { Producto } = require('../models/index');

const buscarProductosDB = async (filtro, limit, offset) => {
    // El servicio ejecuta la consulta pura y devuelve el conteo y las filas
    return await Producto.findAndCountAll({
        where: filtro,
        limit: limit,
        offset: offset
    });
};

const buscarProductoPorIdDB = async (id) => {
    return await Producto.findByPk(id);
};

const crearProductoDB = async (datosProducto) => {
    return await Producto.create(datosProducto);
};

const actualizarProductoDB = async (id, { nombre, precio, imagen }) => {
    const producto = await Producto.findByPk(id);
    if (!producto) return null; // Si no existe, devolvemos null para que el controlador meta el 404

    // Evaluamos los reemplazos o dejamos los valores existentes de la BD
    const nuevoNombre = nombre ? nombre : producto.nombre;
    const nuevoPrecio = precio ? precio : producto.precio;
    const nuevaImagen = imagen ? imagen : producto.imagen;

    await producto.update({ 
        nombre: nuevoNombre, 
        precio: nuevoPrecio, 
        imagen: nuevaImagen 
    });

    return producto;
};

const cambiarEstadoProductoDB = async (id, activo) => {
    const producto = await Producto.findByPk(id);
    if (!producto) return null;

    await producto.update({ activo });
    return producto;
};

module.exports = {
    buscarProductosDB,
    buscarProductoPorIdDB,
    crearProductoDB,
    actualizarProductoDB,
    cambiarEstadoProductoDB
};