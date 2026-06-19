const { Producto } = require('../models/index');

const getProductos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const offset = (page - 1) * limit;
        
        const esAdministrador = (req.query.admin === 'true');
        const categoria = req.query.categoria;

        let filtro = {};

        if (!esAdministrador) {filtro.activo = true;}
        
        if (categoria) {filtro.categoria = categoria;}

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
    try{
        const {nombre , categoria , precio , descripcion , activo} = req.body;
        const imagen = req.file.filename;
        const producto = await Producto.create(
            {
                "nombre" : nombre,
                "categoria" : categoria,
                "precio" : precio,
                "imagen" : imagen,
                "descripcion" : descripcion,
                "activo" : true
            }
        );
        res.json(producto);
    }catch (error) {
        res.status(404).json({ error: 'Error al crear el producto' });
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

        let nuevaImagen;
        if (req.file) {
            nuevaImagen = req.file.filename;
        } else {
            nuevaImagen = producto.imagen;
        }

        let nuevoNombre;
        if (nombre) {
            nuevoNombre = nombre;
        } else {
            nuevoNombre = producto.nombre;
        }

        let nuevoPrecio;
        if (precio) {
            nuevoPrecio = precio;
        } else {
            nuevoPrecio = producto.precio;
        }

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
    getProductos, getProductoById, crearProducto, actualizarProducto , cambiarEstadoProducto
};

