const { Producto } = require('../models/index');

const getProductos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const offset = (page - 1) * limit;
        
        // Capturamos los parámetros de la request
        const esAdministrador = (req.query.admin === 'true');
        const categoria = req.query.categoria;

        // Definimos el objeto 'where' dinámicamente
        let filtro = {};

        // 1. Lógica con if/else para los productos activos
        if (!esAdministrador) {
            filtro.activo = true;
        }

        // 2. Lógica con if/else para la categoría
        if (categoria) {
            filtro.categoria = categoria;
        }

        const { count, rows } = await Producto.findAndCountAll({
            where: filtro,
            limit: limit,
            offset: offset
        });

        res.json({
            total: count,
            paginas: Math.ceil(count / limit),
            paginaActual: page,
            productos: rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

const getProductoById = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

const crearProducto = async (req, res) => {
    try {
        const { nombre, precio, tipo } = req.body;
        
        const imagen = req.file ? req.file.filename : 'default.jpg'; 

        const nuevoProducto = await Producto.create({
            nombre,
            precio,
            tipo,
            imagen,
            activo: true
        });

        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
};

const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio } = req.body;
        
        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Lógica de imagen sin ternarios
        let nuevaImagen;
        if (req.file) {
            nuevaImagen = req.file.filename;
        } else {
            nuevaImagen = producto.imagen;
        }

        // Lógica de nombre sin ternarios
        let nuevoNombre;
        if (nombre) {
            nuevoNombre = nombre;
        } else {
            nuevoNombre = producto.nombre;
        }

        // Lógica de precio sin ternarios
        let nuevoPrecio;
        if (precio) {
            nuevoPrecio = precio;
        } else {
            nuevoPrecio = producto.precio;
        }

        // Guardamos los cambios
        await producto.update({ 
            nombre: nuevoNombre, 
            precio: nuevoPrecio, 
            imagen: nuevaImagen 
        });

        res.json({ mensaje: 'Producto modificado con éxito', producto });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

const cambiarEstadoProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;

        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        await producto.update({ activo });

        res.json({ 
            mensaje: `Producto ${activo ? 'activado' : 'desactivado'} correctamente`, 
            producto 
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al cambiar el estado del producto' });
    }
};

module.exports = { 
    getProductos, getProductoById, crearProducto, actualizarProducto, cambiarEstadoProducto 
};

