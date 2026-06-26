const { 
    buscarProductosDB, 
    buscarProductoPorIdDB, 
    crearProductoDB, 
    actualizarProductoDB, 
    cambiarEstadoProductoDB 
} = require('../services/producto.service');

const getProductos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const offset = (page - 1) * limit;
    const esAdministrador = (req.query.admin === 'true');
    const categoria = req.query.categoria;

        let filtro = {};
        if (!esAdministrador) { filtro.activo = true; }
        if (categoria) { filtro.categoria = categoria; }

        // Llamamos al servicio pasando los parámetros limpios
        const { count, rows } = await buscarProductosDB(filtro, limit, offset);

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
        const producto = await buscarProductoPorIdDB(id);
        
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
        const { nombre, categoria, precio, descripcion } = req.body;
        const imagen = req.file.filename;

        // Armamos el objeto limpio de JS
        const datosNuevoProducto = {
            nombre,
            categoria,
            precio,
            imagen,
            descripcion,
            activo: true
        };

        const producto = await crearProductoDB(datosNuevoProducto);
        res.json(producto);
    } catch (error) {
        res.status(404).json({ error: 'Error al crear el producto' });
    }
};

const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio } = req.body;
        const imagen = req.file ? req.file.filename : undefined;

        // Mandamos los datos sueltos al servicio para que resuelva los fallbacks
        const productoModificado = await actualizarProductoDB(id, { nombre, precio, imagen });
        
        if (!productoModificado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ mensaje: 'Producto modificado con éxito', producto: productoModificado });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

const cambiarEstadoProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

        const productoModificado = await cambiarEstadoProductoDB(id, activo);
        
        if (!productoModificado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ 
            mensaje: `Producto ${activo ? 'activado' : 'desactivado'} correctamente`, 
            producto: productoModificado 
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al cambiar el estado del producto' });
    }
};

module.exports = { 
    getProductos, 
    getProductoById, 
    crearProducto, 
    actualizarProducto, 
    cambiarEstadoProducto
};
